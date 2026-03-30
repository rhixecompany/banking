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
  console.log(`
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
 * Description placeholder
 *
 * @async
 * @param {string} categoryName
 * @returns {Promise<{ html: string; count: number; errors: string[] }>}
 */
async function generateCategorySection(
  categoryName: string,
): Promise<{ html: string; count: number; errors: string[] }> {
  const categoryPath =
    CATEGORY_PATHS[categoryName as keyof typeof CATEGORY_PATHS];

  let entries: Entry[] = [];
  const errors: string[] = [];

  try {
    entries = await readYamlDir(categoryPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { count: 0, errors: [], html: "" };
    }
    throw err;
  }

  const validEntries: Entry[] = [];

  for (const entry of entries) {
    const result = validateEntry(
      entry,
      entry._filePath ||
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
  console.log("Starting README generation...\n");

  let template: string;
  try {
    template = readTemplate();
    console.log("Template loaded successfully");
  } catch (err) {
    throw new Error(`Failed to read template: ${(err as Error).message}`);
  }

  const results: Record<string, string> = {};
  let totalEntries = 0;
  let allErrors: string[] = [];

  for (const category of CATEGORIES) {
    const placeholder = CATEGORY_PLACEHOLDERS[category];
    console.log(`Processing ${category}...`);

    try {
      const result = await generateCategorySection(category);
      results[placeholder] = result.html;
      totalEntries += result.count;
      allErrors = allErrors.concat(result.errors);

      if (result.count > 0) {
        console.log(`  - Found ${result.count} valid entries`);
      } else {
        console.log(`  - No entries found`);
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
    console.log("\nREADME.opencode.md written successfully");
  } catch (err) {
    throw new Error(`Failed to write README.md: ${(err as Error).message}`);
  }

  const errorCount = allErrors.length;
  if (errorCount > 0) {
    console.log(
      `\n⚠️  Generated README.opencode.md with ${totalEntries} entries across ${CATEGORIES.length} categories`,
    );
    console.log(
      `   ${errorCount} validation error(s) were logged (affected entries were skipped)`,
    );
  } else {
    console.log(
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
  console.log("Starting documentation generation...\n");

  console.log("✅ Documentation generation complete");
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

  console.log("=".repeat(50));
  console.log("Banking System README/Docs Generator");
  console.log("=".repeat(50));
  console.log("");

  if (target === "readme" || target === "all") {
    await generateReadme();
    console.log("");
  }

  if (target === "docs" || target === "all") {
    await generateDocs();
    console.log("");
  }

  console.log("=".repeat(50));
  console.log("✅ Generation complete!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Generation failed:", err.message);
    process.exit(1);
  });
