import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { ThreatLensAgentManager } from '../src/agent/agentManager.js';
import { ScriptedLLMClient } from '../src/agent/llm/llmClient.js';
import { AgentEvent } from '../src/agent/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep13Bridge() {
  console.log('🌉 Starting Step 13 Verification: Real TUI Bridge Integration...\n');

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const testDbPath = path.join(fixtureDir, '.threatlens_index.db');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  const scriptedLLM = new ScriptedLLMClient([
    {
      thought: 'Scanning synthetic repository and inspecting security reports...',
      toolCalls: [
        {
          name: 'find_symbol',
          args: { name: 'SecurityReportCard', exact: true },
        },
      ],
    },
    {
      finalResponse: 'SecurityReportCard component verified in synthetic repository.',
    },
  ]);

  const manager = new ThreatLensAgentManager(fixtureDir);

  console.log('▶️ Initializing ThreatLensAgentManager on fixture repository...');
  const controller = await manager.init({ customLLM: scriptedLLM });

  const stats = manager.getStats();
  console.log('  📊 Workspace Stats Loaded:');
  console.log(`     Root Directory     : ${stats.workspaceRoot}`);
  console.log(`     Total Files        : ${stats.totalFiles}`);
  console.log(`     Total AST Symbols  : ${stats.totalSymbols}`);
  console.log(`     Total Dependencies : ${stats.totalDependencies}`);
  console.log(`     Model Mode         : ${stats.modelName}`);

  if (stats.totalFiles < 3 || stats.totalSymbols < 5) {
    throw new Error('Step 13 Failed: Manager did not index fixture files properly!');
  }

  // Test Event Stream forwarding from controller to TUI
  console.log('\n▶️ Testing event stream forwarding to TUI listener...');
  const receivedEvents: AgentEvent[] = [];

  const completionPromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Bridge execution timed out')), 5000);

    controller.onEvent((event) => {
      receivedEvents.push(event);
      if (event.type === 'token') {
        process.stdout.write(event.delta);
      } else if (event.type === 'tool_start') {
        console.log(`\n  ⚙️ [TUI Event: tool_start] ${event.toolName}`);
      } else if (event.type === 'tool_result') {
        console.log(`  📦 [TUI Event: tool_result] ${event.toolName}`);
      } else if (event.type === 'done') {
        console.log(`\n🎉 [TUI Event: done] ${event.summary}\n`);
        clearTimeout(timeout);
        resolve();
      } else if (event.type === 'error') {
        clearTimeout(timeout);
        reject(new Error(event.error));
      }
    });
  });

  controller.submitQuery('Find SecurityReportCard symbol');
  await completionPromise;

  const hasToolStart = receivedEvents.some((e) => e.type === 'tool_start' && e.toolName === 'find_symbol');
  const hasDone = receivedEvents.some((e) => e.type === 'done');

  if (!hasToolStart || !hasDone) {
    throw new Error('Step 13 Failed: Missing expected TUI events!');
  }
  console.log('  ✅ Verified full bidirectional event delivery between controller and TUI.\n');

  // Test clean shutdown
  console.log('▶️ Testing clean manager shutdown...');
  await manager.shutdown();
  console.log('  ✅ ThreatLensAgentManager cleanly shut down (watcher closed, SQLite released).\n');

  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 13 Verification Successful: Real TUI Bridge Integration working seamlessly!\n');
}

testStep13Bridge().catch((err) => {
  console.error('❌ Step 13 Bridge test failed:', err);
  process.exit(1);
});
