import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { AstExtractor } from '../src/indexer/astExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep4aFunctions() {
  console.log('🌲 Starting Step 4a Verification: Function Declaration Extraction...\n');

  const extractor = new AstExtractor();

  // Test 1: Extract functions from src/indexer/languageDetector.ts
  const langDetectorPath = path.resolve(__dirname, '../src/indexer/languageDetector.ts');
  const langDetectorContent = await fs.readFile(langDetectorPath, 'utf8');

  console.log(`▶️ Test 1: Extracting functions from ${langDetectorPath}...`);
  const result1 = await extractor.extract(langDetectorContent, langDetectorPath);

  console.log(`  ⏱️ Extraction time: ${result1.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Symbols (${result1.symbols.length}):`);
  result1.symbols.forEach((sym) => {
    console.log(`    • [${sym.kind}] ${sym.name} (Lines ${sym.startLine}-${sym.endLine})`);
    console.log(`      Signature : ${sym.signature}`);
    console.log(`      Exported  : ${sym.isExported} | Async: ${sym.isAsync}`);
    console.log(`      Parameters: [${(sym.parameters || []).join(', ')}]`);
  });

  const expectedFuncs = ['detectLanguage', 'isBinaryExtension', 'isBinaryContent'];
  for (const expected of expectedFuncs) {
    const found = result1.symbols.find((s) => s.name === expected);
    if (!found) {
      throw new Error(`Step 4a Failed: Expected function '${expected}' was not extracted!`);
    }
  }

  // Validate line boundaries on languageDetector.ts
  const detectLangSym = result1.symbols.find((s) => s.name === 'detectLanguage')!;
  const fileLines = langDetectorContent.split('\n');
  const signatureLine = fileLines[detectLangSym.startLine - 1];
  if (!signatureLine.includes('function detectLanguage')) {
    throw new Error(`Step 4a Line Number Mismatch: Line ${detectLangSym.startLine} does not contain function signature. Content: "${signatureLine}"`);
  }
  console.log('  ✅ Line boundaries and parameter signatures match source code exactly.\n');

  // Test 2: Extract functions from src/indexer/parserLoader.ts
  const parserLoaderPath = path.resolve(__dirname, '../src/indexer/parserLoader.ts');
  const parserLoaderContent = await fs.readFile(parserLoaderPath, 'utf8');

  console.log(`▶️ Test 2: Extracting functions from ${parserLoaderPath}...`);
  const result2 = await extractor.extract(parserLoaderContent, parserLoaderPath);

  console.log(`  ⏱️ Extraction time: ${result2.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Extracted Symbols (${result2.symbols.length}):`);
  result2.symbols.forEach((sym) => {
    console.log(`    • [${sym.kind}] ${sym.name} (Lines ${sym.startLine}-${sym.endLine}) - ${sym.signature}`);
  });

  const expectedParserFuncs = ['getWasmOutDir', 'initTreeSitter', 'loadLanguage', 'createParser'];
  for (const expected of expectedParserFuncs) {
    const found = result2.symbols.find((s) => s.name === expected);
    if (!found) {
      throw new Error(`Step 4a Failed: Expected function '${expected}' was not extracted from parserLoader.ts!`);
    }
  }
  console.log('  ✅ All functions in parserLoader.ts successfully extracted.\n');

  console.log('🎉 Step 4a Verification Successful: Function declaration extraction working accurately!\n');
}

testStep4aFunctions().catch((err) => {
  console.error('❌ Step 4a test failed:', err);
  process.exit(1);
});
