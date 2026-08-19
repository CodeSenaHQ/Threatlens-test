import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep9UnifiedSearch() {
  console.log('🔍 Starting Step 9 Verification: Vendored Ripgrep & Unified Search Engine...\n');

  const testDbPath = path.resolve(__dirname, '.test_search_index.db');
  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  const scanner = new FileScanner(fixtureDir);
  const extractor = new AstExtractor();
  const store = new SqliteIndexStore(testDbPath);

  console.log('▶️ Indexing synthetic fixture repository into SQLite...');
  const scanResult = await scanner.scan();
  await store.reconcile(scanResult, extractor, fixtureDir);

  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);

  // Test 1: Symbol Search via SQLite
  console.log('\n▶️ Test 1: AST Symbol Search (searchSymbols)...');
  const authClass = searchEngine.searchSymbols('AuthService', true);
  console.log(`  🔍 Search 'AuthService': found ${authClass.length} symbol(s)`);
  if (authClass.length === 0 || authClass[0].kind !== 'class') {
    throw new Error("Step 9 Failed: searchSymbols('AuthService') failed!");
  }
  console.log(`     ${authClass[0].kind} in ${authClass[0].file_path} (L${authClass[0].start_line}-L${authClass[0].end_line})`);

  // Test 2: Ripgrep Raw Text & Regex Search
  console.log('\n▶️ Test 2: Ripgrep Raw Text & Regex Search (searchText)...');
  const textMatches = await searchEngine.searchText('expiresIn: 3600');
  console.log(`  🔍 Text search for 'expiresIn: 3600': found ${textMatches.length} match(es)`);
  if (textMatches.length === 0) {
    throw new Error("Step 9 Failed: searchText for 'expiresIn: 3600' returned 0 matches!");
  }
  console.log(`     Match in ${textMatches[0].filePath}:${textMatches[0].lineNumber} -> "${textMatches[0].lineText}"`);

  // Regex Search
  const regexMatches = await searchEngine.searchText('class\\s+UserController', { isRegex: true });
  console.log(`  🔍 Regex search for 'class\\s+UserController': found ${regexMatches.length} match(es)`);
  if (regexMatches.length === 0) {
    throw new Error('Step 9 Failed: Regex search for UserController class failed!');
  }
  console.log(`     Match in ${regexMatches[0].filePath}:${regexMatches[0].lineNumber} -> "${regexMatches[0].lineText}"`);

  // Test 3: Unified Multi-Modal Search (Ranked)
  console.log('\n▶️ Test 3: Multi-Modal Unified Search (query)...');
  const unifiedRes = await searchEngine.query('AuthToken');
  console.log(`  ⏱️ Unified Query completed in ${unifiedRes.durationMs.toFixed(2)}ms`);
  console.log(`  🏆 Exact Symbol Matches: ${unifiedRes.exactSymbols.length}`);
  console.log(`  📝 Raw Text Matches    : ${unifiedRes.textMatches.length}`);

  if (unifiedRes.exactSymbols.length === 0 || unifiedRes.exactSymbols[0].name !== 'AuthToken') {
    throw new Error("Step 9 Failed: Unified query did not rank exact symbol 'AuthToken' at the top!");
  }
  console.log('  ✅ Exact symbol matches ranked at Top 1, backed by raw text search results.\n');

  // Test 4: Dependency Graph Query via Unified Search
  console.log('▶️ Test 4: Dependency Graph Query via Unified Search...');
  const deps = searchEngine.getDependencies('userController.ts');
  console.log('  🕸️ Dependencies of userController.ts:', deps.directDependencies);
  if (!deps.directDependencies.includes('authService.ts')) {
    throw new Error('Step 9 Failed: Dependency query via search engine failed!');
  }
  console.log('  ✅ Dependency graph queried through unified search engine.\n');

  // Clean up
  store.close();
  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 9 Verification Successful: Vendored Ripgrep & Unified Search Engine fully operational!\n');
}

testStep9UnifiedSearch().catch((err) => {
  console.error('❌ Step 9 Search test failed:', err);
  process.exit(1);
});
