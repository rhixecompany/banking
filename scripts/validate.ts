#!/usr/bin/env node

/**
 * Validate YAML files against the schema
 * Usage: npx tsx scripts/validate.ts [file1.yaml] [file2.yaml] ...
 * If no files specified, validates all YAML files in data/
 */

import { formatValidationErrors, validateEntry } from "./utils/validation.js";
import { getAllYamlFiles, readYamlFile } from "./utils/yaml.js";

/**
 * Validate a single file
 */
async function validateFile(filePath: string): Promise<boolean> {
  const data = readYamlFile(filePath);

  if (!data) {
    console.error(`Error reading ${filePath}`);
    return false;
  }

  const result = validateEntry(data, filePath);

  if (result.valid) {
    console.log(`✓ ${filePath}`);
  } else {
    console.error(formatValidationErrors(result));
  }

  return result.valid;
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let files: string[];

  if (args.length > 0) {
    files = args;
  } else {
    files = getAllYamlFiles();
  }

  if (files.length === 0) {
    console.log("No YAML files to validate.");
    process.exit(0);
  }

  console.log(`Validating ${files.length} YAML file(s)...\n`);

  let allValid = true;
  let validatedCount = 0;

  for (const file of files) {
    if (await validateFile(file)) {
      validatedCount++;
    } else {
      allValid = false;
    }
  }

  console.log("");

  if (allValid) {
    console.log(`✓ All ${validatedCount} file(s) passed validation.`);
    process.exit(0);
  } else {
    console.error(`✗ Validation failed for ${validatedCount} file(s).`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});
