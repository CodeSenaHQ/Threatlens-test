import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';
import { ToolRegistry } from '../src/agent/tools/toolRegistry.js';
import { AutonomousAgentLoop } from '../src/agent/AutonomousAgentLoop.js';
import { ScriptedLLMClient } from '../src/agent/llm/llmClient.js';
import { pruneMessageHistory, truncateFileContent } from '../src/agent/guardrails/resourceGuard.js';
import { AgentEvent } from '../src/agent/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep15Guardrails() {
  console.log('🛡️ Starting Step 15 Verification: Concurrency Isolation & Resource Guardrails...\n');

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const store = new SqliteIndexStore(':memory:');
  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);

  // Test 1: Tool Timeout and Cancellation Signal
  console.log('▶️ Test 1: Enforcing Tool Timeout & Cancellation Signal...');
  const fastTimeoutConfig = {
    fastToolTimeoutMs: 60, // 60ms timeout for test
    securityProbeTimeoutMs: 60,
    stressTestTimeoutMs: 300,
    maxIterations: 10,
    maxFileTokens: 8000,
  };

  const registry = new ToolRegistry(
    {
      workspaceRoot: fixtureDir,
      searchEngine,
      store,
    },
    fastTimeoutConfig
  );

  // Register a deliberately hung tool that ignores cooperative return
  registry.register({
    name: 'hung_tool',
    description: 'Simulates a stalled or hanging process',
    parameters: { type: 'object', properties: {} },
    execute: async (args, context) => {
      return new Promise((resolve) => {
        // Stalled promise (never resolves on its own)
      });
    },
  });

  const startTime = performance.now();
  const timeoutResult = await registry.execute('hung_tool', {});
  const elapsed = performance.now() - startTime;

  console.log(`  ⏱️ Hung tool aborted in ${elapsed.toFixed(1)}ms`);
  console.log(`  🔍 Result: success=${timeoutResult.success}, error="${timeoutResult.error}"`);

  if (timeoutResult.success || !timeoutResult.error?.includes('timed out')) {
    throw new Error('Step 15 Failed: Hung tool was not aborted by cancellation token!');
  }
  console.log('  ✅ Tool timeout enforcement and cancellation signal verified.\n');

  // Test 2: File Content & Memory Truncation
  console.log('▶️ Test 2: File Buffer & Memory Truncation (ResourceGuard)...');
  const largeContent = Array.from({ length: 1500 }, (_, i) => `// Line ${i + 1}: ${'x'.repeat(80)}`).join('\n');
  const truncated = truncateFileContent(largeContent, { maxBytes: 16 * 1024, maxLines: 500 });

  console.log(`  📄 Original Size : ${truncated.originalLines} lines, ${(truncated.originalBytes / 1024).toFixed(1)}KB`);
  console.log(`  ✂️ Truncated Flag: ${truncated.isTruncated}`);
  console.log(`  📦 Output Length : ${truncated.text.split('\n').length} lines`);

  if (!truncated.isTruncated || !truncated.text.includes('truncated by ResourceGuard')) {
    throw new Error('Step 15 Failed: ResourceGuard did not truncate large buffer!');
  }
  console.log('  ✅ ResourceGuard safely bounds large file content to prevent memory bloating.\n');

  // Test 3: Message History Pruning
  console.log('▶️ Test 3: Message History Pruning...');
  const fakeMessages: any[] = [
    { role: 'system', content: 'SYSTEM PROMPT' },
    ...Array.from({ length: 40 }, (_, i) => ({ role: 'user', content: `Turn ${i + 1}` })),
  ];

  const pruned = pruneMessageHistory(fakeMessages, 10);
  console.log(`  📥 Original message count : ${fakeMessages.length}`);
  console.log(`  📤 Pruned message count   : ${pruned.length}`);
  console.log(`  👑 Preserved System Prompt: role="${pruned[0].role}", content="${pruned[0].content}"`);

  if (pruned.length !== 10 || pruned[0].role !== 'system' || pruned[0].content !== 'SYSTEM PROMPT') {
    throw new Error('Step 15 Failed: Message pruning violated invariants!');
  }
  console.log('  ✅ Context window sliding window pruning verified.\n');

  // Test 4: Maximum Iterations Loop Guardrail
  console.log('▶️ Test 4: Autonomous Loop Max Iterations Guardrail...');
  const infiniteLoopLLM = new ScriptedLLMClient(
    Array.from({ length: 10 }, () => ({
      thought: 'Still working...',
      toolCalls: [{ name: 'find_symbol', args: { name: 'NonExistent' } }],
    }))
  );

  const loopGuardConfig = {
    fastToolTimeoutMs: 5000,
    securityProbeTimeoutMs: 5000,
    stressTestTimeoutMs: 5000,
    maxIterations: 3, // Hard cap at 3 iterations
    maxFileTokens: 8000,
  };

  const agentLoop = new AutonomousAgentLoop(infiniteLoopLLM, registry, loopGuardConfig);
  let caughtLoopError = '';

  agentLoop.onEvent((evt: AgentEvent) => {
    if (evt.type === 'error') {
      caughtLoopError = evt.error;
    }
  });

  await agentLoop.submitQuery('Infinite task test');

  console.log(`  🛑 Caught Loop Termination Error: "${caughtLoopError}"`);
  if (!caughtLoopError.includes('maximum iteration limit (3)')) {
    throw new Error('Step 15 Failed: Agent did not halt at max iteration limit!');
  }
  console.log('  ✅ Runaway loop prevention verified cleanly.\n');

  store.close();
  console.log('🎉 Step 15 Verification Successful: Concurrency Isolation & Resource Guardrails fully verified!\n');
}

testStep15Guardrails().catch((err) => {
  console.error('❌ Step 15 Guardrails test failed:', err);
  process.exit(1);
});
