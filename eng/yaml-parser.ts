// YAML parser for frontmatter parsing using vfile-matter
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { VFile } from "vfile";
import { matter } from "vfile-matter";

type Frontmatter = Record<string, unknown>;
interface SkillMetadata {
  name: string;
  description: string;
  assets: string[];
  path: string;
}
interface HookMetadata {
  name: string;
  description: string;
  assets: string[];
  hooks?: string[];
  tags?: string[];
  path: string;
}
interface WorkflowMetadata {
  name: string;
  description: string;
  triggers?: string[];
  path: string;
}
export interface McpServerConfig {
  name: string;
  type?: string;
  command?: string;
  args?: string[];
  url?: string;
  headers?: Record<string, string>;
}

function safeFileOperation<T>(
  operation: () => T,
  filePath: string,
  defaultValue: null | T = null,
): null | T {
  try {
    return operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${filePath}: ${message}`);
    return defaultValue;
  }
}

/**
 * Parse frontmatter from a markdown file using vfile-matter
 * Works with any markdown file that has YAML frontmatter (agents, prompts, instructions)
 * @param filePath - Path to the markdown file
 * @returns Parsed frontmatter object or null on error
 */
export function parseFrontmatter(filePath: string): Frontmatter | null {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      const file = new VFile({ path: filePath, value: content });

      // Parse the frontmatter using vfile-matter
      matter(file);

      // The frontmatter is now available in file.data.matter
      const frontmatter = file.data.matter as Frontmatter | undefined;

      // Normalize string fields that can accumulate trailing newlines/spaces
      if (frontmatter) {
        if (typeof frontmatter.name === "string") {
          frontmatter.name = frontmatter.name
            .replaceAll(/[\r\n]+$/g, "")
            .trim();
        }
        if (typeof frontmatter.title === "string") {
          frontmatter.title = frontmatter.title
            .replaceAll(/[\r\n]+$/g, "")
            .trim();
        }
        if (typeof frontmatter.description === "string") {
          // Remove only trailing whitespace/newlines; preserve internal formatting
          frontmatter.description = frontmatter.description.replaceAll(
            /[\s\r\n]+$/g,
            "",
          );
        }
      }

      return frontmatter ?? null;
    },
    filePath,
    null,
  );
}

/**
 * Extract agent metadata including MCP server information
 * @param filePath - Path to the agent file
 * @returns Agent metadata object with name, description, tools, and mcp-servers
 */
function extractAgentMetadata(filePath: string): Frontmatter | null {
  const frontmatter = parseFrontmatter(filePath);

  if (!frontmatter) {
    return null;
  }

  return {
    description:
      typeof frontmatter.description === "string"
        ? frontmatter.description
        : null,
    "mcp-servers": frontmatter["mcp-servers"] ?? {},
    name: typeof frontmatter.name === "string" ? frontmatter.name : null,
    tools: frontmatter.tools ?? [],
  };
}

/**
 * Extract MCP server names from an agent file
 * @param filePath - Path to the agent file
 * @returns Array of MCP server names
 */
export function extractMcpServers(filePath: string): string[] {
  const metadata = extractAgentMetadata(filePath);

  const mcpServers = metadata?.["mcp-servers"];
  if (!mcpServers || typeof mcpServers !== "object") {
    return [];
  }

  return Object.keys(mcpServers as Record<string, unknown>);
}

/**
 * Extract full MCP server configs from an agent file
 * @param filePath - Path to the agent file
 */
export function extractMcpServerConfigs(filePath: string): McpServerConfig[] {
  const metadata = extractAgentMetadata(filePath);
  const mcpServers = metadata?.["mcp-servers"];
  if (!mcpServers || typeof mcpServers !== "object") return [];

  return Object.entries(mcpServers as Record<string, unknown>).map(
    ([name, cfg]) => {
      if (!cfg || typeof cfg !== "object") {
        return { name };
      }
      const copy = { ...(cfg as Record<string, unknown>) };
      return {
        args: Array.isArray(copy.args) ? copy.args.map(String) : undefined,
        command: typeof copy.command === "string" ? copy.command : undefined,
        headers:
          typeof copy.headers === "object" && copy.headers !== null
            ? (copy.headers as Record<string, string>)
            : undefined,
        name,
        type: typeof copy.type === "string" ? copy.type : undefined,
        url: typeof copy.url === "string" ? copy.url : undefined,
      };
    },
  );
}

/**
 * Parse SKILL.md frontmatter and list bundled assets in a skill folder
 * @param skillPath - Path to skill folder
 * @returns Skill metadata with name, description, and assets array
 */
export function parseSkillMetadata(skillPath: string): null | SkillMetadata {
  return safeFileOperation(
    () => {
      const skillFile = path.join(skillPath, "SKILL.md");
      if (!fs.existsSync(skillFile)) {
        return null;
      }

      const frontmatter = parseFrontmatter(skillFile);

      // Validate required fields
      if (!frontmatter?.name || !frontmatter?.description) {
        console.warn(
          `Invalid skill at ${skillPath}: missing name or description in frontmatter`,
        );
        return null;
      }

      // List bundled assets (all files except SKILL.md), recursing through subdirectories
      const getAllFiles = (
        dirPath: string,
        arrayOfFiles: string[] = [],
      ): string[] => {
        const files = fs.readdirSync(dirPath);
        const assetPaths = ["references", "assets", "scripts"];

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          if (
            fs.statSync(filePath).isDirectory() &&
            assetPaths.includes(file)
          ) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
          } else {
            const relativePath = path.relative(skillPath, filePath);
            if (relativePath !== "SKILL.md") {
              // Normalize path separators to forward slashes for cross-platform consistency
              arrayOfFiles.push(relativePath.replaceAll("\\", "/"));
            }
          }
        }

        return arrayOfFiles;
      };

      const assets = getAllFiles(skillPath).sort();

      return {
        assets,
        description: String(frontmatter.description),
        name: String(frontmatter.name),
        path: skillPath,
      };
    },
    skillPath,
    null,
  );
}

/**
 * Parse hook metadata from a hook folder (similar to skills)
 * @param hookPath - Path to the hook folder
 * @returns Hook metadata or null on error
 */
export function parseHookMetadata(hookPath: string): HookMetadata | null {
  return safeFileOperation(
    () => {
      const readmeFile = path.join(hookPath, "README.md");
      if (!fs.existsSync(readmeFile)) {
        return null;
      }

      const frontmatter = parseFrontmatter(readmeFile);

      // Validate required fields
      if (!frontmatter?.name || !frontmatter?.description) {
        console.warn(
          `Invalid hook at ${hookPath}: missing name or description in frontmatter`,
        );
        return null;
      }

      // Extract hook types and tags
      const hooks = Array.isArray(frontmatter.hooks)
        ? frontmatter.hooks.map(String)
        : [];
      const tags = Array.isArray(frontmatter.tags)
        ? frontmatter.tags.map(String)
        : [];

      // List bundled assets similar to skills (exclude README.md)
      const getAllFiles = (
        dirPath: string,
        arrayOfFiles: string[] = [],
      ): string[] => {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
          } else {
            const relativePath = path.relative(hookPath, filePath);
            if (relativePath !== "README.md") {
              arrayOfFiles.push(relativePath.replaceAll("\\", "/"));
            }
          }
        }

        return arrayOfFiles;
      };

      const assets = getAllFiles(hookPath).sort();

      return {
        assets,
        description: String(frontmatter.description),
        hooks,
        name: String(frontmatter.name),
        path: hookPath,
        tags,
      };
    },
    hookPath,
    null,
  );
}

/**
 * Parse workflow metadata from a workflow markdown file
 * @param workflowPath - Path to workflow file
 * @returns Workflow metadata or null on error
 */
export function parseWorkflowMetadata(
  workflowPath: string,
): null | WorkflowMetadata {
  return safeFileOperation(
    () => {
      const frontmatter = parseFrontmatter(workflowPath);
      if (!frontmatter?.name || !frontmatter?.description) {
        return null;
      }

      const triggers = Array.isArray(frontmatter.triggers)
        ? frontmatter.triggers.map(String)
        : undefined;

      return {
        description: String(frontmatter.description),
        name: String(frontmatter.name),
        path: workflowPath,
        triggers,
      };
    },
    workflowPath,
    null,
  );
}

/**
 * Parse a YAML file
 */
export function parseYamlFile<T = unknown>(filePath: string): null | T {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      return yaml.load(content) as T;
    },
    filePath,
    null,
  );
}
