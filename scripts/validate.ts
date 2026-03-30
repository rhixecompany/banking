#!/usr/bin/env node

/**
 * Validation Script for Banking System
 *
 * Validates:
 * - YAML files against schema (default)
 * - Database schemas
 * - Environment variables
 * - Type safety
 * - Server Action patterns
 *
 * Usage:
 *   npx tsx scripts/validate.ts [options]
 *   npx tsx scripts/validate.ts --schema
 *   npx tsx scripts/validate.ts --env
 *   npx tsx scripts/validate.ts --types
 *   npx tsx scripts/validate.ts --actions
 *   npx tsx scripts/validate.ts --all
 */

import { formatValidationErrors, validateEntry } from "./utils/validation.js";
import { getAllYamlFiles, readYamlFile } from "./utils/yaml.js";
import { validateActions } from "./validate/actions.js";
import { validateEnv } from "./validate/env.js";
import { validateSchema } from "./validate/schema.js";
import { validateTypes } from "./validate/types.js";

/**
 * Description placeholder
 *
 * @typedef {ValidationTarget}
 */
type ValidationTarget = "actions" | "all" | "env" | "schema" | "types" | "yaml";

/**
 * Description placeholder
 *
 * @returns {{ targets: ValidationTarget[]; help: boolean }}
 */
function parseArgs(): { targets: ValidationTarget[]; help: boolean } {
  const args = process.argv.slice(2);
  const targets: ValidationTarget[] = [];
  let help = false;

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--schema") {
      targets.push("schema");
    } else if (arg === "--env") {
      targets.push("env");
    } else if (arg === "--types") {
      targets.push("types");
    } else if (arg === "--actions") {
      targets.push("actions");
    } else if (arg === "--all") {
      targets.push("all");
    } else if (!arg.startsWith("--")) {
      targets.push("yaml");
    }
  }

  if (targets.length === 0) {
    targets.push("yaml");
  }

  return { help, targets };
}

/** Description placeholder */
function printHelp(): void {
  console.log(`
Banking Validation Script

Usage:
  npx tsx scripts/validate.ts [options]

Options:
  --yaml     Validate YAML files (default)
  --schema   Validate database schemas
  --env      Validate environment variables
  --types    Validate TypeScript type safety
  --actions  Validate Server Action patterns
  --all      Run all validations
  --help     Show this help message

Examples:
  npx tsx scripts/validate.ts              # Validate YAML files
  npx tsx scripts/validate.ts --schema    # Validate DB schema
  npx tsx scripts/validate.ts --all       # Run all validations
`);
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<boolean>}
 */
async function validateYaml(): Promise<boolean> {
  console.log("🔍 Validating YAML files...\n");

  const files = getAllYamlFiles();

  if (files.length === 0) {
    console.log("No YAML files to validate.");
    return true;
  }

  console.log(`Validating ${files.length} YAML file(s)...\n`);

  let allValid = true;
  let validatedCount = 0;

  for (const file of files) {
    const data = readYamlFile(file);

    if (!data) {
      console.error(`Error reading ${file}`);
      allValid = false;
      continue;
    }

    const result = validateEntry(data, file);

    if (result.valid) {
      console.log(`✓ ${file}`);
      validatedCount++;
    } else {
      console.error(formatValidationErrors(result));
      allValid = false;
    }
  }

  console.log("");

  if (allValid) {
    console.log(`✓ All ${validatedCount} YAML file(s) passed validation.`);
  } else {
    console.error(`✗ Validation failed for YAML files.`);
  }

  return allValid;
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const { help, targets } = parseArgs();

  if (help) {
    printHelp();
    process.exit(0);
  }

  console.log("=".repeat(50));
  console.log("Banking System Validation");
  console.log("=".repeat(50));
  console.log("");

  let allPassed = true;

  for (const target of targets) {
    if (target === "all" || target === "yaml") {
      const yamlResult = await validateYaml();
      allPassed = allPassed && yamlResult;
      console.log("");
    }

    if (target === "all" || target === "schema") {
      const schemaResult = await validateSchema();
      allPassed = allPassed && schemaResult;
      console.log("");
    }

    if (target === "all" || target === "env") {
      const envResult = await validateEnv();
      allPassed = allPassed && envResult;
      console.log("");
    }

    if (target === "all" || target === "types") {
      const typesResult = await validateTypes();
      allPassed = allPassed && typesResult;
      console.log("");
    }

    if (target === "all" || target === "actions") {
      const actionsResult = await validateActions();
      allPassed = allPassed && actionsResult;
      console.log("");
    }
  }

  console.log("=".repeat(50));

  if (allPassed) {
    console.log("✅ All validations passed!");
    process.exit(0);
  } else {
    console.log("❌ Some validations failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});
