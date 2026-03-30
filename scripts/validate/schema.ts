#!/usr/bin/env node

/**
 * Database Schema Validation Script
 *
 * Validates Drizzle ORM schema definitions in the banking system.
 * Checks:
 * - Table naming conventions
 * - Foreign key relationships
 * - Index definitions
 * - Column type consistency
 *
 * Usage: tsx scripts/validate/schema.ts
 */

import fs from "fs";
import path from "path";

/**
 * Description placeholder
 *
 * @type {*}
 */
const DB_SCHEMA_PATH = path.join(process.cwd(), "database", "schema.ts");

/**
 * Description placeholder
 *
 * @interface ValidationError
 * @typedef {ValidationError}
 */
interface ValidationError {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  file: string;
  /**
   * Description placeholder
   *
   * @type {?number}
   */
  line?: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  message: string;
  /**
   * Description placeholder
   *
   * @type {("error" | "warning")}
   */
  severity: "error" | "warning";
}

/**
 * Description placeholder
 *
 * @type {ValidationError[]}
 */
const errors: ValidationError[] = [];

/** Description placeholder */
function validateFileExists(): void {
  if (!fs.existsSync(DB_SCHEMA_PATH)) {
    errors.push({
      file: DB_SCHEMA_PATH,
      message: "Database schema file not found at database/schema.ts",
      severity: "error",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateTableNaming(content: string): void {
  const tableNameRegex =
    /export\s+const\s+(\w+)\s*=\s*(?:pgTable|mysqlTable|sqliteTable)\(/g;
  let match;

  while ((match = tableNameRegex.exec(content)) !== null) {
    const tableName = match[1];

    if (!/^[a-z][a-z0-9_]*$/.test(tableName)) {
      errors.push({
        file: DB_SCHEMA_PATH,
        message: `Table "${tableName}" should use snake_case naming (e.g., user_accounts, not ${tableName})`,
        severity: "warning",
      });
    }

    if (tableName.toLowerCase().includes("table")) {
      errors.push({
        file: DB_SCHEMA_PATH,
        message: `Table "${tableName}" should not include "table" suffix`,
        severity: "warning",
      });
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateRelations(content: string): void {
  const relationRegex = /relations:\s*(\w+)\s*=\s*\(\)\s*=>\s*related\(/g;
  const foreignKeyRegex = /references?:\s*\[\(\)\s*=>\s*(\w+)\.(\w+)\]/g;

  let match;
  const relations = new Set<string>();

  while ((match = relationRegex.exec(content)) !== null) {
    relations.add(match[1]);
  }

  while ((match = foreignKeyRegex.exec(content)) !== null) {
    const [, table, column] = match;
    if (!relations.has(table)) {
      errors.push({
        file: DB_SCHEMA_PATH,
        message: `Foreign key references table "${table}" but no relation defined`,
        severity: "warning",
      });
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateIndexes(content: string): void {
  const indexRegex = /indexes?:\s*\{/g;
  const uniqueIndexRegex = /uniqueIndex/g;

  let hasIndexes = false;
  let match;

  while ((match = indexRegex.exec(content)) !== null) {
    hasIndexes = true;
  }

  if (!hasIndexes && content.includes("pgTable")) {
    errors.push({
      file: DB_SCHEMA_PATH,
      message: "Consider adding indexes for frequently queried columns",
      severity: "warning",
    });
  }

  if (uniqueIndexRegex.test(content)) {
    const uniqueIndexMatches = content.match(/uniqueIndex\("[^"]+"/g) || [];
    if (uniqueIndexMatches.length > 0) {
      console.log(`  Found ${uniqueIndexMatches.length} unique index(es)`);
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateTimestamps(content: string): void {
  const timestampColumns = [
    "createdAt",
    "updatedAt",
    "deletedAt",
    "modifiedAt",
  ];

  for (const col of timestampColumns) {
    const timestampRegex = new RegExp(
      `${col}:\\s*(?:timestamp|datetime)\\(\\)`,
      "g",
    );
    if (timestampRegex.test(content)) {
      const defaultValueRegex = new RegExp(
        `${col}:\\s*timestamp\\(\\)\\s*\\.\\s*default\\(`,
        "g",
      );
      if (!defaultValueRegex.test(content)) {
        errors.push({
          file: DB_SCHEMA_PATH,
          message: `Column "${col}" should have a default value`,
          severity: "warning",
        });
      }
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validatePrimaryKeys(content: string): void {
  const tableRegex =
    /export\s+const\s+(\w+)\s*=\s*(?:pgTable|mysqlTable|sqliteTable)\([^)]*\)\s*;/g;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[1];
    const tableBlock = match[0];

    if (!tableBlock.includes("id:") && !tableBlock.includes("uuid(")) {
      errors.push({
        file: DB_SCHEMA_PATH,
        message: `Table "${tableName}" should have an "id" primary key column`,
        severity: "warning",
      });
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateColumnTypes(content: string): void {
  const pgTableTypes = [
    "serial",
    "uuid",
    "varchar",
    "text",
    "integer",
    "bigint",
    "decimal",
    "boolean",
    "timestamp",
    "jsonb",
  ];

  for (const type of pgTableTypes) {
    const typeRegex = new RegExp(`:\\s*${type}\\(`, "g");
    const matches = content.match(typeRegex);
    if (matches) {
      console.log(`  Found ${matches.length} ${type} column(s)`);
    }
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<boolean>}
 */
export async function validateSchema(): Promise<boolean> {
  console.log("🔍 Validating database schema...\n");

  errors.length = 0;

  validateFileExists();

  if (!fs.existsSync(DB_SCHEMA_PATH)) {
    console.log("❌ Schema validation failed - schema file not found");
    return false;
  }

  const content = fs.readFileSync(DB_SCHEMA_PATH, "utf8");

  validateTableNaming(content);
  validateRelations(content);
  validateIndexes(content);
  validateTimestamps(content);
  validatePrimaryKeys(content);
  validateColumnTypes(content);

  if (errors.length > 0) {
    console.log("\n❌ Schema validation errors:\n");
    for (const error of errors) {
      const icon = error.severity === "error" ? "❌" : "⚠️";
      console.log(`  ${icon} ${error.message}`);
    }
  } else {
    console.log("\n✅ Database schema is valid");
  }

  return errors.filter((e) => e.severity === "error").length === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = await validateSchema();
  if (!isValid) {
    process.exit(1);
  }
}
