import path from 'node:path';
import { FileScanner } from '../src/indexer/fileScanner.js';

async function scanThreatLensRoot() {
  const root = path.resolve('../..');
  console.log(`Scanning full ThreatLens workspace at: ${root}`);
  const scanner = new FileScanner(root);
  const result = await scanner.scan();

  console.log('\n✅ ThreatLens Workspace Scan Result:');
  console.log(`⏱️ Duration: ${result.durationMs}ms`);
  console.log(`📁 Files: ${result.totalFiles}`);
  console.log(`📦 Size: ${(result.totalSizeBytes / 1024).toFixed(1)} KB`);
  console.log(`🚫 Ignored items: ${result.ignoredCount}`);
  console.log('\n📊 Languages:');
  for (const [lang, stats] of Object.entries(result.languageStats)) {
    console.log(`  - ${lang.padEnd(12)}: ${stats.fileCount.toString().padStart(4)} files (${(stats.totalSizeBytes / 1024).toFixed(1)} KB)`);
  }
}

scanThreatLensRoot().catch(console.error);
