import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';
import { ToolRegistry } from '../src/agent/tools/toolRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep11SecurityTools() {
  console.log('🔒 Starting Step 11 Verification: Sequenced Security Verification Tools...\n');

  // 1. Create a mock target server simulating Vulnerable, Flawed Patch, and Remediated endpoints
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;
    const query = url.searchParams.get('q') || '';

    if (pathname === '/api/vulnerable') {
      if (query.includes("'") || query.includes('"')) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: sqlite3.OperationalError: near "OR": syntax error in query');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: [] }));
      }
    } else if (pathname === '/api/flawed_patch') {
      // Naive patch: only removes exact "' OR '1'='1" string
      const sanitized = query.replace(/' OR '1'='1/g, '');
      if (sanitized.includes("'") || sanitized.includes('"')) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: sqlite3.OperationalError: near "OR": syntax error in query');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: [] }));
      }
    } else if (pathname === '/api/remediated') {
      // True parameterized fix: safely handles all payloads without syntax errors
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ results: [], queryReceived: query }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as { port: number };
  const targetUrl = `http://127.0.0.1:${address.port}`;
  console.log(`▶️ Mock target server running on ${targetUrl}\n`);

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const store = new SqliteIndexStore(':memory:');
  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);
  const registry = new ToolRegistry({
    workspaceRoot: fixtureDir,
    searchEngine,
    store,
  });

  // Step 11a/11b: Test run_sectest on vulnerable endpoint
  console.log('▶️ Test 1: Testing run_sectest on unpatched /api/vulnerable endpoint...');
  const sectestRes = await registry.execute('run_sectest', {
    targetUrl,
    endpoint: '/api/vulnerable',
    param: 'q',
    category: 'sqli',
  });

  console.log(`  Probes tested: ${sectestRes.data.probesTested}`);
  console.log(`  Vulnerable   : ${sectestRes.data.vulnerable}`);
  console.log(`  Findings     : ${sectestRes.data.findingsCount}`);
  if (!sectestRes.data.vulnerable || sectestRes.data.findingsCount === 0) {
    throw new Error('Step 11 Failed: run_sectest did not detect vulnerabilities on /api/vulnerable!');
  }
  console.log('  ✅ run_sectest successfully detected SQL injection flaws.\n');

  // Step 11d: 3-way discriminative verification test

  // Case A: Unpatched vulnerable endpoint
  console.log('▶️ Test 2 (Case A): verify_remediation against unpatched /api/vulnerable...');
  const verifResA = await registry.execute('verify_remediation', {
    targetUrl,
    endpoint: '/api/vulnerable',
    param: 'q',
    category: 'sqli',
  });
  console.log(`  Verdict Status : ${verifResA.data.status}`);
  console.log(`  Verdict Summary: ${verifResA.data.verdictSummary}`);
  if (verifResA.data.status !== 'VULNERABLE') {
    throw new Error(`Step 11 Failed: Expected status 'VULNERABLE', got '${verifResA.data.status}'`);
  }
  console.log('  ✅ Correctly flagged unpatched endpoint as VULNERABLE.\n');

  // Case B: Flawed naive patch (bypassed by varied attack payloads)
  console.log('▶️ Test 3 (Case B): verify_remediation against flawed naive patch /api/flawed_patch...');
  const verifResB = await registry.execute('verify_remediation', {
    targetUrl,
    endpoint: '/api/flawed_patch',
    param: 'q',
    category: 'sqli',
  });
  console.log(`  Verdict Status : ${verifResB.data.status}`);
  console.log(`  Verdict Summary: ${verifResB.data.verdictSummary}`);
  console.log(`  Passed Probes  : ${verifResB.data.passedCount}`);
  console.log(`  Bypassed Probes: ${verifResB.data.failedCount}`);
  if (verifResB.data.status !== 'FLAWED_PATCH') {
    throw new Error(`Step 11 Failed: Expected status 'FLAWED_PATCH', got '${verifResB.data.status}'`);
  }
  console.log('  ✅ Correctly detected and discriminated FLAWED_PATCH bypass!\n');

  // Case C: True parameterized fix
  console.log('▶️ Test 4 (Case C): verify_remediation against remediated /api/remediated...');
  const verifResC = await registry.execute('verify_remediation', {
    targetUrl,
    endpoint: '/api/remediated',
    param: 'q',
    category: 'sqli',
  });
  console.log(`  Verdict Status : ${verifResC.data.status}`);
  console.log(`  Verdict Summary: ${verifResC.data.verdictSummary}`);
  console.log(`  Passed Probes  : ${verifResC.data.passedCount}/${verifResC.data.totalProbes}`);
  if (verifResC.data.status !== 'REMEDIATED') {
    throw new Error(`Step 11 Failed: Expected status 'REMEDIATED', got '${verifResC.data.status}'`);
  }
  console.log('  ✅ Correctly confirmed full REMEDIATED status across 100% of attack payloads.\n');

  // Clean shutdown
  server.close();
  store.close();

  console.log('🎉 Step 11 Verification Successful: Sequenced Security Verification Tools fully operational with 3-way discriminative testing!\n');
}

testStep11SecurityTools().catch((err) => {
  console.error('❌ Step 11 Security Tools test failed:', err);
  process.exit(1);
});
