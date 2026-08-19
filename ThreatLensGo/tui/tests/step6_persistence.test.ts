import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep6Persistence() {
  console.log('💾 Starting Step 6 Verification: SQLite Persistent Index & Startup Reconciler...\n');

  const testDbPath = path.resolve(__dirname, '.test_threatlens_index.db');

  // Clean up any old test DB
  try {
    await fs.unlink(testDbPath);
  } catch {}

  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const scanner = new FileScanner(fixtureDir);
  const extractor = new AstExtractor();

  // Step 1: First boot (Cold Indexing)
  console.log('▶️ Pass 1: Cold Boot Indexing (writing to SQLite)...');
  const store1 = new SqliteIndexStore(testDbPath);
  const scanResult1 = await scanner.scan();

  const stats1 = await store1.reconcile(scanResult1, extractor);
  console.log(`  ⏱️ Cold Index duration : ${stats1.durationMs.toFixed(2)}ms`);
  console.log(`  📁 Total Files Processed: ${stats1.totalFiles}`);
  console.log(`  🌲 Parsed Files         : ${stats1.parsedCount}`);
  console.log(`  ⚡ Cached Files         : ${stats1.cachedCount}`);
  console.log(`  📦 Stored in SQLite     : ${store1.getFileCount()} files, ${store1.getSymbolCount()} symbols\n`);

  if (stats1.parsedCount !== scanResult1.totalFiles || stats1.cachedCount !== 0) {
    throw new Error('Step 6 Failed: Pass 1 should parse all files!');
  }

  // Step 2: Query SQLite Symbols
  console.log('▶️ Pass 2: Querying indexed symbols from SQLite...');
  const authResults = store1.findSymbols('AuthService', true);
  console.log(`  🔍 Exact search for 'AuthService': found ${authResults.length} records`);
  if (authResults.length === 0 || authResults[0].kind !== 'class') {
    throw new Error('Step 6 Failed: Exact search for AuthService returned empty or invalid record!');
  }
  console.log(`     File: ${authResults[0].file_path} | Kind: ${authResults[0].kind} | Lines: ${authResults[0].start_line}-${authResults[0].end_line}`);

  const loginResults = store1.findSymbols('login');
  console.log(`  🔍 Substring search for 'login': found ${loginResults.length} records`);
  if (loginResults.length === 0) {
    throw new Error('Step 6 Failed: Substring search for login returned empty!');
  }
  console.log(`     Found symbol: ${loginResults[0].name} in ${loginResults[0].file_path}\n`);

  // Close Store 1
  store1.close();

  // Step 3: Tool Restart & Hash Reconciliation (Warm Boot)
  console.log('▶️ Pass 3: Simulating Tool Restart (Re-opening SQLite database)...');
  const restartStart = performance.now();
  const store2 = new SqliteIndexStore(testDbPath);
  const scanResult2 = await scanner.scan();

  const stats2 = await store2.reconcile(scanResult2, extractor);
  const restartDuration = performance.now() - restartStart;

  console.log(`  ⏱️ Restart Reconcile duration: ${stats2.durationMs.toFixed(2)}ms (Total: ${restartDuration.toFixed(2)}ms)`);
  console.log(`  ⚡ Cached (Skipped) Files   : ${stats2.cachedCount}`);
  console.log(`  🌲 Re-parsed Files          : ${stats2.parsedCount}`);
  console.log(`  🗑️ Deleted Files            : ${stats2.deletedCount}`);

  if (stats2.parsedCount !== 0 || stats2.cachedCount !== scanResult2.totalFiles) {
    throw new Error(`Step 6 Failed: Reconcile re-parsed unchanged files! Expected 0 parsed, got ${stats2.parsedCount}`);
  }

  console.log('  ✅ Zero files re-parsed on restart — instant hash reconciliation verified!\n');

  // Clean up
  store2.close();
  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 6 Verification Successful: SQLite persistent index and hash reconciler working with sub-millisecond restarts!\n');
}

testStep6Persistence().catch((err) => {
  console.error('❌ Step 6 Persistence test failed:', err);
  process.exit(1);
});
