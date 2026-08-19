import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { UnifiedSearchEngine } from '../src/indexer/unifiedSearch.js';
import { ToolRegistry } from '../src/agent/tools/toolRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep10Tools() {
  console.log('🛠️ Starting Step 10 Verification: Standard Codebase Tool Definitions...\n');

  const testDbPath = path.resolve(__dirname, '.test_tools_index.db');
  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  const scanner = new FileScanner(fixtureDir);
  const extractor = new AstExtractor();
  const store = new SqliteIndexStore(testDbPath);

  console.log('▶️ Initializing index & ToolRegistry...');
  const scanResult = await scanner.scan();
  await store.reconcile(scanResult, extractor, fixtureDir);

  const searchEngine = new UnifiedSearchEngine(fixtureDir, store);
  const toolRegistry = new ToolRegistry({
    workspaceRoot: fixtureDir,
    searchEngine,
    store,
  });

  // Verify LLM Function Definitions Schema
  const definitions = toolRegistry.getToolDefinitions();
  console.log(`  📋 Registered ${definitions.length} LLM Function Tool definitions.`);
  const toolNames = definitions.map((d) => d.function.name);
  console.log('     Tools:', toolNames.join(', '));

  if (!toolNames.includes('search_code') || !toolNames.includes('edit_file') || !toolNames.includes('read_file')) {
    throw new Error('Step 10 Failed: Core tools missing from registry definitions!');
  }

  // Test 1: search_code tool
  console.log('\n▶️ Test 1: Executing search_code tool...');
  const searchRes = await toolRegistry.execute('search_code', { query: 'generateToken', mode: 'symbol' });
  if (!searchRes.success || searchRes.data.symbols.length === 0) {
    throw new Error('Step 10 Failed: search_code did not return symbols!');
  }
  console.log(`  ✅ search_code: Found '${searchRes.data.symbols[0].name}' in ${searchRes.data.symbols[0].file} (Lines ${searchRes.data.symbols[0].lines})`);

  // Test 2: find_symbol tool
  console.log('\n▶️ Test 2: Executing find_symbol tool...');
  const findRes = await toolRegistry.execute('find_symbol', { name: 'UserController', exact: true });
  if (!findRes.success || findRes.data.length === 0) {
    throw new Error('Step 10 Failed: find_symbol did not find UserController!');
  }
  console.log(`  ✅ find_symbol: Found ${findRes.data[0].kind} '${findRes.data[0].name}' (${findRes.data[0].signature})`);

  // Test 3: read_file tool with line slicing
  console.log('\n▶️ Test 3: Executing read_file tool with line slicing (1-4)...');
  const readRes = await toolRegistry.execute('read_file', { path: 'authService.ts', startLine: 1, endLine: 4 });
  if (!readRes.success || !readRes.data.content.includes('interface AuthToken')) {
    throw new Error('Step 10 Failed: read_file did not slice lines correctly!');
  }
  console.log('  ✅ read_file output:');
  console.log('     ' + readRes.data.content.replace(/\n/g, '\n     '));

  // Test 4: get_dependencies tool
  console.log('\n▶️ Test 4: Executing get_dependencies tool...');
  const depRes = await toolRegistry.execute('get_dependencies', { path: 'userController.ts' });
  if (!depRes.success || !depRes.data.imports.includes('authService.ts')) {
    throw new Error('Step 10 Failed: get_dependencies failed!');
  }
  console.log(`  ✅ get_dependencies: userController.ts imports [${depRes.data.imports.join(', ')}]`);

  // Test 5: edit_file tool with DiffApprovalPayload generation & disk application
  console.log('\n▶️ Test 5: Executing edit_file tool & verifying DiffApprovalPayload contract...');
  const originalAuthContent = await fs.readFile(path.join(fixtureDir, 'authService.ts'), 'utf8');

  const editRes = await toolRegistry.execute('edit_file', {
    path: 'authService.ts',
    oldContent: 'expiresIn: 3600,',
    newContent: 'expiresIn: 7200, // Extended TTL',
    description: 'Extend AuthToken expiry duration to 2 hours',
  });

  if (!editRes.success || !editRes.requiresApproval) {
    throw new Error('Step 10 Failed: edit_file did not generate requiresApproval DiffApprovalPayload!');
  }

  const payload = editRes.requiresApproval;
  console.log('  🔍 DiffApprovalPayload Generated:');
  console.log(`     ID         : ${payload.id}`);
  console.log(`     File       : ${payload.file}`);
  console.log(`     Description: ${payload.description}`);
  console.log('     Unified Diff:');
  console.log('     ' + payload.patch.replace(/\n/g, '\n     '));

  if (!payload.patch.includes('+') || !payload.patch.includes('-') || !payload.patch.includes('@@')) {
    throw new Error('Step 10 Failed: Generated patch is not a valid unified diff!');
  }

  // Apply diff to disk
  console.log('\n▶️ Applying diff to disk via ToolRegistry.applyDiff()...');
  const applied = await toolRegistry.applyDiff(payload);
  if (!applied) throw new Error('Step 10 Failed: applyDiff returned false!');

  const modifiedContent = await fs.readFile(path.join(fixtureDir, 'authService.ts'), 'utf8');
  if (!modifiedContent.includes('expiresIn: 7200')) {
    throw new Error('Step 10 Failed: Disk file was not updated!');
  }
  console.log('  ✅ File on disk successfully updated with new content.');

  // Revert back to original
  await fs.writeFile(path.join(fixtureDir, 'authService.ts'), originalAuthContent, 'utf8');
  console.log('  ✅ Reverted file back to original content.');

  // Clean up
  store.close();
  try {
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('\n🎉 Step 10 Verification Successful: Standard Codebase Tools fully implemented and verified!\n');
}

testStep10Tools().catch((err) => {
  console.error('❌ Step 10 Tools test failed:', err);
  process.exit(1);
});
