import path from 'node:path';
import fs from 'node:fs';
import Parser from 'web-tree-sitter';

export interface RawImport {
  rawSpecifier: string;
  isExport: boolean;
  isDynamic: boolean;
  importedSymbols: string[];
}

export interface ResolvedDependency {
  sourceFile: string;
  targetFile: string; // Relative path or external package name
  rawSpecifier: string;
  isExternal: boolean;
}

export class ImportResolver {
  private workspaceRoot: string;
  private knownFiles: Set<string>;

  constructor(workspaceRoot: string, knownFiles: string[] = []) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.knownFiles = new Set(knownFiles.map((f) => f.replace(/\\/g, '/')));
  }

  public updateKnownFiles(files: string[]): void {
    this.knownFiles = new Set(files.map((f) => f.replace(/\\/g, '/')));
  }

  /**
   * Extracts all raw import and export declarations from a Tree-sitter AST.
   */
  public extractRawImports(tree: Parser.Tree): RawImport[] {
    const rawImports: RawImport[] = [];

    const visit = (node: Parser.SyntaxNode) => {
      // 1. Static Import statements
      if (node.type === 'import_statement') {
        const sourceNode = node.childForFieldName('source') || node.children.find((c) => c.type === 'string');
        if (sourceNode) {
          const rawSpecifier = sourceNode.text.replace(/^['"`]|['"`]$/g, '');
          const importedSymbols: string[] = [];

          // Extract imported identifiers
          for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            if (child && child.type === 'import_clause') {
              for (let j = 0; j < child.childCount; j++) {
                const clauseChild = child.child(j);
                if (clauseChild && clauseChild.type === 'named_imports') {
                  for (let k = 0; k < clauseChild.childCount; k++) {
                    const spec = clauseChild.child(k);
                    if (spec && spec.type === 'import_specifier') {
                      const name = spec.childForFieldName('name') || spec;
                      importedSymbols.push(name.text);
                    }
                  }
                } else if (clauseChild && clauseChild.type === 'identifier') {
                  importedSymbols.push(clauseChild.text); // Default import
                }
              }
            }
          }

          rawImports.push({
            rawSpecifier,
            isExport: false,
            isDynamic: false,
            importedSymbols,
          });
        }
      }

      // 2. Export ... from '...' statements
      if (node.type === 'export_statement') {
        const sourceNode = node.childForFieldName('source') || node.children.find((c) => c.type === 'string');
        if (sourceNode) {
          const rawSpecifier = sourceNode.text.replace(/^['"`]|['"`]$/g, '');
          rawImports.push({
            rawSpecifier,
            isExport: true,
            isDynamic: false,
            importedSymbols: [],
          });
        }
      }

      // 3. Dynamic require('...') / import('...') calls
      if (node.type === 'call_expression') {
        const funcNode = node.childForFieldName('function') || node.child(0);
        if (funcNode && (funcNode.text === 'require' || funcNode.text === 'import')) {
          const argsNode = node.childForFieldName('arguments') || node.child(1);
          if (argsNode && argsNode.childCount > 0) {
            const arg = argsNode.children.find((c) => c.type === 'string');
            if (arg) {
              const rawSpecifier = arg.text.replace(/^['"`]|['"`]$/g, '');
              rawImports.push({
                rawSpecifier,
                isExport: false,
                isDynamic: true,
                importedSymbols: [],
              });
            }
          }
        }
      }

      // Recurse children
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child) visit(child);
      }
    };

    visit(tree.rootNode);
    return rawImports;
  }

  /**
   * Resolves a raw import specifier relative to a source file.
   * Handles:
   *  - Step 8a: Basic relative resolution (./foo, ../bar/baz)
   *  - Step 8b: Extensionless (./utils -> ./utils.ts), ESM .js-to-.ts mapping (./auth.js -> ./auth.ts), and directory index fallbacks (./services -> ./services/index.ts)
   */
  public resolve(sourceRelativePath: string, rawSpecifier: string): ResolvedDependency {
    const isRelative = rawSpecifier.startsWith('./') || rawSpecifier.startsWith('../') || rawSpecifier === '.' || rawSpecifier === '..';

    if (!isRelative) {
      // External package (e.g. 'react', 'ink', 'node:path')
      return {
        sourceFile: sourceRelativePath.replace(/\\/g, '/'),
        targetFile: rawSpecifier,
        rawSpecifier,
        isExternal: true,
      };
    }

    const sourceDir = path.dirname(path.resolve(this.workspaceRoot, sourceRelativePath));
    const targetAbsoluteBase = path.resolve(sourceDir, rawSpecifier);
    const candidatePaths: string[] = [];

    // 1. If specifier ends with .js / .mjs / .cjs, generate .ts / .tsx candidates (ESM TS standard)
    if (rawSpecifier.endsWith('.js') || rawSpecifier.endsWith('.mjs') || rawSpecifier.endsWith('.cjs')) {
      const baseWithoutExt = targetAbsoluteBase.replace(/\.[mc]?js$/, '');
      candidatePaths.push(`${baseWithoutExt}.ts`, `${baseWithoutExt}.tsx`, `${baseWithoutExt}.js`, `${baseWithoutExt}.jsx`);
    }

    // 2. Exact match
    candidatePaths.push(targetAbsoluteBase);

    // 3. Extensionless additions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.py'];
    for (const ext of extensions) {
      candidatePaths.push(`${targetAbsoluteBase}${ext}`);
    }

    // 4. Directory index fallbacks
    for (const ext of extensions) {
      candidatePaths.push(path.join(targetAbsoluteBase, `index${ext}`));
    }

    // Check against known files or filesystem
    for (const candAbs of candidatePaths) {
      const candRel = path.relative(this.workspaceRoot, candAbs).replace(/\\/g, '/');

      if (this.knownFiles.size > 0) {
        if (this.knownFiles.has(candRel)) {
          return {
            sourceFile: sourceRelativePath.replace(/\\/g, '/'),
            targetFile: candRel,
            rawSpecifier,
            isExternal: false,
          };
        }
      } else {
        try {
          if (fs.existsSync(candAbs) && fs.statSync(candAbs).isFile()) {
            return {
              sourceFile: sourceRelativePath.replace(/\\/g, '/'),
              targetFile: candRel,
              rawSpecifier,
              isExternal: false,
            };
          }
        } catch {}
      }
    }

    // Fallback: Best-effort relative path normalized
    const fallbackRel = path.relative(this.workspaceRoot, targetAbsoluteBase).replace(/\\/g, '/');
    return {
      sourceFile: sourceRelativePath.replace(/\\/g, '/'),
      targetFile: fallbackRel,
      rawSpecifier,
      isExternal: false,
    };
  }
}
