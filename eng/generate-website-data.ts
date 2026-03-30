#!/usr/bin/env node

/**
 * Generate JSON metadata files for the GitHub Pages website.
 * This script extracts metadata from agents, instructions, skills, hooks, and plugins
 * and writes them to website/data/ for client-side search and display.
 */

import fs from "fs";
import path from "path";

import {
  AGENTS_DIR,
  COOKBOOK_DIR,
  HOOKS_DIR,
  INSTRUCTIONS_DIR,
  PLUGINS_DIR,
  ROOT_FOLDER,
  SKILLS_DIR,
  WORKFLOWS_DIR,
} from "./constants";
import { getGitFileDates } from "./utils/git-dates";
import {
  parseFrontmatter,
  parseHookMetadata,
  parseSkillMetadata,
  parseWorkflowMetadata,
  parseYamlFile,
} from "./yaml-parser";

/**
 * Description placeholder
 *
 * @type {*}
 */
const WEBSITE_DIR = path.join(ROOT_FOLDER, "website");
/**
 * Description placeholder
 *
 * @type {*}
 */
const WEBSITE_DATA_DIR = path.join(WEBSITE_DIR, "public", "data");
/**
 * Description placeholder
 *
 * @type {*}
 */
const WEBSITE_SOURCE_DATA_DIR = path.join(WEBSITE_DIR, "data");

/**
 * Description placeholder
 *
 * @typedef {Frontmatter}
 */
type Frontmatter = Record<string, unknown>;

/**
 * Ensure the output directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(WEBSITE_DATA_DIR)) {
    fs.mkdirSync(WEBSITE_DATA_DIR, { recursive: true });
  }
}

/**
 * Extract title from filename or frontmatter
 */
function extractTitle(
  filePath: string,
  frontmatter?: Frontmatter | null,
): string {
  if (frontmatter?.name && typeof frontmatter.name === "string") {
    return frontmatter.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  // Fallback to filename
  const basename = path.basename(filePath);
  const name = basename
    .replace(/\.(agent|prompt|instructions)\.md$/, "")
    .replace(/\.md$/, "");
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate agents metadata
 */
function generateAgentsData(gitDates: Map<string, string>) {
  const agents: Record<string, unknown>[] = [];
  const files = fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith(".agent.md"));

  // Track all unique values for filters
  const allModels = new Set<string>();
  const allTools = new Set<string>();

  for (const file of files) {
    const filePath = path.join(AGENTS_DIR, file);
    const frontmatter = parseFrontmatter(filePath) as Frontmatter | null;
    const relativePath = path
      .relative(ROOT_FOLDER, filePath)
      .replaceAll("\\", "/");

    const model =
      typeof frontmatter?.model === "string" ? frontmatter.model : null;
    const tools = Array.isArray(frontmatter?.tools)
      ? frontmatter?.tools.map(String)
      : [];
    const handoffs = Array.isArray(frontmatter?.handoffs)
      ? frontmatter?.handoffs
      : [];

    // Track unique values
    if (model) allModels.add(model);
    for (const t of tools) allTools.add(t);

    agents.push({
      description:
        typeof frontmatter?.description === "string"
          ? frontmatter.description
          : "",
      filename: file,
      handoffs: handoffs.map((h) => {
        const entry = h as Record<string, unknown>;
        return {
          agent: typeof entry.agent === "string" ? entry.agent : "",
          label: typeof entry.label === "string" ? entry.label : "",
        };
      }),
      hasHandoffs: handoffs.length > 0,
      id: file.replace(".agent.md", ""),
      lastUpdated: gitDates.get(relativePath) || null,
      mcpServers:
        frontmatter && typeof frontmatter["mcp-servers"] === "object"
          ? Object.keys(frontmatter["mcp-servers"] as Record<string, unknown>)
          : [],
      model: model,
      path: relativePath,
      title: extractTitle(filePath, frontmatter),
      tools: tools,
    });
  }

  // Sort and return with filter metadata
  const sortedAgents = agents.sort((a, b) =>
    String(a.title).localeCompare(String(b.title)),
  );

  return {
    filters: {
      models: ["(none)", ...Array.from(allModels).sort()],
      tools: Array.from(allTools).sort(),
    },
    items: sortedAgents,
  };
}

/**
 * Generate hooks metadata (similar to skills - folder-based)
 */
function generateHooksData(gitDates: Map<string, string>) {
  const hooks: Record<string, unknown>[] = [];

  // Check if hooks directory exists
  if (!fs.existsSync(HOOKS_DIR)) {
    return {
      filters: {
        hooks: [] as string[],
        tags: [] as string[],
      },
      items: hooks,
    };
  }

  // Get all hook folders (directories)
  const hookFolders = fs.readdirSync(HOOKS_DIR).filter((file) => {
    const filePath = path.join(HOOKS_DIR, file);
    return fs.statSync(filePath).isDirectory();
  });

  // Track all unique values for filters
  const allHookTypes = new Set<string>();
  const allTags = new Set<string>();

  for (const folder of hookFolders) {
    const hookPath = path.join(HOOKS_DIR, folder);
    const metadata = parseHookMetadata(hookPath);
    if (!metadata) continue;

    const relativePath = path
      .relative(ROOT_FOLDER, hookPath)
      .replaceAll("\\", "/");
    const readmeRelativePath = `${relativePath}/README.md`;

    // Track unique values
    for (const h of metadata.hooks || []) allHookTypes.add(h);
    for (const t of metadata.tags || []) allTags.add(t);

    hooks.push({
      assets: metadata.assets || [],
      description: metadata.description,
      hooks: metadata.hooks || [],
      id: folder,
      lastUpdated: gitDates.get(readmeRelativePath) || null,
      path: relativePath,
      readmeFile: readmeRelativePath,
      tags: metadata.tags || [],
      title: metadata.name,
    });
  }

  // Sort and return with filter metadata
  const sortedHooks = hooks.sort((a, b) =>
    String(a.title).localeCompare(String(b.title)),
  );

  return {
    filters: {
      hooks: Array.from(allHookTypes).sort(),
      tags: Array.from(allTags).sort(),
    },
    items: sortedHooks,
  };
}

/**
 * Generate workflows metadata (flat .md files)
 */
function generateWorkflowsData(gitDates: Map<string, string>) {
  const workflows: Record<string, unknown>[] = [];

  // Check if workflows directory exists
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    return workflows;
  }

  const files = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => path.join(WORKFLOWS_DIR, file));

  for (const filePath of files) {
    const frontmatter = parseFrontmatter(filePath) as Frontmatter | null;
    const metadata = parseWorkflowMetadata(filePath);
    if (!metadata) continue;

    const relativePath = path
      .relative(ROOT_FOLDER, filePath)
      .replaceAll("\\", "/");

    workflows.push({
      description: metadata.description,
      filename: path.basename(filePath),
      id: path.basename(filePath, ".md"),
      lastUpdated: gitDates.get(relativePath) || null,
      path: relativePath,
      title: extractTitle(filePath, frontmatter),
      triggers: metadata.triggers || [],
    });
  }

  return workflows.sort((a, b) =>
    String(a.title).localeCompare(String(b.title)),
  );
}

/**
 * Generate skills metadata
 */
function generateSkillsData(gitDates: Map<string, string>) {
  const skills: Record<string, unknown>[] = [];

  if (!fs.existsSync(SKILLS_DIR)) {
    return skills;
  }

  const skillFolders = fs.readdirSync(SKILLS_DIR).filter((file) => {
    const filePath = path.join(SKILLS_DIR, file);
    return fs.statSync(filePath).isDirectory();
  });

  for (const folder of skillFolders) {
    const skillPath = path.join(SKILLS_DIR, folder);
    const metadata = parseSkillMetadata(skillPath);
    if (!metadata) continue;

    const relativePath = path
      .relative(ROOT_FOLDER, skillPath)
      .replaceAll("\\", "/");
    const skillFile = `${relativePath}/SKILL.md`;

    skills.push({
      assets: metadata.assets || [],
      description: metadata.description,
      id: folder,
      lastUpdated: gitDates.get(skillFile) || null,
      path: relativePath,
      skillFile: skillFile,
      title: metadata.name,
    });
  }

  return skills.sort((a, b) => String(a.title).localeCompare(String(b.title)));
}

/**
 * Generate instructions metadata
 */
function generateInstructionsData(gitDates: Map<string, string>) {
  const instructions: Record<string, unknown>[] = [];

  if (!fs.existsSync(INSTRUCTIONS_DIR)) {
    return instructions;
  }

  const files = fs
    .readdirSync(INSTRUCTIONS_DIR)
    .filter((f) => f.endsWith(".instructions.md"))
    .map((file) => path.join(INSTRUCTIONS_DIR, file));

  for (const filePath of files) {
    const frontmatter = parseFrontmatter(filePath) as Frontmatter | null;
    const relativePath = path
      .relative(ROOT_FOLDER, filePath)
      .replaceAll("\\", "/");
    instructions.push({
      description:
        typeof frontmatter?.description === "string"
          ? frontmatter.description
          : "",
      filename: path.basename(filePath),
      id: path.basename(filePath, ".instructions.md"),
      lastUpdated: gitDates.get(relativePath) || null,
      path: relativePath,
      title: extractTitle(filePath, frontmatter),
    });
  }

  return instructions.sort((a, b) =>
    String(a.title).localeCompare(String(b.title)),
  );
}

/**
 * Generate plugins metadata
 */
function generatePluginsData(gitDates: Map<string, string>) {
  const plugins: Record<string, unknown>[] = [];

  if (!fs.existsSync(PLUGINS_DIR)) {
    return plugins;
  }

  const pluginDirs = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const folder of pluginDirs) {
    const pluginPath = path.join(PLUGINS_DIR, folder);
    const pluginJsonPath = path.join(
      pluginPath,
      ".github/plugin",
      "plugin.json",
    );
    if (!fs.existsSync(pluginJsonPath)) {
      continue;
    }

    let metadata: null | Record<string, unknown> = null;
    try {
      const content = fs.readFileSync(pluginJsonPath, "utf8");
      metadata = JSON.parse(content) as Record<string, unknown>;
    } catch {
      metadata = null;
    }

    if (!metadata) {
      continue;
    }

    const relativePath = path
      .relative(ROOT_FOLDER, pluginPath)
      .replaceAll("\\", "/");

    plugins.push({
      description:
        typeof metadata.description === "string" ? metadata.description : "",
      id: folder,
      keywords: Array.isArray(metadata.keywords)
        ? metadata.keywords.map(String)
        : [],
      lastUpdated: gitDates.get(relativePath) || null,
      path: relativePath,
      title: typeof metadata.name === "string" ? metadata.name : folder,
      version: typeof metadata.version === "string" ? metadata.version : "",
    });
  }

  return plugins.sort((a, b) => String(a.title).localeCompare(String(b.title)));
}

/**
 * Generate cookbook metadata
 */
function generateCookbookData(gitDates: Map<string, string>) {
  const cookbooks: Record<string, unknown>[] = [];

  if (!fs.existsSync(COOKBOOK_DIR)) {
    return cookbooks;
  }

  const files = fs
    .readdirSync(COOKBOOK_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => path.join(COOKBOOK_DIR, file));

  for (const filePath of files) {
    const frontmatter = parseFrontmatter(filePath) as Frontmatter | null;
    const relativePath = path
      .relative(ROOT_FOLDER, filePath)
      .replaceAll("\\", "/");
    cookbooks.push({
      description:
        typeof frontmatter?.description === "string"
          ? frontmatter.description
          : "",
      filename: path.basename(filePath),
      id: path.basename(filePath, ".md"),
      lastUpdated: gitDates.get(relativePath) || null,
      path: relativePath,
      title: extractTitle(filePath, frontmatter),
    });
  }

  return cookbooks.sort((a, b) =>
    String(a.title).localeCompare(String(b.title)),
  );
}

/**
 * Generate workflows list from source data (if available)
 */
function generateWebsiteWorkflowsData() {
  if (!fs.existsSync(WEBSITE_SOURCE_DATA_DIR)) return [];

  const workflowsJsonPath = path.join(
    WEBSITE_SOURCE_DATA_DIR,
    "workflows.json",
  );
  if (!fs.existsSync(workflowsJsonPath)) return [];

  const workflows = parseYamlFile<Record<string, unknown>[]>(workflowsJsonPath);
  return workflows || [];
}

/**
 * Description placeholder
 *
 * @param {string} filePath
 * @param {unknown} data
 */
function writeJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Description placeholder */
function generateAllData(): void {
  ensureDataDir();

  const gitDates = getGitFileDates(
    [
      AGENTS_DIR,
      INSTRUCTIONS_DIR,
      SKILLS_DIR,
      HOOKS_DIR,
      PLUGINS_DIR,
      WORKFLOWS_DIR,
      COOKBOOK_DIR,
    ],
    ROOT_FOLDER,
  );

  const agentsData = generateAgentsData(gitDates);
  const instructionsData = generateInstructionsData(gitDates);
  const skillsData = generateSkillsData(gitDates);
  const hooksData = generateHooksData(gitDates);
  const pluginsData = generatePluginsData(gitDates);
  const workflowsData = generateWorkflowsData(gitDates);
  const cookbookData = generateCookbookData(gitDates);
  const websiteWorkflowsData = generateWebsiteWorkflowsData();

  writeJsonFile(path.join(WEBSITE_DATA_DIR, "agents.json"), agentsData);
  writeJsonFile(
    path.join(WEBSITE_DATA_DIR, "instructions.json"),
    instructionsData,
  );
  writeJsonFile(path.join(WEBSITE_DATA_DIR, "skills.json"), skillsData);
  writeJsonFile(path.join(WEBSITE_DATA_DIR, "hooks.json"), hooksData);
  writeJsonFile(path.join(WEBSITE_DATA_DIR, "plugins.json"), pluginsData);
  writeJsonFile(path.join(WEBSITE_DATA_DIR, "workflows.json"), workflowsData);
  writeJsonFile(path.join(WEBSITE_DATA_DIR, "cookbook.json"), cookbookData);
  writeJsonFile(
    path.join(WEBSITE_DATA_DIR, "website-workflows.json"),
    websiteWorkflowsData,
  );
}

generateAllData();
