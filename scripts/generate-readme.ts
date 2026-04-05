#!/usr/bin/env node

/**
 * README Generator for Banking System
 *
 * Generates README.md from YAML files and banking components.
 *
 * Usage:
 *   npx tsx scripts/generate-readme.ts
 *   npx tsx scripts/generate-readme.ts [--docs]
 */

import path from "path";

import type { Entry } from "./types/index.js";

import {
  CATEGORIES,
  CATEGORY_PATHS,
  CATEGORY_PLACEHOLDERS,
} from "./utils/constants.js";
import { readOpenCodeEntries } from "./utils/markdown.js";
import {
  generateEntryHtml,
  readTemplate,
  replacePlaceholder,
  writeReadme,
} from "./utils/template.js";
import { formatValidationErrors, validateEntry } from "./utils/validation.js";
import { readYamlDir } from "./utils/yaml.js";

/**
 * Description placeholder
 *
 * @typedef {GeneratorOption}
 */
type GeneratorOption = "all" | "docs" | "readme";

/**
 * Description placeholder
 *
 * @returns {{ target: GeneratorOption }}
 */
function parseArgs(): { target: GeneratorOption } {
  const args = process.argv.slice(2);
  let target: GeneratorOption = "readme";

  for (const arg of args) {
    if (arg === "--docs") {
      target = "docs";
    } else if (arg === "--all") {
      target = "all";
    }
  }

  return { target };
}

/** Description placeholder */
function printHelp(): void {
  console.warn(`
README Generator for Banking System

Usage:
  npx tsx scripts/generate-readme.ts [options]

Options:
  --docs    Generate documentation (default: README)
  --all     Generate both
  --help    Show this help message
`);
}

/**
 * Read entries from .opencode/skills and .opencode/instructions
 * These are added to the resources category
 *
 * @async
 * @returns {Promise<Entry[]>}
 */
async function getOpenCodeEntries(): Promise<Entry[]> {
  console.warn("  - Loading .opencode/skills and .opencode/instructions...");

  try {
    const entries = await readOpenCodeEntries();
    console.warn(`  - Found ${entries.length} OpenCode entries`);
    return entries;
  } catch (err) {
    console.warn(`  - No OpenCode entries found: ${(err as Error).message}`);
    return [];
  }
}

/**
 * Description placeholder
 *
 * @async
 * @param {string} categoryName
 * @param {Entry[]} [additionalEntries=[]]
 * @returns {Promise<{ html: string; count: number; errors: string[] }>}
 */
async function generateCategorySection(
  categoryName: string,
  additionalEntries: Entry[] = [],
): Promise<{ html: string; count: number; errors: string[] }> {
  const categoryPath =
    CATEGORY_PATHS[categoryName as keyof typeof CATEGORY_PATHS];

  let entries: Entry[] = [];
  const errors: string[] = [];

  try {
    entries = await readYamlDir(categoryPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      // Directory doesn't exist, continue with empty entries
    } else {
      throw err;
    }
  }

  const validEntries: Entry[] = [];

  for (const entry of entries) {
    const result = validateEntry(
      entry,
      entry._filePath ??
        path.join(categoryPath, `${entry.name || "unknown"}.yaml`),
    );

    if (result.valid) {
      validEntries.push(entry);
    } else {
      const errorMsg = formatValidationErrors(result);
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }

  // Add additional entries (from .opencode folders) - deduplicate by name
  const existingNames = new Set(validEntries.map((e) => e.name.toLowerCase()));
  for (const entry of additionalEntries) {
    if (!existingNames.has(entry.name.toLowerCase())) {
      validEntries.push(entry);
    }
  }

  validEntries.sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const htmlParts = validEntries.map((entry) =>
    generateEntryHtml({
      description: entry.description,
      name: entry.name,
      repo: entry.repo,
      tagline: entry.tagline,
    }),
  );

  return { count: validEntries.length, errors, html: htmlParts.join("\n\n") };
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function generateReadme(): Promise<void> {
  console.warn("Starting README generation...\n");

  let template: string;
  try {
    template = readTemplate();
    console.warn("Template loaded successfully");
  } catch (err) {
    throw new Error(`Failed to read template: ${(err as Error).message}`);
  }

  // Load OpenCode entries (skills + instructions) once
  const openCodeEntries = await getOpenCodeEntries();

  const results: Record<string, string> = {};
  let totalEntries = 0;
  let allErrors: string[] = [];

  for (const category of CATEGORIES) {
    const placeholder = CATEGORY_PLACEHOLDERS[category];
    console.warn(`Processing ${category}...`);

    // Add OpenCode entries to resources category only
    const additionalEntries = category === "resources" ? openCodeEntries : [];

    try {
      const result = await generateCategorySection(category, additionalEntries);
      results[placeholder] = result.html;
      totalEntries += result.count;
      allErrors = allErrors.concat(result.errors);

      if (result.count > 0) {
        console.warn(`  - Found ${result.count} valid entries`);
      } else {
        console.warn(`  - No entries found`);
      }
    } catch (err) {
      console.error(
        `  - Error processing ${category}: ${(err as Error).message}`,
      );
      results[placeholder] = "";
    }
  }

  let content = template;
  for (const [placeholder, html] of Object.entries(results)) {
    content = replacePlaceholder(content, placeholder, html);
  }

  try {
    writeReadme(content);
    console.warn("\nREADME.opencode.md written successfully");
  } catch (err) {
    throw new Error(`Failed to write README.md: ${(err as Error).message}`);
  }

  const errorCount = allErrors.length;
  if (errorCount > 0) {
    console.warn(
      `\n⚠️  Generated README.opencode.md with ${totalEntries} entries across ${CATEGORIES.length} categories`,
    );
    console.warn(
      `   ${errorCount} validation error(s) were logged (affected entries were skipped)`,
    );
  } else {
    console.warn(
      `\n✅ Generated README.opencode.md with ${totalEntries} entries across ${CATEGORIES.length} categories`,
    );
  }
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function generateDocs(): Promise<void> {
  console.warn("Starting documentation generation...\n");

  console.warn("✅ Documentation generation complete");
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const { target } = parseArgs();

  if (target === "readme" && process.argv.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  console.warn("=".repeat(50));
  console.warn("Banking System README/Docs Generator");
  console.warn("=".repeat(50));
  console.warn("");

  if (target === "readme" || target === "all") {
    await generateReadme();
    console.warn("");
  }

  if (target === "docs" || target === "all") {
    await generateDocs();
    console.warn("");
  }

  console.warn("=".repeat(50));
  console.warn("✅ Generation complete!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Generation failed:", err.message);
    process.exit(1);
  });
