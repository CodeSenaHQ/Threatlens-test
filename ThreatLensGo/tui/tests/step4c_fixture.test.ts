import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { AstExtractor } from '../src/indexer/astExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testStep4cFixtures() {
  console.log('🌲 Starting Step 4c / Step 5 Verification: Fixture Edge-Case Resolution...\n');

  const extractor = new AstExtractor();
  const fixturePath = path.resolve(__dirname, 'fixtures/edge_cases.tsx');
  const fixtureContent = await fs.readFile(fixturePath, 'utf8');

  console.log(`▶️ Extracting symbols from synthetic fixture: ${fixturePath}...`);
  const result = await extractor.extract(fixtureContent, fixturePath);

  console.log(`  ⏱️ Extraction duration: ${result.durationMs.toFixed(2)}ms`);
  console.log(`  🔍 Total Extracted Symbols: ${result.symbols.length}\n`);

  console.log('📋 Extracted Symbol Manifest:');
  result.symbols.forEach((sym) => {
    console.log(`  • [${sym.kind.padEnd(9)}] ${sym.name.padEnd(24)} (Lines ${sym.startLine.toString().padStart(2)}-${sym.endLine.toString().padStart(2)}) ${sym.parentSymbol ? `[Parent: ${sym.parentSymbol}]` : ''}`);
    console.log(`    Signature: ${sym.signature}`);
  });

  console.log('\n▶️ Asserting 100% ground-truth symbol coverage:');

  const assertions: { name: string; kind: string; isExported?: boolean; isAsync?: boolean }[] = [
    { name: 'AuditReport', kind: 'interface', isExported: true },
    { name: 'ScanStatus', kind: 'type', isExported: true },
    { name: 'VulnerabilityCategory', kind: 'enum', isExported: true },
    { name: 'computeRiskScore', kind: 'function', isExported: true, isAsync: false },
    { name: 'dispatchAlertAsync', kind: 'function', isExported: true, isAsync: true },
    { name: 'VulnerabilityPill', kind: 'function', isExported: true },
    { name: 'SecurityEngine', kind: 'class', isExported: true },
    { name: 'constructor', kind: 'method' },
    { name: 'getStatus', kind: 'method' },
    { name: 'executeScan', kind: 'method', isAsync: true },
    { name: 'initializeEngine', kind: 'function', isExported: true },
    { name: 'DEFAULT_PORT', kind: 'variable', isExported: true },
    { name: 'API_VERSION', kind: 'variable', isExported: true },
  ];

  for (const expected of assertions) {
    const found = result.symbols.find((s) => s.name === expected.name && s.kind === expected.kind);
    if (!found) {
      throw new Error(`Fixture Test Failed: Symbol '${expected.name}' of kind '${expected.kind}' was NOT found!`);
    }

    if (expected.isExported !== undefined && found.isExported !== expected.isExported) {
      throw new Error(`Fixture Test Failed: Symbol '${expected.name}' isExported mismatch. Expected ${expected.isExported}, got ${found.isExported}`);
    }

    if (expected.isAsync !== undefined && found.isAsync !== expected.isAsync) {
      throw new Error(`Fixture Test Failed: Symbol '${expected.name}' isAsync mismatch. Expected ${expected.isAsync}, got ${found.isAsync}`);
    }

    console.log(`  ✅ Verified [${expected.kind}] ${expected.name}`);
  }

  console.log('\n🎉 Step 4c / Step 5 Verification Successful: 100% ground-truth symbols and edge-cases captured flawlessly!\n');
}

testStep4cFixtures().catch((err) => {
  console.error('❌ Fixture test failed:', err);
  process.exit(1);
});
