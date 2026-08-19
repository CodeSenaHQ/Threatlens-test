import Parser from 'web-tree-sitter';
import { CodeSymbol, FileExtractionResult } from './symbols.js';
import { createParser } from './parserLoader.js';
import { detectLanguage } from './languageDetector.js';

export class AstExtractor {
  /**
   * Extracts function declarations from AST.
   */
  private extractFunctionDeclaration(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false,
    isDefault = false
  ): CodeSymbol | null {
    let name = '';
    let parameters: string[] = [];
    let returnType: string | undefined;
    let isAsync = false;

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'async') {
        isAsync = true;
      } else if (child.type === 'identifier') {
        name = child.text;
      } else if (child.type === 'formal_parameters') {
        parameters = this.extractParameters(child);
      } else if (child.type === 'type_annotation') {
        returnType = child.text.replace(/^:\s*/, '');
      }
    }

    if (!name) {
      if (isDefault) name = 'default';
      else return null;
    }

    const paramStr = parameters.join(', ');
    const retStr = returnType ? `: ${returnType}` : '';
    const signature = `${isExported ? 'export ' : ''}${isDefault ? 'default ' : ''}${isAsync ? 'async ' : ''}function ${name}(${paramStr})${retStr}`;

    return {
      name,
      kind: 'function',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature,
      parameters,
      returnType,
      isExported,
      isAsync,
    };
  }

  /**
   * Extracts arrow functions and variable declarations (Step 4c).
   */
  private extractVariableDeclarations(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false
  ): CodeSymbol[] {
    const symbols: CodeSymbol[] = [];

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child || child.type !== 'variable_declarator') continue;

      let name = '';
      let valueNode: Parser.SyntaxNode | null = null;
      let typeAnnotation: string | undefined;

      for (let j = 0; j < child.childCount; j++) {
        const declaratorChild = child.child(j);
        if (!declaratorChild) continue;

        if (declaratorChild.type === 'identifier') {
          name = declaratorChild.text;
        } else if (declaratorChild.type === 'type_annotation') {
          typeAnnotation = declaratorChild.text.replace(/^:\s*/, '');
        } else if (
          declaratorChild.type === 'arrow_function' ||
          declaratorChild.type === 'function_expression' ||
          declaratorChild.type === 'string' ||
          declaratorChild.type === 'number' ||
          declaratorChild.type === 'object' ||
          declaratorChild.type === 'array' ||
          declaratorChild.type === 'call_expression'
        ) {
          valueNode = declaratorChild;
        }
      }

      if (!name) continue;

      // Check if this variable is an arrow function
      if (valueNode && (valueNode.type === 'arrow_function' || valueNode.type === 'function_expression')) {
        let isAsync = false;
        let parameters: string[] = [];
        let returnType = typeAnnotation;

        for (let k = 0; k < valueNode.childCount; k++) {
          const fnChild = valueNode.child(k);
          if (!fnChild) continue;

          if (fnChild.type === 'async') {
            isAsync = true;
          } else if (fnChild.type === 'formal_parameters') {
            parameters = this.extractParameters(fnChild);
          } else if (fnChild.type === 'type_annotation') {
            returnType = fnChild.text.replace(/^:\s*/, '');
          }
        }

        const paramStr = parameters.join(', ');
        const retStr = returnType ? `: ${returnType}` : '';
        const signature = `${isExported ? 'export ' : ''}const ${name} = ${isAsync ? 'async ' : ''}(${paramStr})${retStr} => ...`;

        symbols.push({
          name,
          kind: 'function',
          filePath,
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1,
          startColumn: node.startPosition.column + 1,
          endColumn: node.endPosition.column + 1,
          signature,
          parameters,
          returnType,
          isExported,
          isAsync,
        });
      } else {
        // Plain constant or variable
        const typeStr = typeAnnotation ? `: ${typeAnnotation}` : '';
        const signature = `${isExported ? 'export ' : ''}const ${name}${typeStr}`;

        symbols.push({
          name,
          kind: 'variable',
          filePath,
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1,
          startColumn: node.startPosition.column + 1,
          endColumn: node.endPosition.column + 1,
          signature,
          isExported,
        });
      }
    }

    return symbols;
  }

  /**
   * Extracts class declarations and their methods.
   */
  private extractClassDeclaration(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false,
    isDefault = false
  ): { classSymbol: CodeSymbol; methodSymbols: CodeSymbol[] } | null {
    let name = '';
    let heritage = '';
    const methodSymbols: CodeSymbol[] = [];

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'type_identifier' || child.type === 'identifier') {
        name = child.text;
      } else if (child.type === 'class_heritage') {
        heritage = child.text.trim();
      } else if (child.type === 'class_body') {
        for (let j = 0; j < child.childCount; j++) {
          const bodyChild = child.child(j);
          if (bodyChild && bodyChild.type === 'method_definition') {
            const methodSym = this.extractMethodDefinition(bodyChild, filePath, name || 'AnonymousClass');
            if (methodSym) methodSymbols.push(methodSym);
          }
        }
      }
    }

    if (!name) {
      if (isDefault) name = 'default';
      else return null;
    }

    const signature = `${isExported ? 'export ' : ''}${isDefault ? 'default ' : ''}class ${name}${heritage ? ` ${heritage}` : ''}`;
    const classSymbol: CodeSymbol = {
      name,
      kind: 'class',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature,
      isExported,
    };

    return { classSymbol, methodSymbols };
  }

  /**
   * Extracts method definitions from a class body.
   */
  private extractMethodDefinition(
    node: Parser.SyntaxNode,
    filePath: string,
    parentClass: string
  ): CodeSymbol | null {
    let name = '';
    let parameters: string[] = [];
    let returnType: string | undefined;
    let accessibility: 'public' | 'private' | 'protected' = 'public';
    let isStatic = false;
    let isAsync = false;

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'accessibility_modifier') {
        accessibility = child.text as 'public' | 'private' | 'protected';
      } else if (child.type === 'static') {
        isStatic = true;
      } else if (child.type === 'async') {
        isAsync = true;
      } else if (child.type === 'property_identifier') {
        name = child.text;
      } else if (child.type === 'formal_parameters') {
        parameters = this.extractParameters(child);
      } else if (child.type === 'type_annotation') {
        returnType = child.text.replace(/^:\s*/, '');
      }
    }

    if (!name) return null;

    const paramStr = parameters.join(', ');
    const retStr = returnType ? `: ${returnType}` : '';
    const staticStr = isStatic ? 'static ' : '';
    const asyncStr = isAsync ? 'async ' : '';
    const signature = `${accessibility} ${staticStr}${asyncStr}${name}(${paramStr})${retStr}`;

    return {
      name,
      kind: 'method',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature,
      parameters,
      returnType,
      parentSymbol: parentClass,
      isAsync,
    };
  }

  /**
   * Extracts interface declarations.
   */
  private extractInterfaceDeclaration(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false
  ): CodeSymbol | null {
    let name = '';
    let heritage = '';

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'type_identifier' || child.type === 'identifier') {
        name = child.text;
      } else if (child.type === 'extends_type_clause') {
        heritage = child.text.trim();
      }
    }

    if (!name) return null;

    const signature = `${isExported ? 'export ' : ''}interface ${name}${heritage ? ` ${heritage}` : ''}`;
    return {
      name,
      kind: 'interface',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature,
      isExported,
    };
  }

  /**
   * Extracts type alias declarations.
   */
  private extractTypeAliasDeclaration(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false
  ): CodeSymbol | null {
    let name = '';

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'type_identifier') {
        name = child.text;
        break;
      }
    }

    if (!name) return null;

    return {
      name,
      kind: 'type',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature: `${isExported ? 'export ' : ''}type ${name}`,
      isExported,
    };
  }

  /**
   * Extracts enum declarations.
   */
  private extractEnumDeclaration(
    node: Parser.SyntaxNode,
    filePath: string,
    isExported = false
  ): CodeSymbol | null {
    let name = '';

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;

      if (child.type === 'identifier' || child.type === 'type_identifier') {
        name = child.text;
        break;
      }
    }

    if (!name) return null;

    return {
      name,
      kind: 'enum',
      filePath,
      startLine: node.startPosition.row + 1,
      endLine: node.endPosition.row + 1,
      startColumn: node.startPosition.column + 1,
      endColumn: node.endPosition.column + 1,
      signature: `${isExported ? 'export ' : ''}enum ${name}`,
      isExported,
    };
  }

  /**
   * Parses parameter names from formal_parameters node.
   */
  private extractParameters(paramsNode: Parser.SyntaxNode): string[] {
    const params: string[] = [];
    for (let i = 0; i < paramsNode.childCount; i++) {
      const child = paramsNode.child(i);
      if (!child) continue;

      if (
        child.type === 'required_parameter' ||
        child.type === 'optional_parameter' ||
        child.type === 'identifier' ||
        child.type === 'rest_pattern'
      ) {
        const paramText = child.text.trim();
        if (paramText && paramText !== '(' && paramText !== ')' && paramText !== ',') {
          params.push(paramText);
        }
      }
    }
    return params;
  }

  /**
   * Traverses the AST and extracts all symbols.
   */
  public async extract(sourceCode: string, filePath: string): Promise<FileExtractionResult> {
    const startTime = performance.now();
    const lang = detectLanguage(filePath);
    const isTsx = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');

    const parser = await createParser(lang, isTsx);
    if (!parser) {
      return {
        filePath,
        symbols: [],
        durationMs: performance.now() - startTime,
      };
    }

    const tree = parser.parse(sourceCode);
    const symbols: CodeSymbol[] = [];

    const visit = (node: Parser.SyntaxNode, isExportedContext = false) => {
      // Handle Export Statements
      if (node.type === 'export_statement') {
        const isDefault = node.children.some((c) => c.type === 'default');

        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (!child) continue;

          if (child.type === 'function_declaration') {
            const sym = this.extractFunctionDeclaration(child, filePath, true, isDefault);
            if (sym) symbols.push(sym);
          } else if (child.type === 'class_declaration') {
            const res = this.extractClassDeclaration(child, filePath, true, isDefault);
            if (res) {
              symbols.push(res.classSymbol, ...res.methodSymbols);
            }
          } else if (child.type === 'interface_declaration') {
            const sym = this.extractInterfaceDeclaration(child, filePath, true);
            if (sym) symbols.push(sym);
          } else if (child.type === 'type_alias_declaration') {
            const sym = this.extractTypeAliasDeclaration(child, filePath, true);
            if (sym) symbols.push(sym);
          } else if (child.type === 'enum_declaration') {
            const sym = this.extractEnumDeclaration(child, filePath, true);
            if (sym) symbols.push(sym);
          } else if (child.type === 'lexical_declaration' || child.type === 'variable_declaration') {
            const varSyms = this.extractVariableDeclarations(child, filePath, true);
            symbols.push(...varSyms);
          }
        }
        return;
      }

      // Handle Non-Exported Constructs
      if (node.type === 'function_declaration') {
        const sym = this.extractFunctionDeclaration(node, filePath, isExportedContext);
        if (sym) symbols.push(sym);
      } else if (node.type === 'class_declaration') {
        const res = this.extractClassDeclaration(node, filePath, isExportedContext);
        if (res) {
          symbols.push(res.classSymbol, ...res.methodSymbols);
        }
      } else if (node.type === 'interface_declaration') {
        const sym = this.extractInterfaceDeclaration(node, filePath, isExportedContext);
        if (sym) symbols.push(sym);
      } else if (node.type === 'type_alias_declaration') {
        const sym = this.extractTypeAliasDeclaration(node, filePath, isExportedContext);
        if (sym) symbols.push(sym);
      } else if (node.type === 'enum_declaration') {
        const sym = this.extractEnumDeclaration(node, filePath, isExportedContext);
        if (sym) symbols.push(sym);
      } else if (node.type === 'lexical_declaration' || node.type === 'variable_declaration') {
        const varSyms = this.extractVariableDeclarations(node, filePath, isExportedContext);
        symbols.push(...varSyms);
      }

      // Recurse children (except class bodies which were already processed in extractClassDeclaration)
      if (node.type !== 'class_declaration') {
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child) visit(child, isExportedContext);
        }
      }
    };

    visit(tree.rootNode);

    return {
      filePath,
      symbols,
      durationMs: performance.now() - startTime,
    };
  }
}
