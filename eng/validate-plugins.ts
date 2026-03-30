#!/usr/bin/env node

import fs from "fs";
import path from "path";

import { ROOT_FOLDER } from "./constants";

const PLUGINS_DIR = path.join(ROOT_FOLDER, "plugins");

type PluginSpec = {
  name?: string;
  description?: string;
  version?: string;
  keywords?: string[];
  tags?: string[];
  agents?: string[];
  skills?: string[];
  commands?: string[];
} & Record<string, unknown>;

// Validation functions
function validateName(name: string | undefined, folderName: string): string[] {
  const errors: string[] = [];
  if (!name || typeof name !== "string") {
    errors.push("name is required and must be a string");
    return errors;
  }
  if (name.length < 1 || name.length > 50) {
    errors.push("name must be between 1 and 50 characters");
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    errors.push(
      "name must contain only lowercase letters, numbers, and hyphens",
    );
  }
  if (name !== folderName) {
    errors.push(`name "${name}" must match folder name "${folderName}"`);
  }
  return errors;
}

function validateDescription(description: string | undefined): null | string {
  if (!description || typeof description !== "string") {
    return "description is required and must be a string";
  }
  if (description.length < 1 || description.length > 500) {
    return "description must be between 1 and 500 characters";
  }
  return null;
}

function validateVersion(version: string | undefined): null | string {
  if (!version || typeof version !== "string") {
    return "version is required and must be a string";
  }
  return null;
}

function validateKeywords(keywords: unknown): null | string {
  if (keywords === undefined) return null;
  if (!Array.isArray(keywords)) {
    return "keywords must be an array";
  }
  if (keywords.length > 10) {
    return "maximum 10 keywords allowed";
  }
  for (const keyword of keywords) {
    if (typeof keyword !== "string") {
      return "all keywords must be strings";
    }
    if (!/^[a-z0-9-]+$/.test(keyword)) {
      return `keyword "${keyword}" must contain only lowercase letters, numbers, and hyphens`;
    }
    if (keyword.length < 1 || keyword.length > 30) {
      return `keyword "${keyword}" must be between 1 and 30 characters`;
    }
  }
  return null;
}

function validateSpecPaths(plugin: PluginSpec): string[] {
  const errors: string[] = [];
  const specs = {
    agents: {
      prefix: "./agents/",
      repoDir: "agents",
      repoSuffix: ".agent.md",
      suffix: ".md",
    },
    skills: {
      prefix: "./skills/",
      repoDir: "skills",
      repoFile: "SKILL.md",
      suffix: "/",
    },
  } as const;

  for (const [field, spec] of Object.entries(specs)) {
    const arr = plugin[field as keyof typeof specs];
    if (arr === undefined) continue;
    if (!Array.isArray(arr)) {
      errors.push(`${field} must be an array`);
      continue;
    }
    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      if (typeof p !== "string") {
        errors.push(`${field}[${i}] must be a string`);
        continue;
      }
      if (!p.startsWith("./")) {
        errors.push(`${field}[${i}] must start with "./"`);
        continue;
      }
      if (!p.startsWith(spec.prefix)) {
        errors.push(`${field}[${i}] must start with "${spec.prefix}"`);
        continue;
      }
      if (!p.endsWith(spec.suffix)) {
        errors.push(`${field}[${i}] must end with "${spec.suffix}"`);
        continue;
      }
      // Validate the source file exists at repo root
      const basename = p.slice(
        spec.prefix.length,
        p.length - spec.suffix.length,
      );
      if (field === "skills") {
        const skillSpec = spec as { repoDir: string; repoFile: string };
        const skillDir = path.join(ROOT_FOLDER, skillSpec.repoDir, basename);
        const skillFile = path.join(skillDir, skillSpec.repoFile);
        if (!fs.existsSync(skillFile)) {
          errors.push(
            `${field}[${i}] source not found: ${skillSpec.repoDir}/${basename}/SKILL.md`,
          );
        }
      } else {
        const agentSpec = spec as { repoDir: string; repoSuffix: string };
        const srcFile = path.join(
          ROOT_FOLDER,
          agentSpec.repoDir,
          basename + agentSpec.repoSuffix,
        );
        if (!fs.existsSync(srcFile)) {
          errors.push(
            `${field}[${i}] source not found: ${agentSpec.repoDir}/${basename}${agentSpec.repoSuffix}`,
          );
        }
      }
    }
  }
  return errors;
}

function validatePlugin(folderName: string): string[] {
  const pluginDir = path.join(PLUGINS_DIR, folderName);
  const errors: string[] = [];

  // Rule 1: Must have .github/plugin/plugin.json
  const pluginJsonPath = path.join(pluginDir, ".github/plugin", "plugin.json");
  if (!fs.existsSync(pluginJsonPath)) {
    errors.push("missing required file: .github/plugin/plugin.json");
    return errors;
  }

  // Rule 2: Must have README.md
  const readmePath = path.join(pluginDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    errors.push("missing required file: README.md");
  }

  // Parse plugin.json
  let plugin: PluginSpec;
  try {
    const raw = fs.readFileSync(pluginJsonPath, "utf-8");
    plugin = JSON.parse(raw) as PluginSpec;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`failed to parse plugin.json: ${message}`);
    return errors;
  }

  // Rule 3 & 4: name, description, version
  const nameErrors = validateName(plugin.name, folderName);
  errors.push(...nameErrors);

  const descError = validateDescription(plugin.description);
  if (descError) errors.push(descError);

  const versionError = validateVersion(plugin.version);
  if (versionError) errors.push(versionError);

  // Rule 5: keywords (or tags for backward compat)
  const keywordsError = validateKeywords(plugin.keywords ?? plugin.tags);
  if (keywordsError) errors.push(keywordsError);

  // Rule 6: agents, commands, skills paths
  const specErrors = validateSpecPaths(plugin);
  errors.push(...specErrors);

  return errors;
}

// Main validation function
function validatePlugins(): boolean {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.log("No plugins directory found - validation skipped");
    return true;
  }

  const pluginDirs = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (pluginDirs.length === 0) {
    console.log("No plugin folders found - validation skipped");
    return true;
  }

  console.log(`Validating ${pluginDirs.length} plugin folder(s)...`);

  let hasErrors = false;

  for (const folder of pluginDirs) {
    const pluginPath = path.join(PLUGINS_DIR, folder);
    console.log(`\nValidating ${folder}...`);

    const errors = validatePlugin(folder);

    if (errors.length > 0) {
      console.error(`❌ Validation errors in ${folder}:`);
      for (const error of errors) console.error(`   - ${error}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${folder} is valid`);
    }
  }

  if (!hasErrors) {
    console.log(`\n✅ All ${pluginDirs.length} plugins are valid`);
  }

  return !hasErrors;
}

// Run validation
try {
  const isValid = validatePlugins();
  if (!isValid) {
    console.error("\n❌ Plugin validation failed");
    process.exit(1);
  }
  console.log("\n🎉 Plugin validation passed");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error during validation: ${message}`);
  if (error && typeof error === "object" && "stack" in error) {
    console.error((error as { stack?: string }).stack);
  }
  process.exit(1);
}
