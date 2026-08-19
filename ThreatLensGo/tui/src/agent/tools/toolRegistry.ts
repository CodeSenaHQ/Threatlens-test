import path from 'node:path';
import fs from 'node:fs/promises';
import { ToolDefinition, ToolResult, ToolContext } from './types.js';
import {
  searchCodeTool,
  findSymbolTool,
  readFileTool,
  editFileTool,
  listDirectoryTool,
  getDependenciesTool,
} from './codebaseTools.js';
import { runSectestTool, verifyRemediationTool } from './securityTools.js';
import { DiffApprovalPayload } from '../types.js';
import { DEFAULT_AGENT_CONFIG, AgentConfig } from '../config.js';

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();
  private context: ToolContext;
  private config: AgentConfig;

  constructor(context: ToolContext, config: AgentConfig = DEFAULT_AGENT_CONFIG) {
    this.context = context;
    this.config = config;
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    this.register(searchCodeTool);
    this.register(findSymbolTool);
    this.register(readFileTool);
    this.register(editFileTool);
    this.register(listDirectoryTool);
    this.register(getDependenciesTool);
    this.register(runSectestTool);
    this.register(verifyRemediationTool);
  }

  public register(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  public getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getToolDefinitions() {
    return Array.from(this.tools.values()).map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  /**
   * Executes a tool with argument validation, context injection, and timeout protection.
   */
  public async execute(name: string, args: Record<string, any>): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        success: false,
        error: `Unknown tool '${name}'. Available tools: ${Array.from(this.tools.keys()).join(', ')}`,
      };
    }

    const timeoutMs =
      name === 'run_sectest' || name === 'verify_remediation'
        ? this.config.securityProbeTimeoutMs
        : this.config.fastToolTimeoutMs;

    return new Promise<ToolResult>((resolve) => {
      const timer = setTimeout(() => {
        resolve({
          success: false,
          error: `Tool '${name}' timed out after ${timeoutMs / 1000}s.`,
        });
      }, timeoutMs);

      tool
        .execute(args, this.context)
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          resolve({
            success: false,
            error: `Error executing tool '${name}': ${err?.message || String(err)}`,
          });
        });
    });
  }

  /**
   * Applies an approved diff to disk.
   */
  public async applyDiff(payload: DiffApprovalPayload): Promise<boolean> {
    try {
      const fullPath = path.resolve(this.context.workspaceRoot, payload.file);
      await fs.writeFile(fullPath, payload.newContent, 'utf8');
      return true;
    } catch {
      return false;
    }
  }
}
