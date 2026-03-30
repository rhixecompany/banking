#!/usr/bin/env node

import fs from "fs";
import path from "path";

import { PLUGINS_DIR } from "./constants";

type UpdateResult =
  | {
      success: false;
      name: string;
      reason: "no-commands" | "parse-error" | "write-error";
    }
  | { success: true; name: string; count: number };

/**
 * Convert commands references to skills references in a plugin.json
 * @param pluginJsonPath - Path to the plugin.json file
 */
function updatePluginManifest(pluginJsonPath: string): UpdateResult {
  const pluginDir = path.dirname(path.dirname(path.dirname(pluginJsonPath)));
  const pluginName = path.basename(pluginDir);

  console.log(`\nProcessing plugin: ${pluginName}`);

  // Read and parse plugin.json
  let plugin: Record<string, unknown>;
  try {
    const content = fs.readFileSync(pluginJsonPath, "utf8");
    plugin = JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ✗ Error reading/parsing: ${message}`);
    return { name: pluginName, reason: "parse-error", success: false };
  }

  // Check if plugin has commands field
  if (!plugin.commands || !Array.isArray(plugin.commands)) {
    console.log("  ℹ  No commands field found");
    return { name: pluginName, reason: "no-commands", success: false };
  }

  const commandCount = plugin.commands.length;
  console.log(`  Found ${commandCount} command(s) to convert`);

  // Validate and convert commands to skills format
  // Commands: "./commands/foo.md" → Skills: "./skills/foo/"
  const validCommands = plugin.commands.filter((cmd) => {
    if (typeof cmd !== "string") {
      console.log(
        `  ⚠  Skipping non-string command entry: ${JSON.stringify(cmd)}`,
      );
      return false;
    }
    if (!cmd.startsWith("./commands/") || !cmd.endsWith(".md")) {
      console.log(`  ⚠  Skipping command with unexpected format: ${cmd}`);
      return false;
    }
    return true;
  });
  const skills = validCommands.map((cmd) => {
    const basename = path.basename(cmd as string, ".md");
    return `./skills/${basename}/`;
  });

  // Initialize skills array if it doesn't exist or is not an array
  if (!Array.isArray(plugin.skills)) {
    plugin.skills = [];
  }
  // Add converted commands to skills array, de-duplicating entries
  const allSkills = new Set(plugin.skills as string[]);
  for (const skillPath of skills) {
    allSkills.add(skillPath);
  }
  plugin.skills = Array.from(allSkills);

  // Remove commands field
  delete plugin.commands;

  // Write updated plugin.json
  try {
    fs.writeFileSync(
      pluginJsonPath,
      JSON.stringify(plugin, null, 2) + "\n",
      "utf8",
    );
    console.log(`  ✓ Converted ${commandCount} command(s) to skills`);
    return { count: commandCount, name: pluginName, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ✗ Error writing file: ${message}`);
    return { name: pluginName, reason: "write-error", success: false };
  }
}

/**
 * Main function to update all plugin manifests
 */
function main(): void {
  console.log("=".repeat(60));
  console.log("Updating Plugin Manifests: Commands → Skills");
  console.log("=".repeat(60));

  // Check if plugins directory exists
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error(`Error: Plugins directory not found: ${PLUGINS_DIR}`);
    process.exit(1);
  }

  // Find all plugin.json files
  const pluginDirs = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  console.log(`Found ${pluginDirs.length} plugin directory(ies)\n`);

  const results = {
    failed: [] as string[],
    noCommands: [] as string[],
    updated: [] as { name: string; count: number }[],
  };

  // Process each plugin
  for (const dirName of pluginDirs) {
    const pluginJsonPath = path.join(
      PLUGINS_DIR,
      dirName,
      ".github/plugin",
      "plugin.json",
    );

    if (!fs.existsSync(pluginJsonPath)) {
      console.log(`\nSkipping ${dirName}: no plugin.json found`);
      continue;
    }

    const result = updatePluginManifest(pluginJsonPath);
    if (result.success) {
      results.updated.push({ count: result.count, name: result.name });
    } else if (result.reason === "no-commands") {
      results.noCommands.push(result.name);
    } else {
      results.failed.push(result.name);
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("Update Summary");
  console.log("=".repeat(60));
  console.log(`✓ Updated plugins: ${results.updated.length}`);
  console.log(`ℹ No commands field: ${results.noCommands.length}`);
  console.log(`✗ Failed: ${results.failed.length}`);
  console.log(`Total processed: ${pluginDirs.length}`);

  if (results.updated.length > 0) {
    console.log("\nUpdated plugins:");
    for (const { count, name } of results.updated)
      console.log(`  - ${name} (${count} command(s) → skills)`);
  }

  if (results.failed.length > 0) {
    console.log("\nFailed updates:");
    for (const name of results.failed) console.log(`  - ${name}`);
  }

  console.log("\n✅ Plugin manifest updates complete!");
  console.log(
    "\nNext steps:\n" +
      "1. Run 'npm run plugin:validate' to validate all updated plugins\n" +
      "2. Test that plugins work correctly\n",
  );
}

// Run the update
main();
