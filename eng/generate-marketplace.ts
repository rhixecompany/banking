#!/usr/bin/env node

import fs from "fs";
import path from "path";

import { ROOT_FOLDER } from "./constants";

interface ExternalPlugin {
  name: string;
  description: string;
  version: string;
  source: Record<string, unknown>;
}

interface LocalPlugin {
  name: string;
  description: string;
  version: string;
  source: string;
}

const PLUGINS_DIR = path.join(ROOT_FOLDER, "plugins");
const EXTERNAL_PLUGINS_FILE = path.join(
  ROOT_FOLDER,
  "plugins",
  "external.json",
);
const MARKETPLACE_FILE = path.join(
  ROOT_FOLDER,
  ".github/plugin",
  "marketplace.json",
);

/**
 * Validate an external plugin entry has required fields and a non-local source
 * @param plugin - External plugin entry
 * @param index - Index in the array (for error messages)
 */
function validateExternalPlugin(plugin: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `external.json[${index}]`;

  if (!plugin || typeof plugin !== "object") {
    errors.push(`${prefix}: entry must be an object`);
    return errors;
  }

  const record = plugin as Record<string, unknown>;
  if (!record.name || typeof record.name !== "string") {
    errors.push(`${prefix}: "name" is required and must be a string`);
  }
  if (!record.description || typeof record.description !== "string") {
    errors.push(`${prefix}: "description" is required and must be a string`);
  }
  if (!record.version || typeof record.version !== "string") {
    errors.push(`${prefix}: "version" is required and must be a string`);
  }

  if (!record.source) {
    errors.push(`${prefix}: "source" is required`);
  } else if (typeof record.source === "string") {
    errors.push(
      `${prefix}: "source" must be an object (local file paths are not allowed for external plugins)`,
    );
  } else if (typeof record.source === "object") {
    const source = record.source as Record<string, unknown>;
    if (!source.source) {
      errors.push(
        `${prefix}: "source.source" is required (e.g. "github", "url", "npm", "pip")`,
      );
    }
  } else {
    errors.push(`${prefix}: "source" must be an object`);
  }

  return errors;
}

/**
 * Read external plugin entries from external.json
 */
function readExternalPlugins(): ExternalPlugin[] {
  if (!fs.existsSync(EXTERNAL_PLUGINS_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(EXTERNAL_PLUGINS_FILE, "utf8");
    const plugins = JSON.parse(content);
    if (!Array.isArray(plugins)) {
      console.warn("Warning: external.json must contain an array");
      return [];
    }

    // Validate each entry
    let hasErrors = false;
    for (let i = 0; i < plugins.length; i++) {
      const errors = validateExternalPlugin(plugins[i], i);
      if (errors.length > 0) {
        for (const e of errors) console.error(`Error: ${e}`);
        hasErrors = true;
      }
    }
    if (hasErrors) {
      console.error("Error: external.json contains invalid entries");
      process.exit(1);
    }

    return plugins as ExternalPlugin[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error reading external.json: ${message}`);
    return [];
  }
}

/**
 * Read plugin metadata from plugin.json file
 * @param pluginDir - Path to plugin directory
 */
function readPluginMetadata(pluginDir: string): null | Record<string, unknown> {
  const pluginJsonPath = path.join(pluginDir, ".github/plugin", "plugin.json");

  if (!fs.existsSync(pluginJsonPath)) {
    console.warn(
      `Warning: No plugin.json found for ${path.basename(pluginDir)}`,
    );
    return null;
  }

  try {
    const content = fs.readFileSync(pluginJsonPath, "utf8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Error reading plugin.json for ${path.basename(pluginDir)}:`,
      message,
    );
    return null;
  }
}

/**
 * Generate marketplace.json from plugin directories
 */
function generateMarketplace(): void {
  console.log("Generating marketplace.json...");

  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error(`Error: Plugins directory not found at ${PLUGINS_DIR}`);
    process.exit(1);
  }

  // Read all plugin directories
  const pluginDirs = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  console.log(`Found ${pluginDirs.length} plugin directories`);

  // Read metadata for each plugin
  const plugins: (ExternalPlugin | LocalPlugin)[] = [];
  for (const dirName of pluginDirs) {
    const pluginPath = path.join(PLUGINS_DIR, dirName);
    const metadata = readPluginMetadata(pluginPath);

    if (metadata) {
      const name = typeof metadata.name === "string" ? metadata.name : dirName;
      const description =
        typeof metadata.description === "string" ? metadata.description : "";
      const version =
        typeof metadata.version === "string" ? metadata.version : "1.0.0";

      plugins.push({
        description,
        name,
        source: dirName,
        version,
      });
      console.log(`✓ Added plugin: ${name}`);
    } else {
      console.log(`✗ Skipped: ${dirName} (no valid plugin.json)`);
    }
  }

  // Read external plugins and merge as-is
  const externalPlugins = readExternalPlugins();
  if (externalPlugins.length > 0) {
    console.log(`\nFound ${externalPlugins.length} external plugins`);

    // Warn on duplicate names
    const localNames = new Set(plugins.map((p) => p.name));
    for (const ext of externalPlugins) {
      if (localNames.has(ext.name)) {
        console.warn(
          `Warning: external plugin "${ext.name}" has the same name as a local plugin`,
        );
      }
      plugins.push(ext);
      console.log(`✓ Added external plugin: ${ext.name}`);
    }
  }

  // Sort all plugins by name (case-insensitive)
  plugins.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  // Create marketplace.json structure
  const marketplace = {
    metadata: {
      description:
        "Community-driven collection of GitHub Copilot plugins, agents, prompts, and skills",
      pluginRoot: "./plugins",
      version: "1.0.0",
    },
    name: "awesome-copilot",
    owner: {
      email: "copilot@github.com",
      name: "GitHub",
    },
    plugins: plugins,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(MARKETPLACE_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write marketplace.json
  fs.writeFileSync(
    MARKETPLACE_FILE,
    JSON.stringify(marketplace, null, 2) + "\n",
  );

  console.log(`\n✓ Marketplace file written to ${MARKETPLACE_FILE}`);
  console.log(`✓ Total plugins: ${plugins.length}`);
}

generateMarketplace();
