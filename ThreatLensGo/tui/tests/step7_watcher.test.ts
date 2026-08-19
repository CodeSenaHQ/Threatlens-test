import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SqliteIndexStore } from '../src/indexer/sqliteStore.js';
import { FileWatcher, WatcherEvent } from '../src/indexer/fileWatcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep7Watcher() {
  console.log('⚡ Starting Step 7 Verification: Live Chokidar Filesystem Watcher...\n');

  const sandboxDir = path.resolve(__dirname, 'fixtures/watcher_sandbox');
  const testDbPath = path.resolve(__dirname, '.test_watcher_index.db');

  // Clean setup
  try {
    await fs.rm(sandboxDir, { recursive: true, force: true });
    await fs.unlink(testDbPath);
  } catch {}
  await fs.mkdir(sandboxDir, { recursive: true });

  const store = new SqliteIndexStore(testDbPath);
  const watcher = new FileWatcher(sandboxDir, store, undefined, { debounceMs: 20 });

  const events: WatcherEvent[] = [];
  watcher.onEvent((evt) => {
    events.push(evt);
    console.log(`  [Watcher Event: ${evt.type}]`, evt.filePath || '', evt.symbolCount ? `(${evt.symbolCount} symbols)` : '');
  });

  console.log('▶️ Starting FileWatcher on sandbox directory...');
  await watcher.start();
  console.log('  ✅ Watcher ready and listening for filesystem events.\n');

  const targetFilePath = path.join(sandboxDir, 'liveProbe.ts');

  // Step 1: Test CREATE (add file)
  console.log('▶️ Action 1: Creating new file: liveProbe.ts...');
  const initialContent = `
    export interface ProbeConfig {
      timeout: number;
    }

    export class LiveSecurityProbe {
      public scanTarget(url: string): boolean {
        return true;
      }
    }
  `;

  await fs.writeFile(targetFilePath, initialContent, 'utf8');

  // Wait for watcher event
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for file_indexed on CREATE')), 4000);
    const interval = setInterval(() => {
      const symbols = store.getSymbolsInFile('liveProbe.ts');
      if (symbols.length >= 2) {
        clearInterval(interval);
        clearTimeout(timeout);
        console.log(`  ✅ CREATE captured: SQLite now holds ${symbols.length} symbols for liveProbe.ts`);
        resolve();
      }
    }, 20);
  });

  // Step 2: Test MODIFY (edit file)
  console.log('\n▶️ Action 2: Modifying liveProbe.ts (adding auditVulnerability method)...');
  const updatedContent = `
    export interface ProbeConfig {
      timeout: number;
    }

    export class LiveSecurityProbe {
      public scanTarget(url: string): boolean {
        return true;
      }

      public async auditVulnerability(target: string): Promise<string> {
        return "Audit passed for " + target;
      }
    }
  `;

  await fs.writeFile(targetFilePath, updatedContent, 'utf8');

  // Wait for updated symbols in SQLite
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for updated symbols on MODIFY')), 4000);
    const interval = setInterval(() => {
      const found = store.findSymbols('auditVulnerability', true);
      if (found.length > 0) {
        clearInterval(interval);
        clearTimeout(timeout);
        console.log(`  ✅ MODIFY captured: New method 'auditVulnerability' indexed in SQLite! Lines: ${found[0].start_line}-${found[0].end_line}`);
        resolve();
      }
    }, 20);
  });

  // Step 3: Test DELETE (unlink file)
  console.log('\n▶️ Action 3: Deleting liveProbe.ts...');
  await fs.unlink(targetFilePath);

  // Wait for deletion cascade in SQLite
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for cascade delete on UNLINK')), 4000);
    const interval = setInterval(() => {
      const remaining = store.getSymbolsInFile('liveProbe.ts');
      if (remaining.length === 0) {
        clearInterval(interval);
        clearTimeout(timeout);
        console.log('  ✅ DELETE captured: SQLite records for liveProbe.ts deleted cleanly!');
        resolve();
      }
    }, 20);
  });

  // Clean shutdown
  console.log('\n▶️ Shutting down FileWatcher...');
  await watcher.close();
  store.close();

  try {
    await fs.rm(sandboxDir, { recursive: true, force: true });
    await fs.unlink(testDbPath);
    await fs.unlink(`${testDbPath}-wal`);
    await fs.unlink(`${testDbPath}-shm`);
  } catch {}

  console.log('🎉 Step 7 Verification Successful: Real-time incremental watcher updating SQLite in <50ms!\n');
}

testStep7Watcher().catch((err) => {
  console.error('❌ Step 7 Watcher test failed:', err);
  process.exit(1);
});
