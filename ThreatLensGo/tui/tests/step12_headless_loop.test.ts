import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';
import { ToolRegistry } from '../src/agent/tools/toolRegistry.js';
import { AutonomousAgentLoop } from '../src/agent/AutonomousAgentLoop.js';
import { ScriptedLLMClient, ScriptedStep } from '../src/agent/llm/llmClient.js';
import { AgentEvent } from '../src/agent/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep12HeadlessLoop() {
  console.log('🤖 Starting Step 12 Verification: Headless Autonomous Remediation Loop...\n');

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const targetFile = path.join(fixtureDir, 'vulnerableSearch.ts');
  const testDbPath = path.resolve(__dirname, '.test_loop_index.db');

  // Reset fixture file
  const initialVulnerableCode = `export function buildSearchQuery(param: string): { query: string; isParameterized: boolean } {
  // Vulnerable: raw string concatenation
  return {
    query: \`SELECT * FROM users WHERE username = '\${param}'\`,
    isParameterized: false,
  };
}
`;
  await fs.writeFile(targetFile, initialVulnerableCode, 'utf8');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  // 1. Start Dynamic Mock Target Server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;
    const queryParam = url.searchParams.get('q') || '';

    if (pathname === '/api/search') {
      try {
        // Read the live file to determine whether query is parameterized
        const currentCode = await fs.readFile(targetFile, 'utf8');
        const isParameterized = currentCode.includes('isParameterized: true');

        if (!isParameterized) {
          // Vulnerable logic: SQL errors on syntax breaks/quotes
          if (queryParam.includes("'") || queryParam.includes('"')) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: sqlite3.OperationalError: near "OR": syntax error in query');
            return;
          }
        }

        // Safe parameterized response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: [{ id: 1, user: 'alice' }], parameterized: isParameterized }));
      } catch (err: any) {
        res.writeHead(500);
        res.end(`Server Error: ${err.message}`);
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const targetUrl = `http://127.0.0.1:${address.port}`;
  console.log(`▶️ Target test server active at ${targetUrl}\n`);

  // 2. Initialize Indexer & Tools
  const scanner = new FileScanner(fixtureDir);
  const extractor = new AstExtractor();
  const store = new SqliteIndexStore(testDbPath);

  const scanResult = await scanner.scan();
  await store.reconcile(scanResult, extractor, fixtureDir);

  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);
  const toolRegistry = new ToolRegistry({
    workspaceRoot: fixtureDir,
    searchEngine,
    store,
  });

  // 3. Define Autonomous Remediation Steps
  const scriptSteps: ScriptedStep[] = [
    // Step 1: Probe target endpoint with run_sectest
    {
      thought: 'First, I will run automated security checks against /api/search to confirm the vulnerability.',
      toolCalls: [
        {
          name: 'run_sectest',
          args: {
            targetUrl,
            endpoint: '/api/search',
            param: 'q',
            category: 'sqli',
          },
        },
      ],
    },
    // Step 2: Search codebase to locate query builder function
    {
      thought: 'Vulnerability confirmed. Now searching codebase for the function constructing search queries.',
      toolCalls: [
        {
          name: 'search_code',
          args: {
            query: 'buildSearchQuery',
            mode: 'symbol',
          },
        },
      ],
    },
    // Step 3: Read vulnerable source file
    {
      thought: 'Found buildSearchQuery in vulnerableSearch.ts. Reading file contents.',
      toolCalls: [
        {
          name: 'read_file',
          args: {
            path: 'vulnerableSearch.ts',
            startLine: 1,
            endLine: 8,
          },
        },
      ],
    },
    // Step 4: Propose Parameterized Fix with edit_file (Triggers Diff Approval)
    {
      thought: 'Proposing a patch to use parameterized queries instead of raw string concatenation.',
      toolCalls: [
        {
          name: 'edit_file',
          args: {
            path: 'vulnerableSearch.ts',
            oldContent: `    query: \`SELECT * FROM users WHERE username = '\${param}'\`,\n    isParameterized: false,`,
            newContent: `    query: 'SELECT * FROM users WHERE username = ?',\n    isParameterized: true,`,
            description: 'Fix SQL injection by switching from string interpolation to parameterized query',
          },
        },
      ],
    },
    // Step 5: Post-Approval Security Verification
    {
      thought: 'Diff was approved and applied. Now running verify_remediation against all attack vectors.',
      toolCalls: [
        {
          name: 'verify_remediation',
          args: {
            targetUrl,
            endpoint: '/api/search',
            param: 'q',
            category: 'sqli',
          },
        },
      ],
    },
    // Step 6: Final Resolution Summary
    {
      finalResponse:
        'SQL injection vulnerability in /api/search has been successfully remediated using parameterized queries and verified against all 7 attack vectors with 0 bypasses.',
    },
  ];

  const scriptedLLM = new ScriptedLLMClient(scriptSteps);
  const agentLoop = new AutonomousAgentLoop(scriptedLLM, toolRegistry);

  const capturedEvents: AgentEvent[] = [];

  const completionPromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Headless loop timed out')), 10000);

    agentLoop.onEvent((event) => {
      capturedEvents.push(event);

      if (event.type === 'token') {
        process.stdout.write(event.delta);
      } else if (event.type === 'tool_start') {
        console.log(`\n  ⚙️ [Tool Start] ${event.toolName}`);
      } else if (event.type === 'tool_result') {
        console.log(`  📦 [Tool Result] ${event.toolName}: ${JSON.stringify(event.result).substring(0, 80)}...`);
      } else if (event.type === 'require_approval') {
        console.log(`\n  🛑 [Diff Approval Required] For ${event.payload.file}`);
        console.log('     Patch:\n     ' + event.payload.patch.replace(/\n/g, '\n     '));

        // Automatically simulate user pressing '[A] Approve' in the TUI
        console.log('  👉 [Simulating User Approval Hotkey: A] Approving patch...');
        setTimeout(() => {
          agentLoop.approveDiff(event.payload.id);
        }, 50);
      } else if (event.type === 'done') {
        console.log(`\n\n🎉 [Agent Complete] ${event.summary}\n`);
        clearTimeout(timeout);
        resolve();
      } else if (event.type === 'error') {
        console.error(`\n❌ [Agent Error] ${event.error}\n`);
        clearTimeout(timeout);
        reject(new Error(event.error));
      }
    });
  });

  console.log('▶️ Submitting autonomous remediation query to AgentLoop...');
  agentLoop.submitQuery('Audit and fix SQL injection vulnerability in /api/search');

  // Wait for the full autonomous loop to finish (including diff approval and post-verification)
  await completionPromise;

  // Verify that the file on disk was actually changed
  const modifiedCode = await fs.readFile(targetFile, 'utf8');
  if (!modifiedCode.includes('isParameterized: true')) {
    throw new Error('Step 12 Failed: vulnerableSearch.ts was not modified on disk!');
  }
  console.log('  ✅ File on disk successfully updated with parameterized query.');

  // Assert events
  const hasRequireApproval = capturedEvents.some((e) => e.type === 'require_approval');
  const hasDone = capturedEvents.some((e) => e.type === 'done');
  if (!hasRequireApproval || !hasDone) {
    throw new Error('Step 12 Failed: require_approval or done event was missing in autonomous cycle!');
  }

  // Cleanup
  await fs.unlink(targetFile);
  server.close();
  store.close();
  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 12 Verification Successful: Headless Autonomous Remediation Loop executed full end-to-end cycle flawlessly!\n');
}

testStep12HeadlessLoop().catch((err) => {
  console.error('❌ Step 12 Headless Loop test failed:', err);
  process.exit(1);
});
