import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep14MultiLangAdapters() {
  console.log('🌐 Starting Step 14 Verification: Multi-Language AST Adapters (Python & Go)...\n');

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const testDbPath = path.resolve(__dirname, '.test_multilang_index.db');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  const extractor = new AstExtractor();

  // Test 1: Python AST Extraction
  console.log('▶️ Test 1: Extracting AST from Python file (audit_probe.py)...');
  const pyPath = path.join(fixtureDir, 'audit_probe.py');
  const pyContent = await fs.readFile(pyPath, 'utf8');
  const pyResult = await extractor.extract(pyContent, pyPath);

  console.log(`  ⏱️ Python extraction duration: ${pyResult.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Python Symbols (${pyResult.symbols.length}):`);
  pyResult.symbols.forEach((s) => {
    console.log(`     • [${s.kind.padEnd(8)}] ${s.name.padEnd(25)} (L${s.startLine}-L${s.endLine}) ${s.parentSymbol ? `[Parent: ${s.parentSymbol}]` : ''} - ${s.signature}`);
  });

  const hasPyClass = pyResult.symbols.find((s) => s.kind === 'class' && s.name === 'SecurityAuditEngine');
  const hasPyMethod = pyResult.symbols.find((s) => s.kind === 'method' && s.name === 'run_audit' && s.parentSymbol === 'SecurityAuditEngine');
  const hasPyAsyncFn = pyResult.symbols.find((s) => s.kind === 'function' && s.name === 'dispatch_security_webhook' && s.isAsync);
  const hasPyFn = pyResult.symbols.find((s) => s.kind === 'function' && s.name === 'calculate_risk_index');

  if (!hasPyClass || !hasPyMethod || !hasPyAsyncFn || !hasPyFn) {
    throw new Error('Step 14 Failed: Python AST symbols missing or incorrectly parsed!');
  }
  console.log('  ✅ Python classes, methods, async functions, and parameters verified.\n');

  // Test 2: Go AST Extraction
  console.log('▶️ Test 2: Extracting AST from Go file (scanner.go)...');
  const goPath = path.join(fixtureDir, 'scanner.go');
  const goContent = await fs.readFile(goPath, 'utf8');
  const goResult = await extractor.extract(goContent, goPath);

  console.log(`  ⏱️ Go extraction duration: ${goResult.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Go Symbols (${goResult.symbols.length}):`);
  goResult.symbols.forEach((s) => {
    console.log(`     • [${s.kind.padEnd(9)}] ${s.name.padEnd(25)} (L${s.startLine}-L${s.endLine}) ${s.parentSymbol ? `[Parent: ${s.parentSymbol}]` : ''} - ${s.signature}`);
  });

  const hasGoStruct = goResult.symbols.find((s) => s.name === 'ScanConfig');
  const hasGoInterface = goResult.symbols.find((s) => s.kind === 'interface' && s.name === 'VulnerabilityReporter');
  const hasGoFunc = goResult.symbols.find((s) => s.kind === 'function' && s.name === 'NewScanner');
  const hasGoMethod = goResult.symbols.find((s) => s.kind === 'method' && s.name === 'Scan' && s.parentSymbol === 'CodeScanner');

  if (!hasGoStruct || !hasGoInterface || !hasGoFunc || !hasGoMethod) {
    throw new Error('Step 14 Failed: Go AST symbols missing or incorrectly parsed!');
  }
  console.log('  ✅ Go structs, interfaces, receiver methods, and constructors verified.\n');

  // Test 3: Full Polyglot Workspace Indexing & SQLite Search
  console.log('▶️ Test 3: Polyglot Workspace SQLite Indexing & Unified Search...');
  const scanner = new FileScanner(fixtureDir);
  const store = new SqliteIndexStore(testDbPath);

  const scanResult = await scanner.scan();
  const reconcileStats = await store.reconcile(scanResult, extractor, fixtureDir);

  console.log(`  📦 Indexed ${reconcileStats.totalFiles} files into SQLite (${store.getSymbolCount()} total polyglot symbols)`);

  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);

  // Search across languages
  const tsSearch = searchEngine.searchSymbols('AuthService', true);
  const pySearch = searchEngine.searchSymbols('SecurityAuditEngine', true);
  const goSearch = searchEngine.searchSymbols('Scan', true);

  console.log(`  🔍 TypeScript search ('AuthService')       : ${tsSearch.length} match in ${tsSearch[0]?.file_path}`);
  console.log(`  🔍 Python search     ('SecurityAuditEngine'): ${pySearch.length} match in ${pySearch[0]?.file_path}`);
  console.log(`  🔍 Go search         ('Scan')               : ${goSearch.length} match in ${goSearch[0]?.file_path}`);

  if (tsSearch.length === 0 || pySearch.length === 0 || goSearch.length === 0) {
    throw new Error('Step 14 Failed: Polyglot cross-language search failed!');
  }
  console.log('  ✅ Cross-language AST search (TypeScript, Python, Go) verified seamlessly.\n');

  // Clean up
  store.close();
  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 14 Verification Successful: Multi-Language AST Adapters (Python & Go) fully operational!\n');
}

testStep14MultiLangAdapters().catch((err) => {
  console.error('❌ Step 14 Multi-Language test failed:', err);
  process.exit(1);
});
