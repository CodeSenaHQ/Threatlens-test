import path from 'node:path';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { detectLanguage } from '../src/indexer/languageDetector.js';

async function testFileScanner() {
  console.log('🧪 Starting Step 2 Verification: File Scanner & Language Detection...\n');

  // Test 1: Language Detector Unit Tests
  console.log('▶️ Test 1: Language Detector unit mappings...');
  if (detectLanguage('src/app/index.ts') !== 'typescript') throw new Error('Failed to detect .ts');
  if (detectLanguage('components/Button.tsx') !== 'typescript') throw new Error('Failed to detect .tsx');
  if (detectLanguage('backend/main.py') !== 'python') throw new Error('Failed to detect .py');
  if (detectLanguage('scripts/runner.js') !== 'javascript') throw new Error('Failed to detect .js');
  if (detectLanguage('server/main.go') !== 'go') throw new Error('Failed to detect .go');
  if (detectLanguage('src/main.rs') !== 'rust') throw new Error('Failed to detect .rs');
  if (detectLanguage('package.json') !== 'json') throw new Error('Failed to detect .json');
  if (detectLanguage('README.md') !== 'markdown') throw new Error('Failed to detect .md');
  console.log('  ✅ Language detector unit mappings passed.\n');

  // Test 2: Scan Real ThreatLensGo Repository
  const targetDir = path.resolve('..'); // ThreatLens root
  console.log(`▶️ Test 2: Scanning repository root: ${targetDir}`);

  const scanner = new FileScanner(targetDir);
  const result = await scanner.scan();

  console.log(`  ⏱️  Scan completed in: ${result.durationMs}ms`);
  console.log(`  📁 Total Indexed Files: ${result.totalFiles}`);
  console.log(`  📦 Total Source Code Size: ${(result.totalSizeBytes / 1024).toFixed(1)} KB`);
  console.log(`  🚫 Ignored Files/Dirs: ${result.ignoredCount}`);

  console.log('\n📊 Language Distribution Breakdown:');
  Object.entries(result.languageStats)
    .sort((a, b) => b[1].fileCount - a[1].fileCount)
    .forEach(([lang, stats]) => {
      console.log(`   • ${lang.padEnd(12)}: ${stats.fileCount.toString().padStart(4)} files (${(stats.totalSizeBytes / 1024).toFixed(1)} KB)`);
    });

  // Test 3: Assertions on Result
  console.log('\n▶️ Test 3: Validating scan integrity and gitignore adherence...');
  if (result.totalFiles === 0) {
    throw new Error('Scanner returned 0 files from repository!');
  }

  // Ensure node_modules and .git were filtered out
  const nodeModulesLeak = result.files.find((f) => f.relativePath.includes('node_modules'));
  if (nodeModulesLeak) {
    throw new Error(`Gitignore violation: node_modules file found: ${nodeModulesLeak.relativePath}`);
  }

  const gitLeak = result.files.find((f) => f.relativePath.startsWith('.git/'));
  if (gitLeak) {
    throw new Error(`Gitignore violation: .git file found: ${gitLeak.relativePath}`);
  }

  // Ensure all files have valid SHA-256 hashes
  const invalidHash = result.files.find((f) => !f.hash || f.hash.length !== 64);
  if (invalidHash) {
    throw new Error(`Invalid hash generated for: ${invalidHash.relativePath}`);
  }

  console.log('  ✅ No node_modules or .git leaks detected.');
  console.log('  ✅ All file hashes are valid 64-char SHA-256 strings.');
  console.log('\n🎉 Step 2 Verification Successful: File Scanner & Language Detection fully operational!\n');
}

testFileScanner().catch((err) => {
  console.error('❌ Scanner test failed:', err);
  process.exit(1);
});
