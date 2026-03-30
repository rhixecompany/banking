#!/usr/bin/env node

/**
 * Server Action Pattern Validation Script
 *
 * Validates Server Actions in the banking system follow best practices.
 * Checks:
 * - Correct imports (auth, revalidatePath)
 * - Proper { ok, error } return shape
 * - Zod parameter validation
 * - No direct database access (must use DAL)
 *
 * Usage: tsx scripts/validate/actions.ts
 */

import fs from "fs";
import path from "path";

/**
 * Description placeholder
 *
 * @type {*}
 */
const ACTIONS_DIR = path.join(process.cwd(), "lib", "actions");

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
 * @param {string} dir
 * @returns {string[]}
 */
function getAllActionFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllActionFiles(fullPath));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateUseServer(content: string): void {
  if (!content.includes('"use server"') && !content.includes("'use server'")) {
    errors.push({
      file: "unknown",
      message: `File should have '"use server"' directive at the top`,
      severity: "error",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateAuthImport(content: string): void {
  if (!content.includes('from "@/lib/auth"')) {
    errors.push({
      file: "unknown",
      message: `Server Action should import auth from "@/lib/auth"`,
      severity: "warning",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateRevalidatePath(content: string): void {
  const hasMutation =
    content.includes("create") ||
    content.includes("update") ||
    content.includes("delete") ||
    content.includes("insert") ||
    content.includes("remove");

  if (hasMutation && !content.includes("revalidatePath")) {
    errors.push({
      file: "unknown",
      message: `Mutation action should call revalidatePath() after changes`,
      severity: "warning",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateReturnShape(content: string): void {
  const returnStatements = content.match(/return\s*\{[^}]*\}/g) || [];

  for (const ret of returnStatements) {
    const hasOk = ret.includes("ok:");

    if (hasOk) {
      const hasError =
        ret.includes("error?") ||
        ret.includes("error :") ||
        ret.includes("error=");

      if (!hasError) {
        errors.push({
          file: "unknown",
          message: `Server Action should return { ok: boolean, error?: string } for error handling`,
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
function validateZodValidation(content: string): void {
  if (!content.includes("z.")) {
    errors.push({
      file: "unknown",
      message: `Server Action should use Zod for input validation`,
      severity: "warning",
    });
  }

  const hasSchemaDefinition =
    content.includes("z.object(") || content.includes("z.string(");

  if (!hasSchemaDefinition && content.includes("await auth()")) {
    errors.push({
      file: "unknown",
      message: `Server Action should define input validation schema`,
      severity: "warning",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateNoDirectDb(content: string): void {
  const directDbPatterns = [
    {
      message: "Direct database import",
      pattern: /import.*\{[^}]*db[^}]*\}.*from.*database/,
    },
    { message: "Database import", pattern: /from\s+["']@\/database["']/ },
  ];

  for (const { message, pattern } of directDbPatterns) {
    if (pattern.test(content)) {
      const dalImport = /import.*\{[^}]*dal[^}]*\}.*from.*dal/;

      if (!dalImport.test(content)) {
        errors.push({
          file: "unknown",
          message: `Server Action should use DAL for database access, not ${message}`,
          severity: "error",
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
function validateRedirectUsage(content: string): void {
  if (content.includes("redirect(")) {
    if (
      !content.includes('from "next/navigation"') &&
      !content.includes("next/navigation")
    ) {
      errors.push({
        file: "unknown",
        message: `redirect() should be imported from "next/navigation"`,
        severity: "error",
      });
    }
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateErrorHandling(content: string): void {
  const hasTryCatch = content.includes("try {") && content.includes("} catch");

  if (!hasTryCatch) {
    errors.push({
      file: "unknown",
      message: `Server Action should have try-catch error handling`,
      severity: "warning",
    });
  }
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<boolean>}
 */
export async function validateActions(): Promise<boolean> {
  console.log("🔍 Validating Server Actions...\n");

  errors.length = 0;

  const allFiles = getAllActionFiles(ACTIONS_DIR);

  if (allFiles.length === 0) {
    console.log("  No action files found - validation skipped");
    console.log("✅ Server Action validation passed");
    return true;
  }

  console.log(`  Checking ${allFiles.length} action file(s)...\n`);

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);

    console.log(`  Validating ${relativePath}...`);

    validateUseServer(content);
    validateAuthImport(content);
    validateRevalidatePath(content);
    validateReturnShape(content);
    validateZodValidation(content);
    validateNoDirectDb(content);
    validateRedirectUsage(content);
    validateErrorHandling(content);
  }

  if (errors.length > 0) {
    console.log("\n❌ Server Action validation errors:\n");

    const errorGroups = new Map<string, ValidationError[]>();
    for (const error of errors) {
      const existing = errorGroups.get(error.file) || [];
      existing.push(error);
      errorGroups.set(error.file, existing);
    }

    for (const [file, fileErrors] of errorGroups) {
      console.log(`  ${file}:`);
      for (const error of fileErrors) {
        const icon = error.severity === "error" ? "❌" : "⚠️";
        console.log(`    ${icon} ${error.message}`);
      }
    }
  } else {
    console.log("\n✅ Server Actions are valid");
  }

  return errors.filter((e) => e.severity === "error").length === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = await validateActions();
  if (!isValid) {
    process.exit(1);
  }
}
