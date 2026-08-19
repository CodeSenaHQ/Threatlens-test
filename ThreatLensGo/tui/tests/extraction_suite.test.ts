import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { FileScanner } from '../src/indexer/fileScanner.js';
import { AstExtractor } from '../src/indexer/astExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runExtractionTestSuite() {
  console.log('🧪 Starting Step 5 Verification: Comprehensive Extraction Fixture Test Suite...\n');

  const fixtureRepoDir = path.resolve(__dirname, 'fixtures/synthetic_repo');
  const scanner = new FileScanner(fixtureRepoDir);
  const scanResult = await scanner.scan();

  console.log(`▶️ Discovered ${scanResult.totalFiles} files in synthetic fixture repository.`);
  if (scanResult.totalFiles < 3) {
    throw new Error(`Expected at least 3 fixture files, found ${scanResult.totalFiles}`);
  }

  const extractor = new AstExtractor();
  const allExtractedSymbols: Record<string, any[]> = {};

  for (const file of scanResult.files) {
    const content = await fs.readFile(file.absolutePath, 'utf8');
    const extractRes = await extractor.extract(content, file.absolutePath);
    allExtractedSymbols[file.relativePath] = extractRes.symbols;

    console.log(`\n📄 File: ${file.relativePath} (${extractRes.symbols.length} symbols in ${extractRes.durationMs.toFixed(2)}ms)`);
    extractRes.symbols.forEach((s) => {
      console.log(`   • [${s.kind.padEnd(9)}] ${s.name.padEnd(20)} (L${s.startLine}-L${s.endLine}) ${s.parentSymbol ? `[Parent: ${s.parentSymbol}]` : ''}`);
    });
  }

  console.log('\n▶️ Asserting Multi-File Ground Truth:');

  // Assert authService.ts
  const authSymbols = allExtractedSymbols['authService.ts'] || [];
  const hasAuthToken = authSymbols.some((s) => s.name === 'AuthToken' && s.kind === 'interface');
  const hasAuthService = authSymbols.some((s) => s.name === 'AuthService' && s.kind === 'class');
  const hasGenToken = authSymbols.some((s) => s.name === 'generateToken' && s.kind === 'method' && s.parentSymbol === 'AuthService');
  const hasValToken = authSymbols.some((s) => s.name === 'validateToken' && s.kind === 'method' && s.parentSymbol === 'AuthService');

  if (!hasAuthToken || !hasAuthService || !hasGenToken || !hasValToken) {
    throw new Error('Step 5 Assertion Failed: authService.ts symbols missing!');
  }
  console.log('  ✅ authService.ts: Interface, Class, and Methods verified.');

  // Assert userController.ts
  const userSymbols = allExtractedSymbols['userController.ts'] || [];
  const hasUserCtrl = userSymbols.some((s) => s.name === 'UserController' && s.kind === 'class');
  const hasLoginMethod = userSymbols.some((s) => s.name === 'login' && s.kind === 'method' && s.parentSymbol === 'UserController');
  const hasFormatHeader = userSymbols.some((s) => s.name === 'formatUserHeader' && s.kind === 'function');

  if (!hasUserCtrl || !hasLoginMethod || !hasFormatHeader) {
    throw new Error('Step 5 Assertion Failed: userController.ts symbols missing!');
  }
  console.log('  ✅ userController.ts: Controller class, login method, and format function verified.');

  // Assert SecurityReport.tsx
  const reportSymbols = allExtractedSymbols['SecurityReport.tsx'] || [];
  const hasProps = reportSymbols.some((s) => s.name === 'SecurityReportProps' && s.kind === 'interface');
  const hasComponent = reportSymbols.some((s) => s.name === 'SecurityReportCard' && s.kind === 'function');

  if (!hasProps || !hasComponent) {
    throw new Error('Step 5 Assertion Failed: SecurityReport.tsx symbols missing!');
  }
  console.log('  ✅ SecurityReport.tsx: React Props interface and TSX Component verified.');

  // Test Deliberate Failure Detection
  console.log('\n▶️ Testing Deliberate Failure Catching:');
  const missingCheck = authSymbols.find((s) => s.name === 'NonExistentMethod');
  if (missingCheck) {
    throw new Error('Sanity check failed: found non-existent symbol!');
  }
  console.log('  ✅ Non-existent symbol correctly flagged as missing.');

  console.log('\n🎉 Step 5 Verification Successful: Full multi-file fixture extraction test suite passed 100%!\n');
}

runExtractionTestSuite().catch((err) => {
  console.error('❌ Step 5 Extraction Suite Failed:', err);
  process.exit(1);
});
