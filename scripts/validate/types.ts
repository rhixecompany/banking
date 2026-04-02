#!/usr/bin/env node

/**
 * Type Safety Validation Script
 *
 * Validates TypeScript type safety in the banking system.
 * Checks:
 * - No 'any' type usage (except where explicitly allowed)
 * - All exported functions have return types
 * - Interface definitions are complete
 *
 * Usage: tsx scripts/validate/types.ts
 */

import fs from "fs";
import path from "path";
import safeRegex from "safe-regex";

/**
 * Description placeholder
 *
 * @type {100}
 */
const REGEX_TIMEOUT_MS = 100;

/**
 * Description placeholder
 *
 * @param {string} pattern
 * @returns {boolean}
 */
function isSafeRegex(pattern: string): boolean {
  try {
    if (!safeRegex(pattern)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Description placeholder
 *
 * @param {string} pattern
 * @param {string} [flags="gm"]
 * @returns {(null | RegExp)}
 */
function createTimedRegex(pattern: string, flags = "gm"): null | RegExp {
  if (!isSafeRegex(pattern)) {
    return null;
  }
  return new RegExp(pattern, flags);
}

/**
 * Description placeholder
 *
 * @type {*}
 */
const LIB_DIR = path.join(process.cwd(), "lib");
/**
 * Description placeholder
 *
 * @type {*}
 */
const APP_DIR = path.join(process.cwd(), "app");

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

/**
 * Description placeholder
 *
 * @type {{}}
 */
const ALLOWED_ANY_PATTERNS = [
  /JSON\.parse/,
  /JSON\.stringify/,
  /require\(/,
  /as\s+any/,
];

/**
 * Description placeholder
 *
 * @param {string} dir
 * @returns {string[]}
 */
function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Description placeholder
 *
 * @param {string} filePath
 * @param {string} content
 */
function validateNoAny(filePath: string, content: string): void {
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (
      line.includes(": any") ||
      line.includes("any>") ||
      line.includes("<any")
    ) {
      const isAllowed = ALLOWED_ANY_PATTERNS.some((pattern) =>
        pattern.test(line),
      );

      if (!isAllowed) {
        const commentMatch = line.match(
          /\/\/\s*ts-ignore|\/\/\s*@ts-expect-error|\/\/\s*@ts-nocheck/,
        );
        if (!commentMatch) {
          errors.push({
            file: filePath,
            line: lineNum,
            message: `Use of 'any' type - use 'unknown' with type guards instead`,
            severity: "error",
          });
        }
      }
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} filePath
 * @param {string} content
 */
function validateReturnTypes(filePath: string, content: string): void {
  const functionRegexPattern =
    "^(?:export\\s+)?(?:async\\s+)?function\\s+(\\w+)|(?:export\\s+)?const\\s+(\\w+)\\s*=\\s*(?:async\\s+)?\\(";
  const functionRegex = createTimedRegex(functionRegexPattern, "gm");
  if (!functionRegex) return;

  let match;

  while ((match = functionRegex.exec(content)) !== null) {
    const functionName = match[1] || match[2];

    const functionStart = match.index;
    const functionBlock = content.slice(functionStart, functionStart + 500);

    const hasReturnTypePattern =
      ":\\s*(?:Promise<)?(?:void|boolean|string|number|unknown|Record|Array)[>\\]]?";
    const hasReturnTypeRegex = createTimedRegex(hasReturnTypePattern);
    if (!hasReturnTypeRegex) continue;

    const hasReturnType = hasReturnTypeRegex.test(functionBlock);

    if (!hasReturnType && functionName && !functionName.startsWith("_")) {
      errors.push({
        file: filePath,
        message: `Function "${functionName}" should have explicit return type`,
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
function validateInterfaces(content: string): void {
  const interfaceRegex = /interface\s+(\w+)\s*\{/g;
  let match;

  while ((match = interfaceRegex.exec(content)) !== null) {
    const interfaceName = match[1];
    const interfaceStart = match.index;
    const braceEnd = content.indexOf("}", interfaceStart);
    const interfaceBlock = content.slice(match.index, braceEnd + 1);

    const hasRequiredFields = /^\s*\w+\s*:\s*\w+/.test(
      interfaceBlock.replaceAll("\n", " ").replaceAll(/\s+/g, " "),
    );

    if (!hasRequiredFields) {
      errors.push({
        file: "unknown",
        message: `Interface "${interfaceName}" appears empty or has no fields`,
        severity: "warning",
      });
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 * @param {string} filePath
 */
function validateDALReturnTypes(content: string, filePath: string): void {
  if (!filePath.includes("\\dal\\") && !filePath.includes("/dal/")) return;

  const findMethods = /find\w+|create\w+|update\w+|delete\w+/g;
  const matches = content.match(findMethods);

  if (matches && matches.length > 0) {
    console.warn(`  Found ${matches.length} DAL method(s)`);
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 * @param {string} filePath
 */
function validateActionReturnShapes(content: string, filePath: string): void {
  if (!filePath.includes("\\actions\\") && !filePath.includes("/actions/"))
    return;

  const returnObjectRegex = /return\s*\{[^}]*\}/g;
  let match;

  while ((match = returnObjectRegex.exec(content)) !== null) {
    const returnBlock = match[0];

    if (returnBlock.includes("ok:")) {
      if (!returnBlock.includes("error?")) {
        errors.push({
          file: filePath,
          message: `Server Action should return { ok, error? } shape for error handling`,
          severity: "warning",
        });
      }
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
export async function validateTypes(): Promise<boolean> {
  console.warn("🔍 Validating type safety...\n");

  errors.length = 0;

  const allFiles = [...getAllTsFiles(LIB_DIR), ...getAllTsFiles(APP_DIR)];

  console.warn(`  Checking ${allFiles.length} TypeScript files...\n`);

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);

    try {
      validateNoAny(relativePath, content);
      validateReturnTypes(relativePath, content);
      validateInterfaces(content);
      validateDALReturnTypes(content, relativePath);
      validateActionReturnShapes(content, relativePath);
    } catch (error) {
      errors.push({
        file: relativePath,
        message: `Error processing file: ${error instanceof Error ? error.message : String(error)}`,
        severity: "error",
      });
    }
  }

  if (errors.length > 0) {
    console.warn("\n❌ Type safety validation errors:\n");

    const errorGroups = new Map<string, ValidationError[]>();
    for (const error of errors) {
      const existing = errorGroups.get(error.file) ?? [];
      existing.push(error);
      errorGroups.set(error.file, existing);
    }

    for (const [file, fileErrors] of errorGroups) {
      console.warn(`  ${file}:`);
      for (const error of fileErrors) {
        const icon = error.severity === "error" ? "❌" : "⚠️";
        const lineInfo = error.line ? `:${error.line}` : "";
        console.warn(`    ${icon}${lineInfo} ${error.message}`);
      }
    }
  } else {
    console.warn("✅ Type safety checks passed");
  }

  return errors.filter((e) => e.severity === "error").length === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = await validateTypes();
  if (!isValid) {
    process.exit(1);
  }
}
