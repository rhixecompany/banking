#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import {
  AGENTS_DIR,
  AKA_INSTALL_URLS,
  DOCS_DIR,
  HOOKS_DIR,
  INSTRUCTIONS_DIR,
  MAX_AGENTS_ITEMS,
  MAX_DOCS_ITEMS,
  MAX_HOOKS_ITEMS,
  MAX_PLUGIN_ITEMS,
  MAX_PROMPTS_ITEMS,
  MAX_SKILLS_ITEMS,
  PLUGINS_DIR,
  repoBaseUrl,
  ROOT_FOLDER,
  SKILLS_DIR,
  TEMPLATES,
  vscodeInsidersInstallImage,
  vscodeInstallImage,
  WORKFLOWS_DIR,
} from "./constants";
import {
  extractMcpServerConfigs,
  parseFrontmatter,
  parseHookMetadata,
  parseSkillMetadata,
  parseWorkflowMetadata,
} from "./yaml-parser";

/**
 * Description placeholder
 *
 * @type {*}
 */
const filename = fileURLToPath(import.meta.url);
/**
 * Description placeholder
 *
 * @type {*}
 */
const dirName = dirname(filename);

/**
 * Description placeholder
 *
 * @interface RegistryServer
 * @typedef {RegistryServer}
 */
interface RegistryServer {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  displayName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  fullName: string;
}

// Cache of MCP registry server names (lower-cased) fetched from the API
/**
 * Description placeholder
 *
 * @type {(null | RegistryServer[])}
 */
let MCP_REGISTRY_SET: null | RegistryServer[] = null;
/**
 * Loads and caches the set of MCP registry server names from the GitHub MCP registry API.
 *
 * Behavior:
 * - If a cached set already exists (MCP_REGISTRY_SET), it is returned immediately.
 * - Fetches all pages from https://api.mcp.github.com/v0.1/servers/ using cursor-based pagination
 * - Safely handles network errors or malformed JSON by returning an empty array.
 * - Extracts server names from: data[].server.name
 * - Normalizes names to lowercase for case-insensitive matching
 * - Only hits the API once per README build run (cached for subsequent calls)
 *
 * Side Effects:
 * - Mutates the module-scoped variable MCP_REGISTRY_SET.
 * - Logs a warning to console if fetching or parsing the registry fails.
 */
async function loadMcpRegistryNames(): Promise<RegistryServer[]> {
  if (MCP_REGISTRY_SET) return MCP_REGISTRY_SET;

  try {
    console.log("Fetching MCP registry from API...");
    const allServers: RegistryServer[] = [];
    let cursor: null | string = null;
    const apiUrl = "https://api.mcp.github.com/v0.1/servers/";

    // Fetch all pages using cursor-based pagination
    do {
      const url = cursor
        ? `${apiUrl}?cursor=${encodeURIComponent(cursor)}`
        : apiUrl;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const json = (await response.json()) as Record<string, unknown>;
      const servers = Array.isArray(json?.servers) ? json.servers : [];

      // Extract server names and displayNames from the response
      for (const entry of servers) {
        const serverName =
          typeof entry === "object" && entry !== null
            ? (entry as Record<string, unknown>)?.server
            : undefined;
        const nameValue =
          typeof serverName === "object" && serverName !== null
            ? (serverName as Record<string, unknown>)?.name
            : undefined;

        if (typeof nameValue === "string") {
          const server = serverName as Record<string, unknown>;
          const meta =
            typeof server._meta === "object" && server._meta !== null
              ? (server._meta as Record<string, unknown>)
              : undefined;
          const publisher =
            meta &&
            typeof meta[
              "io.modelcontextprotocol.registry/publisher-provided"
            ] === "object" &&
            meta["io.modelcontextprotocol.registry/publisher-provided"] !== null
              ? (meta[
                  "io.modelcontextprotocol.registry/publisher-provided"
                ] as Record<string, unknown>)
              : undefined;
          const github =
            publisher &&
            typeof publisher.github === "object" &&
            publisher.github
              ? (publisher.github as Record<string, unknown>)
              : undefined;
          const displayName =
            typeof github?.displayName === "string"
              ? github.displayName
              : nameValue;

          allServers.push({
            displayName: displayName.toLowerCase(),
            fullName: nameValue.toLowerCase(),
            name: nameValue,
          });
        }
      }

      // Get next cursor for pagination
      const metadata =
        typeof json?.metadata === "object" && json.metadata !== null
          ? (json.metadata as Record<string, unknown>)
          : undefined;
      cursor =
        typeof metadata?.nextCursor === "string" ? metadata.nextCursor : null;
    } while (cursor);

    console.log(`Loaded ${allServers.length} servers from MCP registry`);
    MCP_REGISTRY_SET = allServers;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to load MCP registry from API: ${message}`);
    MCP_REGISTRY_SET = [];
  }

  return MCP_REGISTRY_SET;
}

// Add error handling utility
/**
 * Safe file operation wrapper
 */
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
 * Description placeholder
 *
 * @param {string} filePath
 * @returns {(null | string)}
 */
function extractTitle(filePath: string): null | string {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      // Step 1: Try to get title from frontmatter using vfile-matter
      const frontmatter = parseFrontmatter(filePath);

      if (frontmatter) {
        // Check for name field
        if (frontmatter.name && typeof frontmatter.name === "string") {
          return frontmatter.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      // Step 2: For prompt/agent/instructions files, look for heading after frontmatter
      if (
        filePath.includes(".prompt.md") ||
        filePath.includes(".agent.md") ||
        filePath.includes(".instructions.md")
      ) {
        // Look for first heading after frontmatter
        let inFrontmatter = false;
        let frontmatterEnded = false;
        let inCodeBlock = false;

        for (const line of lines) {
          if (line.trim() === "---") {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else if (inFrontmatter && !frontmatterEnded) {
              frontmatterEnded = true;
            }
            continue;
          }

          // Only look for headings after frontmatter ends
          if (frontmatterEnded || !inFrontmatter) {
            // Track code blocks to ignore headings inside them
            if (
              line.trim().startsWith("```") ||
              line.trim().startsWith("````")
            ) {
              inCodeBlock = !inCodeBlock;
              continue;
            }

            if (!inCodeBlock && line.startsWith("# ")) {
              return line.slice(2).trim();
            }
          }
        }

        // Step 3: Format filename for prompt/chatmode/instructions files if no heading found
        const basename = path.basename(
          filePath,
          filePath.includes(".prompt.md")
            ? ".prompt.md"
            : filePath.includes(".agent.md")
              ? ".agent.md"
              : ".instructions.md",
        );
        return basename
          .replaceAll(/[-_]/g, " ")
          .replaceAll(/\b\w/g, (l) => l.toUpperCase());
      }

      // Step 4: For other files, look for the first heading (but not in code blocks)
      let inCodeBlock = false;
      for (const line of lines) {
        if (line.trim().startsWith("```") || line.trim().startsWith("````")) {
          inCodeBlock = !inCodeBlock;
          continue;
        }

        if (!inCodeBlock && line.startsWith("# ")) {
          return line.slice(2).trim();
        }
      }

      return null;
    },
    filePath,
    null,
  );
}

/**
 * Description placeholder
 *
 * @param {string} filePath
 * @returns {string}
 */
function getInstallButtons(filePath: string): string {
  const fileName = path.basename(filePath);
  const encodedPath = encodeURIComponent(fileName);
  return `[![VS Code](${vscodeInstallImage})](${AKA_INSTALL_URLS.instructions}?path=${encodedPath}) [![VS Code Insiders](${vscodeInsidersInstallImage})](${AKA_INSTALL_URLS.instructions}?path=${encodedPath}&insiders=true)`;
}

/**
 * Description placeholder
 *
 * @param {string} filePath
 * @returns {string}
 */
function getAgentInstallButtons(filePath: string): string {
  const fileName = path.basename(filePath);
  const encodedPath = encodeURIComponent(fileName);
  return `[![VS Code](${vscodeInstallImage})](${AKA_INSTALL_URLS.agent}?path=${encodedPath}) [![VS Code Insiders](${vscodeInsidersInstallImage})](${AKA_INSTALL_URLS.agent}?path=${encodedPath}&insiders=true)`;
}

/**
 * Description placeholder
 *
 * @param {string} folderName
 * @returns {string}
 */
function getHookInstallButtons(folderName: string): string {
  const encodedPath = encodeURIComponent(folderName);
  return `[![VS Code](${vscodeInstallImage})](${AKA_INSTALL_URLS.hook}?path=${encodedPath}) [![VS Code Insiders](${vscodeInsidersInstallImage})](${AKA_INSTALL_URLS.hook}?path=${encodedPath}&insiders=true)`;
}

/**
 * Description placeholder
 *
 * @param {string} dirPath
 * @param {string} suffix
 * @param {number} maxItems
 * @returns {string[]}
 */
function listMarkdownFiles(
  dirPath: string,
  suffix: string,
  maxItems: number,
): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(suffix))
    .sort()
    .slice(0, maxItems)
    .map((file) => path.join(dirPath, file));
}

/**
 * Description placeholder
 *
 * @param {string} dirPath
 * @param {string} suffix
 * @returns {string[]}
 */
function readMarkdownFiles(dirPath: string, suffix: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(suffix))
    .sort();
}

/**
 * Description placeholder
 *
 * @param {string[]} files
 * @param {("agents" | "instructions" | "prompts")} listType
 * @returns {string[]}
 */
function getMarkdownTableRows(
  files: string[],
  listType: "agents" | "instructions" | "prompts",
): string[] {
  return files.map((file) => {
    const fileName = path.basename(file);
    const frontmatter = parseFrontmatter(file);
    const title = extractTitle(file) || fileName;
    const description =
      typeof frontmatter?.description === "string"
        ? frontmatter.description.replaceAll(/\r?\n/g, " ")
        : "";
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, file)
      .replaceAll("\\", "/")}`;

    let installButtons = "";
    if (listType === "instructions") {
      installButtons = getInstallButtons(file);
    } else if (listType === "agents") {
      installButtons = getAgentInstallButtons(file);
    } else if (listType === "prompts") {
      installButtons = "";
    }

    return `| [${title}](${repoUrl}) | ${description} | ${installButtons} |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string[]} hooks
 * @returns {string[]}
 */
function getHooksTableRows(hooks: string[]): string[] {
  return hooks.map((folderName) => {
    const hookPath = path.join(HOOKS_DIR, folderName);
    const metadata = parseHookMetadata(hookPath);
    const name = metadata?.name ?? folderName;
    const description = metadata?.description ?? "";
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, hookPath)
      .replaceAll("\\", "/")}`;
    const installButtons = getHookInstallButtons(folderName);
    return `| [${name}](${repoUrl}) | ${description} | ${installButtons} |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string} dirPath
 * @param {number} maxItems
 * @returns {string[]}
 */
function listFolders(dirPath: string, maxItems: number): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .slice(0, maxItems);
}

/**
 * Description placeholder
 *
 * @param {string[]} skills
 * @returns {string[]}
 */
function getSkillsTableRows(skills: string[]): string[] {
  return skills.map((folderName) => {
    const skillPath = path.join(SKILLS_DIR, folderName);
    const metadata = parseSkillMetadata(skillPath);
    const name = metadata?.name ?? folderName;
    const description = metadata?.description ?? "";
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, skillPath)
      .replaceAll("\\", "/")}`;
    return `| [${name}](${repoUrl}) | ${description} |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string[]} workflows
 * @returns {string[]}
 */
function getWorkflowsTableRows(workflows: string[]): string[] {
  return workflows.map((filePath) => {
    const metadata = parseWorkflowMetadata(filePath);
    const name = metadata?.name ?? path.basename(filePath, ".md");
    const description = metadata?.description ?? "";
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, filePath)
      .replaceAll("\\", "/")}`;
    return `| [${name}](${repoUrl}) | ${description} |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string[]} files
 * @returns {string[]}
 */
function getDocsTableRows(files: string[]): string[] {
  return files.map((file) => {
    const fileName = path.basename(file);
    const title = extractTitle(file) || fileName;
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, file)
      .replaceAll("\\", "/")}`;
    return `| [${title}](${repoUrl}) |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string[]} files
 * @returns {string[]}
 */
function getPromptsTableRows(files: string[]): string[] {
  return files.map((file) => {
    const fileName = path.basename(file);
    const title = extractTitle(file) || fileName;
    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, file)
      .replaceAll("\\", "/")}`;
    return `| [${title}](${repoUrl}) |`;
  });
}

/**
 * Description placeholder
 *
 * @param {string} promptDir
 * @returns {string[]}
 */
function listPromptFiles(promptDir: string): string[] {
  if (!fs.existsSync(promptDir)) return [];
  return fs
    .readdirSync(promptDir)
    .filter((f) => f.endsWith(".prompt.md"))
    .map((file) => path.join(promptDir, file))
    .sort();
}

/**
 * Description placeholder
 *
 * @param {string} workflowDir
 * @returns {string[]}
 */
function listWorkflowFiles(workflowDir: string): string[] {
  if (!fs.existsSync(workflowDir)) return [];
  return fs
    .readdirSync(workflowDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(workflowDir, file))
    .sort();
}

/**
 * Description placeholder
 *
 * @param {string} docsDir
 * @returns {string[]}
 */
function listDocsFiles(docsDir: string): string[] {
  if (!fs.existsSync(docsDir)) return [];
  return fs
    .readdirSync(docsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(docsDir, file))
    .sort();
}

/**
 * Description placeholder
 *
 * @param {string} title
 * @param {string[]} rows
 * @param {string[]} headers
 * @returns {string}
 */
function getMarkdownTable(
  title: string,
  rows: string[],
  headers: string[],
): string {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  return [title, "", headerRow, separatorRow, ...rows, ""].join("\n");
}

/**
 * Description placeholder
 *
 * @param {string} dirPath
 * @param {("agents" | "instructions" | "prompts")} listType
 * @param {number} maxItems
 * @returns {string}
 */
function listAndBuildTable(
  dirPath: string,
  listType: "agents" | "instructions" | "prompts",
  maxItems: number,
): string {
  const suffix =
    listType === "prompts"
      ? ".prompt.md"
      : listType === "agents"
        ? ".agent.md"
        : ".instructions.md";
  const files = listMarkdownFiles(dirPath, suffix, maxItems);
  const rows = getMarkdownTableRows(files, listType);
  const headers = ["Name", "Description"];
  if (listType !== "prompts") headers.push("Install");
  return getMarkdownTable(
    `### ${listType.charAt(0).toUpperCase() + listType.slice(1)}`,
    rows,
    headers,
  );
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildHooksTable(): string {
  const hooks = listFolders(HOOKS_DIR, MAX_HOOKS_ITEMS);
  const rows = getHooksTableRows(hooks);
  return getMarkdownTable("### Hooks", rows, [
    "Name",
    "Description",
    "Install",
  ]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildSkillsTable(): string {
  const skills = listFolders(SKILLS_DIR, MAX_SKILLS_ITEMS);
  const rows = getSkillsTableRows(skills);
  return getMarkdownTable("### Skills", rows, ["Name", "Description"]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildWorkflowsTable(): string {
  const workflows = listWorkflowFiles(WORKFLOWS_DIR);
  const rows = getWorkflowsTableRows(workflows);
  return getMarkdownTable("### Workflows", rows, ["Name", "Description"]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildDocsTable(): string {
  const docs = listDocsFiles(DOCS_DIR).slice(0, MAX_DOCS_ITEMS);
  const rows = getDocsTableRows(docs);
  return getMarkdownTable("### Docs", rows, ["Name"]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildPromptsTable(): string {
  const prompts = listPromptFiles(path.join(ROOT_FOLDER, "prompts")).slice(
    0,
    MAX_PROMPTS_ITEMS,
  );
  const rows = getPromptsTableRows(prompts);
  return getMarkdownTable("### Prompts", rows, ["Name"]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildInstructionsTable(): string {
  return listAndBuildTable(INSTRUCTIONS_DIR, "instructions", MAX_DOCS_ITEMS);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildAgentsTable(): string {
  return listAndBuildTable(AGENTS_DIR, "agents", MAX_AGENTS_ITEMS);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function listAndBuildPluginsTable(): string {
  const plugins = listFolders(PLUGINS_DIR, MAX_PLUGIN_ITEMS);
  const rows = plugins.map((folderName) => {
    const pluginJsonPath = path.join(
      PLUGINS_DIR,
      folderName,
      ".github/plugin",
      "plugin.json",
    );
    let name = folderName;
    let description = "";

    if (fs.existsSync(pluginJsonPath)) {
      try {
        const pluginJson = JSON.parse(
          fs.readFileSync(pluginJsonPath, "utf8"),
        ) as {
          name?: string;
          description?: string;
        };
        if (pluginJson.name) name = pluginJson.name;
        if (pluginJson.description) description = pluginJson.description;
      } catch {
        // Ignore invalid plugin.json
      }
    }

    const repoUrl = `${repoBaseUrl}/${path
      .relative(ROOT_FOLDER, path.join(PLUGINS_DIR, folderName))
      .replaceAll("\\", "/")}`;
    return `| [${name}](${repoUrl}) | ${description} |`;
  });

  return getMarkdownTable("### Plugins", rows, ["Name", "Description"]);
}

/**
 * Description placeholder
 *
 * @returns {string}
 */
function buildReadmeContent(): string {
  const instructionsTable = listAndBuildInstructionsTable();
  const agentsTable = listAndBuildAgentsTable();
  const promptsTable = listAndBuildPromptsTable();
  const hooksTable = listAndBuildHooksTable();
  const skillsTable = listAndBuildSkillsTable();
  const workflowsTable = listAndBuildWorkflowsTable();
  const docsTable = listAndBuildDocsTable();
  const pluginsTable = listAndBuildPluginsTable();

  const template = fs.readFileSync(
    path.join(dirName, "README.template.md"),
    "utf8",
  );

  return template
    .replace("{{INSTRUCTIONS_SECTION}}", TEMPLATES.instructionsSection)
    .replace("{{INSTRUCTIONS_USAGE}}", TEMPLATES.instructionsUsage)
    .replace("{{INSTRUCTIONS_TABLE}}", instructionsTable)
    .replace("{{AGENTS_SECTION}}", TEMPLATES.agentsSection)
    .replace("{{AGENTS_USAGE}}", TEMPLATES.agentsUsage)
    .replace("{{AGENTS_TABLE}}", agentsTable)
    .replace("{{PROMPTS_TABLE}}", promptsTable)
    .replace("{{HOOKS_SECTION}}", TEMPLATES.hooksSection)
    .replace("{{HOOKS_USAGE}}", TEMPLATES.hooksUsage)
    .replace("{{HOOKS_TABLE}}", hooksTable)
    .replace("{{SKILLS_SECTION}}", TEMPLATES.skillsSection)
    .replace("{{SKILLS_USAGE}}", TEMPLATES.skillsUsage)
    .replace("{{SKILLS_TABLE}}", skillsTable)
    .replace("{{WORKFLOWS_SECTION}}", TEMPLATES.workflowsSection)
    .replace("{{WORKFLOWS_USAGE}}", TEMPLATES.workflowsUsage)
    .replace("{{WORKFLOWS_TABLE}}", workflowsTable)
    .replace("{{DOCS_TABLE}}", docsTable)
    .replace("{{PLUGINS_SECTION}}", TEMPLATES.pluginsSection)
    .replace("{{PLUGINS_USAGE}}", TEMPLATES.pluginsUsage)
    .replace("{{PLUGINS_TABLE}}", pluginsTable)
    .replace("{{FEATURED_PLUGINS_SECTION}}", TEMPLATES.featuredPluginsSection);
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function writeReadme(content: string): void {
  fs.writeFileSync(path.join(ROOT_FOLDER, "README.md"), content, "utf8");
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function updateDocsMcpRegistry(): Promise<void> {
  const registry = await loadMcpRegistryNames();

  const agentFiles = readMarkdownFiles(AGENTS_DIR, ".agent.md");
  const mcpRows: string[] = [];
  const notInRegistry: string[] = [];

  for (const fileName of agentFiles) {
    const filePath = path.join(AGENTS_DIR, fileName);
    const configs = extractMcpServerConfigs(filePath);

    for (const config of configs) {
      const match = registry.find(
        (r) => r.fullName === config.name.toLowerCase(),
      );
      if (match) {
        mcpRows.push(`| ${config.name} | ${match.displayName} |`);
      } else {
        notInRegistry.push(config.name);
        mcpRows.push(`| ${config.name} | (not in registry) |`);
      }
    }
  }

  const registrySection = getMarkdownTable("## MCP Servers", mcpRows, [
    "Name",
    "Registry Display Name",
  ]);
  const notFoundSection = notInRegistry.length
    ? `\n\n### Not found in registry\n${[...new Set(notInRegistry)].join("\n")}`
    : "";
  const docsPath = path.join(DOCS_DIR, "mcp-servers.generated.md");
  fs.writeFileSync(docsPath, `${registrySection}${notFoundSection}\n`, "utf8");
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function updateReadme(): Promise<void> {
  const content = buildReadmeContent();
  writeReadme(content);

  await updateDocsMcpRegistry();
}

updateReadme();
