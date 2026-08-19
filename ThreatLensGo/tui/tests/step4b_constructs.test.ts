import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { AstExtractor } from '../src/indexer/astExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep4bConstructs() {
  console.log('🌲 Starting Step 4b Verification: Classes, Methods, Interfaces, Types & Enums...\n');

  const extractor = new AstExtractor();

  // Test 1: Extract Class & Methods from src/indexer/fileScanner.ts
  const fileScannerPath = path.resolve(__dirname, '../src/indexer/fileScanner.ts');
  const fileScannerContent = await fs.readFile(fileScannerPath, 'utf8');

  console.log(`▶️ Test 1: Extracting from ${fileScannerPath}...`);
  const result1 = await extractor.extract(fileScannerContent, fileScannerPath);

  console.log(`  ⏱️ Extraction time: ${result1.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Symbols (${result1.symbols.length}):`);
  result1.symbols.forEach((sym) => {
    console.log(`    • [${sym.kind.padEnd(9)}] ${sym.name.padEnd(20)} (Lines ${sym.startLine.toString().padStart(3)}-${sym.endLine.toString().padStart(3)}) ${sym.parentSymbol ? `[Parent: ${sym.parentSymbol}]` : ''} - ${sym.signature}`);
  });

  // Verify class FileScanner
  const classSym = result1.symbols.find((s) => s.kind === 'class' && s.name === 'FileScanner');
  if (!classSym || !classSym.isExported) {
    throw new Error('Step 4b Failed: class FileScanner not extracted or not marked exported!');
  }

  // Verify methods
  const expectedMethods = ['loadGitignore', 'computeFileHash', 'scan'];
  for (const mName of expectedMethods) {
    const mSym = result1.symbols.find((s) => s.kind === 'method' && s.name === mName && s.parentSymbol === 'FileScanner');
    if (!mSym) {
      throw new Error(`Step 4b Failed: Method '${mName}' of FileScanner not extracted!`);
    }
  }
  console.log('  ✅ Class FileScanner and all methods extracted with parentSymbol relationships.\n');

  // Test 2: Extract Interfaces & Types from src/indexer/types.ts
  const typesPath = path.resolve(__dirname, '../src/indexer/types.ts');
  const typesContent = await fs.readFile(typesPath, 'utf8');

  console.log(`▶️ Test 2: Extracting from ${typesPath}...`);
  const result2 = await extractor.extract(typesContent, typesPath);

  console.log(`  ⏱️ Extraction time: ${result2.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Symbols (${result2.symbols.length}):`);
  result2.symbols.forEach((sym) => {
    console.log(`    • [${sym.kind.padEnd(9)}] ${sym.name.padEnd(20)} (Lines ${sym.startLine.toString().padStart(3)}-${sym.endLine.toString().padStart(3)}) - ${sym.signature}`);
  });

  const expectedTypes = ['SupportedLanguage'];
  const expectedInterfaces = ['IndexedFile', 'LanguageSummary', 'FileScanResult', 'ScanOptions'];

  for (const tName of expectedTypes) {
    const tSym = result2.symbols.find((s) => s.kind === 'type' && s.name === tName);
    if (!tSym || !tSym.isExported) {
      throw new Error(`Step 4b Failed: Type alias '${tName}' not extracted or not marked exported!`);
    }
  }

  for (const iName of expectedInterfaces) {
    const iSym = result2.symbols.find((s) => s.kind === 'interface' && s.name === iName);
    if (!iSym || !iSym.isExported) {
      throw new Error(`Step 4b Failed: Interface '${iName}' not extracted or not marked exported!`);
    }
  }
  console.log('  ✅ Type aliases and interfaces extracted successfully.\n');

  // Test 3: Regression test on Step 4a functions from languageDetector.ts
  const langDetectorPath = path.resolve(__dirname, '../src/indexer/languageDetector.ts');
  const langDetectorContent = await fs.readFile(langDetectorPath, 'utf8');
  const result3 = await extractor.extract(langDetectorContent, langDetectorPath);

  if (result3.symbols.length !== 3 || !result3.symbols.every((s) => s.kind === 'function')) {
    throw new Error('Step 4b Regression: Functions in languageDetector.ts were broken by Step 4b changes!');
  }
  console.log('  ✅ Step 4a Function extraction maintains 0 regressions.\n');

  console.log('🎉 Step 4b Verification Successful: Classes, Methods, Interfaces, and Types working seamlessly!\n');
}

testStep4bConstructs().catch((err) => {
  console.error('❌ Step 4b test failed:', err);
  process.exit(1);
});
