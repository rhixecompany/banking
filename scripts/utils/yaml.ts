/**
 * YAML utilities for reading and parsing YAML files
 */

/**
 * Safely perform a file operation with error handling
 */

import fs from "fs";
import { glob } from "glob";
import yaml from "js-yaml";
import path from "path";

import type { Entry } from "../types/index.js";

import { DATA_DIR } from "./constants.js";

/**
 * Safely perform a file operation with error handling
 * Based on patterns from Banking/eng/yaml-parser.ts
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
 * Read and parse a single YAML file
 */
export function readYamlFile(filePath: string): Entry | null {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      return yaml.load(content) as Entry;
    },
    filePath,
    null,
  );
}

/**
 * Read all YAML files from a directory
 */
export async function readYamlDir(dirPath: string): Promise<Entry[]> {
  const pattern = path.join(dirPath, "*.yaml").replaceAll("\\", "/");
  const files = await glob(pattern);

  const entries: Entry[] = [];

  for (const file of files) {
    const entry = readYamlFile(file);
    if (entry) {
      entries.push({
        ...entry,
        _fileName: path.basename(file, ".yaml"),
        _filePath: file,
      } as Entry);
    }
  }

  return entries;
}

/**
 * Convert a name to a filename-safe slug
 */
export function slugify(name: string): string {
  let slug = name.toLowerCase().replaceAll(/[^a-z0-9]+/gu, "-");
  while (slug.startsWith("-")) slug = slug.slice(1);
  while (slug.endsWith("-")) slug = slug.slice(0, -1);
  return slug;
}

/**
 * Parse a YAML file with full type safety
 */
export function parseYamlFile<T>(filePath: string): null | T {
  return safeFileOperation(
    () => {
      const content = fs.readFileSync(filePath, "utf8");
      return yaml.load(content) as T;
    },
    filePath,
    null,
  );
}

/**
 * Get all YAML files in the data directory
 */
export function getAllYamlFiles(): string[] {
  const pattern = path.join(DATA_DIR, "**/*.yaml").replaceAll("\\", "/");
  return glob.sync(pattern);
}
