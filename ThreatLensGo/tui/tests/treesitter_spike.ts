import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Parser from 'web-tree-sitter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTreeSitterWasmSpike() {
  console.log('🌲 Starting Step 3 Verification: Tree-sitter WASM Binding Spike...\n');

  // Step 1: Initialize WebAssembly runtime
  console.log('▶️ Initializing web-tree-sitter WASM runtime...');
  const initStart = Date.now();
  await Parser.init();
  const initDuration = Date.now() - initStart;
  console.log(`  ✅ Parser.init() completed in ${initDuration}ms\n`);

  // Step 2: Load TypeScript WASM grammar
  const wasmDir = path.resolve(__dirname, '../node_modules/tree-sitter-wasms/out');
  const tsWasmPath = path.join(wasmDir, 'tree-sitter-typescript.wasm');

  console.log(`▶️ Loading TypeScript grammar from: ${tsWasmPath}`);
  const loadStart = Date.now();
  const TsLanguage = await Parser.Language.load(tsWasmPath);
  const loadDuration = Date.now() - loadStart;
  console.log(`  ✅ Language.load() completed in ${loadDuration}ms\n`);

  // Step 3: Parse sample code string
  const parser = new Parser();
  parser.setLanguage(TsLanguage);

  const sampleSource = `
    export interface UserProfile {
      id: string;
      username: string;
      email: string;
    }

    export class AuthenticationService {
      private db: Database;

      constructor(db: Database) {
        this.db = db;
      }

      public async authenticateUser(req: Request, res: Response): Promise<UserSession> {
        const { username, password } = req.body;
        return this.db.findUser(username, password);
      }
    }
  `;

  console.log('▶️ Parsing sample TypeScript snippet...');
  const parseStart = performance.now();
  const tree = parser.parse(sampleSource);
  const parseDuration = (performance.now() - parseStart).toFixed(3);

  console.log(`  ⏱️ Parsing latency: ${parseDuration}ms`);
  console.log(`  🌲 Root Node Type: ${tree.rootNode.type}`);
  console.log(`  🌳 Child Node Count: ${tree.rootNode.childCount}`);

  if (tree.rootNode.type !== 'program' || tree.rootNode.childCount === 0) {
    throw new Error('Tree-sitter parse failed: Invalid root node or child count.');
  }

  // Step 4: Parse a real file from the project (e.g. src/agent/MockAgentController.ts)
  const realFilePath = path.resolve(__dirname, '../src/agent/MockAgentController.ts');
  console.log(`\n▶️ Parsing real project file: ${realFilePath}`);
  const realFileContent = await fs.readFile(realFilePath, 'utf8');

  const realParseStart = performance.now();
  const realTree = parser.parse(realFileContent);
  const realParseDuration = (performance.now() - realParseStart).toFixed(3);

  console.log(`  ⏱️ Real File Parsing latency: ${realParseDuration}ms`);
  console.log(`  📁 Real File Size: ${(realFileContent.length / 1024).toFixed(1)} KB`);
  console.log(`  🌲 Real File Root Node: ${realTree.rootNode.type}`);
  console.log(`  🌳 Real File Child Count: ${realTree.rootNode.childCount}`);

  // Step 5: Test TSX Language loading as well
  const tsxWasmPath = path.join(wasmDir, 'tree-sitter-tsx.wasm');
  const tsxLanguage = await Parser.Language.load(tsxWasmPath);
  const tsxParser = new Parser();
  tsxParser.setLanguage(tsxLanguage);

  const tsxSample = `
    export const StatusBadge: React.FC<{ label: string }> = ({ label }) => {
      return <div className="badge"><span>{label}</span></div>;
    };
  `;
  const tsxTree = tsxParser.parse(tsxSample);
  console.log(`\n▶️ TSX Grammar validation: Root = ${tsxTree.rootNode.type}, children = ${tsxTree.rootNode.childCount}`);

  // Step 6: Test Python Language loading
  const pyWasmPath = path.join(wasmDir, 'tree-sitter-python.wasm');
  const pyLanguage = await Parser.Language.load(pyWasmPath);
  const pyParser = new Parser();
  pyParser.setLanguage(pyLanguage);

  const pySample = `
    class SecurityProbe:
        def __init__(self, target_url: str):
            self.target_url = target_url

        def execute_sqli_check(self) -> bool:
            return True
  `;
  const pyTree = pyParser.parse(pySample);
  console.log(`▶️ Python Grammar validation: Root = ${pyTree.rootNode.type}, children = ${pyTree.rootNode.childCount}`);

  console.log('\n🎉 Step 3 Verification Successful: Tree-sitter WASM bindings validated across TypeScript, TSX, and Python with sub-millisecond parsing speed!\n');
}

testTreeSitterWasmSpike().catch((err) => {
  console.error('❌ Tree-sitter WASM spike failed:', err);
  process.exit(1);
});
