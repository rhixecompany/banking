#!/usr/bin/env node

/**
 * Export registry data as a flat JSON list.
 * Usage:
 *   npx tsx scripts/export-json.ts --pretty --output dist/registry.json
 *   npx tsx scripts/export-json.ts --pretty > dist/registry.json
 */

import fs from "fs";
import path from "path";
import type { CategoryType, Entry, ExportedEntry } from "./types/index.js";
import { CATEGORIES, CATEGORY_PATHS } from "./utils/constants.js";
import { formatValidationErrors, validateEntry } from "./utils/validation.js";
import { readYamlDir, slugify } from "./utils/yaml.js";

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): { outputPath?: string; pretty: boolean } {
  const outputFlagIndex = args.findIndex((arg) => arg === "--output");
  const outputPath =
    outputFlagIndex !== -1 && args[outputFlagIndex + 1]
      ? args[outputFlagIndex + 1]
      : undefined;
  const pretty = args.includes("--pretty");
  return { outputPath, pretty };
}

/**
 * Build product ID from entry
 */
function buildProductId(entry: Entry): string {
  if (entry._fileName) {
    return entry._fileName;
  }
  if (entry.name) {
    return slugify(entry.name);
  }
  return "";
}

/**
 * Sanitize array with fallback
 */
function sanitizeArray<T>(value: T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

/**
 * Map entry to exported format
 */
function mapEntry(entry: Entry, category: CategoryType): ExportedEntry | null {
  const productId = buildProductId(entry);
  if (!productId) {
    return null;
  }

  return {
    productId,
    type: category,
    displayName: entry.name || "",
    repoUrl: entry.repo || "",
    tagline: entry.tagline || "",
    description: entry.description || "",
    scope: sanitizeArray(entry.scope, ["global"]),
    tags: sanitizeArray(entry.tags, []),
    homepageUrl: entry.homepage,
    installation: entry.installation,
    minVersion: entry.min_version,
  };
}

/**
 * Remove undefined values from object
 */
function stripUndefined(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Load all entries from all categories
 */
async function loadEntries(): Promise<{
  results: ExportedEntry[];
  errors: string[];
}> {
  const results: ExportedEntry[] = [];
  const errors: string[] = [];

  for (const category of CATEGORIES) {
    const categoryPath = CATEGORY_PATHS[category];
    let entries: Entry[] = [];

    try {
      entries = await readYamlDir(categoryPath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        continue;
      }
      throw err;
    }

    for (const entry of entries) {
      const result = validateEntry(entry, entry._filePath || categoryPath);
      if (!result.valid) {
        errors.push(formatValidationErrors(result));
        continue;
      }

      const mapped = mapEntry(entry, category);
      if (mapped) {
        results.push(mapped);
      }
    }
  }

  return { results, errors };
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const { outputPath, pretty } = parseArgs(process.argv.slice(2));
  const writeToStdout = !outputPath;

  const { results, errors } = await loadEntries();

  // Sort by type then productId
  results.sort((a, b) => {
    const typeCompare = a.type.localeCompare(b.type);
    if (typeCompare !== 0) {
      return typeCompare;
    }
    return a.productId.localeCompare(b.productId);
  });

  if (errors.length > 0) {
    for (const error of errors) {
      if (writeToStdout) {
        console.error(error);
      }
    }
    const suffix = errors.length === 1 ? "y" : "ies";
    console.log(`\n⚠️  Skipped ${errors.length} invalid entr${suffix}.`);
  }

  const json = JSON.stringify(results, null, pretty ? 2 : 0);

  if (outputPath) {
    const outputDir = path.dirname(outputPath);
    if (outputDir && outputDir !== ".") {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, json);
    console.log(`Saved ${results.length} entries to ${outputPath}`);
  } else {
    process.stdout.write(json);
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
