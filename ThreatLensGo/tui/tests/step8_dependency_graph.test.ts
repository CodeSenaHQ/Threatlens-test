import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { DependencyGraph } from '../src/indexer/dependencyGraph.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep8DependencyGraph() {
  console.log('🕸️ Starting Step 8 Verification: Layered Import Resolver & Dependency Graph...\n');

  const testDbPath = path.resolve(__dirname, '.test_deps_index.db');
  const fixtureDir = path.resolve(__dirname, 'fixtures/synthetic_repo');

  // Clean setup
  try {
    await fs.unlink(testDbPath);
  } catch {}

  // Step 1: Create Circular Dependency Fixtures in synthetic_repo
  const cycleAPath = path.join(fixtureDir, 'cycleA.ts');
  const cycleBPath = path.join(fixtureDir, 'cycleB.ts');

  await fs.writeFile(
    cycleAPath,
    `import { bFunction } from './cycleB.js';
     export function aFunction() { return bFunction(); }`,
    'utf8'
  );

  await fs.writeFile(
    cycleBPath,
    `import { aFunction } from './cycleA.js';
     export function bFunction() { return aFunction(); }`,
    'utf8'
  );

  const scanner = new FileScanner(fixtureDir);
  const extractor = new AstExtractor();
  const store = new SqliteIndexStore(testDbPath);

  console.log('▶️ Pass 1: Scanning fixture repository & extracting dependencies...');
  const scanResult = await scanner.scan();
  await store.reconcile(scanResult, extractor, fixtureDir);

  console.log(`  📦 Stored in SQLite: ${store.getFileCount()} files, ${store.getSymbolCount()} symbols, ${store.getAllDependencies().length} dependency links\n`);

  const graph = new DependencyGraph(store);

  // Step 8a: Verify Basic Relative Import (userController -> authService)
  console.log('▶️ Step 8a: Testing Relative Resolution & ESM .js-to-.ts Mapping...');
  const userCtrlDeps = graph.getDependencies('userController.ts');
  console.log('  🔍 userController.ts Outgoing Dependencies:');
  console.log('     Direct Dependencies:', userCtrlDeps.directDependencies);
  console.log('     External Packages  :', userCtrlDeps.externalPackages);

  if (!userCtrlDeps.directDependencies.includes('authService.ts')) {
    throw new Error("Step 8a Failed: userController.ts should depend on 'authService.ts'!");
  }
  console.log('  ✅ ESM import "./authService.js" successfully resolved to "authService.ts".\n');

  // Step 8b: Verify Reverse Dependents (authService is imported by userController)
  console.log('▶️ Step 8b: Testing Reverse Dependency Graph (getDependents)...');
  const authDependents = graph.getDependents('authService.ts');
  console.log('  🔍 authService.ts Incoming Dependents:');
  console.log('     Direct Dependents:', authDependents.directDependents);

  if (!authDependents.directDependents.includes('userController.ts')) {
    throw new Error("Step 8b Failed: authService.ts should have 'userController.ts' as an incoming dependent!");
  }
  console.log('  ✅ Reverse dependency query returned correct importing controllers.\n');

  // Step 8c: Verify Circular Imports Traversal Safety (cycleA <-> cycleB)
  console.log('▶️ Step 8c: Testing Circular Import Traversal Safety (A <-> B)...');
  const cycleADeps = graph.getDependencies('cycleA.ts');
  console.log('  🔍 cycleA.ts Outgoing Dependencies:');
  console.log('     Direct Dependencies:', cycleADeps.directDependencies);
  console.log('     Has Cycle          :', cycleADeps.hasCycle);
  console.log('     Cycle Nodes        :', cycleADeps.cycleNodes);

  if (!cycleADeps.directDependencies.includes('cycleB.ts') || !cycleADeps.hasCycle) {
    throw new Error('Step 8c Failed: Circular dependency cycle was not detected cleanly!');
  }
  console.log('  ✅ Circular import cycle handled safely without infinite recursion.\n');

  // Clean up
  store.close();
  try {
    await fs.unlink(cycleAPath);
    await fs.unlink(cycleBPath);
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 8 Verification Successful: Layered Import Resolver & Dependency Graph fully verified!\n');
}

testStep8DependencyGraph().catch((err) => {
  console.error('❌ Step 8 Dependency Graph test failed:', err);
  process.exit(1);
});
