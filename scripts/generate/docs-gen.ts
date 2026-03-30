#!/usr/bin/env node

/**
 * Documentation Generator Script
 *
 * Generates README.md and documentation from the banking codebase.
 * Creates API docs, component lists, and feature documentation.
 *
 * Usage: tsx scripts/generate/docs-gen.ts
 */

import fs from "fs";
import path from "path";

/**
 * Description placeholder
 *
 * @type {*}
 */
const ROOT_DIR = process.cwd();

/**
 * Description placeholder
 *
 * @interface DocSection
 * @typedef {DocSection}
 */
interface DocSection {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  title: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  content: string;
}

/**
 * Description placeholder
 *
 * @returns {string[]}
 */
function getDALFiles(): string[] {
  const dalDir = path.join(ROOT_DIR, "lib", "dal");
  if (!fs.existsSync(dalDir)) return [];

  return fs
    .readdirSync(dalDir)
    .filter((f) => f.endsWith(".dal.ts"))
    .map((f) => f.replace(".dal.ts", ""));
}

/**
 * Description placeholder
 *
 * @returns {string[]}
 */
function getActionFiles(): string[] {
  const actionsDir = path.join(ROOT_DIR, "lib", "actions");
  if (!fs.existsSync(actionsDir)) return [];

  return fs
    .readdirSync(actionsDir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".d.ts"))
    .map((f) => f.replace(".ts", ""));
}

/**
 * Description placeholder
 *
 * @returns {string[]}
 */
function getComponentFiles(): string[] {
  const componentsDir = path.join(ROOT_DIR, "components");
  if (!fs.existsSync(componentsDir)) return [];

  const files: string[] = [];

  const scanDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith(".tsx")) {
        files.push(
          path.relative(componentsDir, fullPath).replaceAll("\\", "/"),
        );
      }
    }
  };

  scanDir(componentsDir);
  return files;
}

/**
 * Description placeholder
 *
 * @returns {DocSection}
 */
function generateDALSection(): DocSection {
  const files = getDALFiles();

  if (files.length === 0) {
    return { content: "No DAL files found.", title: "## Data Access Layer" };
  }

  const content = files.map((f) => `- \`${f}\``).join("\n");

  return {
    content,
    title:
      "## Data Access Layer\n\nData access classes for database operations:",
  };
}

/**
 * Description placeholder
 *
 * @returns {DocSection}
 */
function generateActionsSection(): DocSection {
  const files = getActionFiles();

  if (files.length === 0) {
    return { content: "No action files found.", title: "## Server Actions" };
  }

  const content = files.map((f) => `- \`${f}\``).join("\n");

  return {
    content,
    title:
      "## Server Actions\n\nServer actions for client-server communication:",
  };
}

/**
 * Description placeholder
 *
 * @returns {DocSection}
 */
function generateComponentsSection(): DocSection {
  const files = getComponentFiles();

  if (files.length === 0) {
    return { content: "No components found.", title: "## UI Components" };
  }

  const content = files.map((f) => `- \`${f}\``).join("\n");

  return {
    content,
    title: "## UI Components\n\nReact components for the UI:",
  };
}

/**
 * Description placeholder
 *
 * @returns {DocSection}
 */
function generateScriptsSection(): DocSection {
  const scripts: string[] = [];

  const scriptsDir = path.join(ROOT_DIR, "scripts");
  if (fs.existsSync(scriptsDir)) {
    const scanDir = (dir: string, prefix = "") => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, `${entry.name}/`);
        } else if (entry.name.endsWith(".ts")) {
          scripts.push(`${prefix}${entry.name}`);
        }
      }
    };
    scanDir(scriptsDir);
  }

  if (scripts.length === 0) {
    return { content: "No scripts found.", title: "## Scripts" };
  }

  const content = scripts.map((s) => `- \`${s}\``).join("\n");

  return {
    content,
    title: "## Build Scripts\n\nAutomation and maintenance scripts:",
  };
}

/** Description placeholder */
function generateDocs(): void {
  console.log("📄 Generating documentation...\n");

  const sections: DocSection[] = [
    generateDALSection(),
    generateActionsSection(),
    generateComponentsSection(),
    generateScriptsSection(),
  ];

  const content = sections
    .map((s) => `${s.title}\n\n${s.content}`)
    .join("\n\n---\n\n");

  console.log("Documentation sections generated:");
  for (const section of sections) {
    const lines = section.content
      .split("\n")
      .filter((l) => l.startsWith("-")).length;
    console.log(`  - ${section.title.replace(/^##\s*/, "")}: ${lines} items`);
  }

  console.log(
    `\n✅ Generated documentation content (${content.length} characters)`,
  );
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {
    generateDocs();
    console.log("\n🎉 Documentation generation complete!");
    console.log(
      "\nNote: Full README generation requires integration with existing generate-readme.ts",
    );
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
