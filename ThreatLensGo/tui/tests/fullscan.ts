import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scanThreatLensRoot() {
  // Always resolves to workspace root regardless of where command is executed from
  const root = path.resolve(__dirname, '../../..');
  console.log(`Scanning full ThreatLens workspace at: ${root}`);
  const scanner = new FileScanner(root);
  const result = await scanner.scan();

  console.log('\n✅ ThreatLens Workspace Scan Result:');
  console.log(`⏱️ Duration: ${result.durationMs.toFixed(1)}ms`);
  console.log(`📁 Files: ${result.totalFiles}`);
  console.log(`📦 Size: ${(result.totalSizeBytes / 1024).toFixed(1)} KB`);
  console.log(`🚫 Ignored items: ${result.ignoredCount}`);
  console.log('\n📊 Languages:');
  for (const [lang, stats] of Object.entries(result.languageStats)) {
    console.log(`  - ${lang.padEnd(12)}: ${stats.fileCount.toString().padStart(4)} files (${(stats.totalSizeBytes / 1024).toFixed(1)} KB)`);
  }
}

scanThreatLensRoot().catch((err) => {
  console.error('❌ Fullscan failed:', err);
  process.exit(1);
});
