#!/usr/bin/env node

/**
 * Generate README.md from YAML files
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
 * Generate HTML for a single category
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
      return { html: "", count: 0, errors: [] };
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

  // Sort alphabetically by name (case-insensitive)
  validEntries.sort((a, b) => {
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Generate HTML for each entry
  const htmlParts = validEntries.map((entry) =>
    generateEntryHtml({
      name: entry.name,
      repo: entry.repo,
      tagline: entry.tagline,
      description: entry.description,
    }),
  );

  const html = htmlParts.join("\n\n");

  return { html, count: validEntries.length, errors };
}

/**
 * Main function to generate the README
 */
async function main(): Promise<void> {
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

  // Replace each placeholder in template
  let content = template;
  for (const [placeholder, html] of Object.entries(results)) {
    content = replacePlaceholder(content, placeholder, html);
  }

  // Write final README
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

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Generation failed:", err.message);
    process.exit(1);
  });
