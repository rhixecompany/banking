#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 *
 * Validates environment variables defined in lib/env.ts
 * Checks:
 * - All required variables are defined
 * - Zod schemas are properly defined
 * - Default values are valid
 *
 * Usage: tsx scripts/validate/env.ts
 */

import fs from "fs";
import path from "path";

/**
 * Description placeholder
 *
 * @type {*}
 */
const ENV_SCHEMA_PATH = path.join(process.cwd(), "lib", "env.ts");
/**
 * Description placeholder
 *
 * @type {*}
 */
const ENV_LOCAL_PATH = path.join(process.cwd(), ".env.local");

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
  if (!fs.existsSync(ENV_SCHEMA_PATH)) {
    errors.push({
      file: ENV_SCHEMA_PATH,
      message: "Environment schema file not found at lib/env.ts",
      severity: "error",
    });
  }
}

/**
 * Description placeholder
 *
 * @param {string} content
 */
function validateEnvSchema(content: string): void {
  const requiredPatterns = [
    { message: "DATABASE_URL is required", pattern: /DATABASE_URL/ },
    { message: "NEXTAUTH_SECRET is required", pattern: /NEXTAUTH_SECRET/ },
    { message: "NEXTAUTH_URL is required", pattern: /NEXTAUTH_URL/ },
  ];

  for (const { message, pattern } of requiredPatterns) {
    if (!pattern.test(content)) {
      errors.push({
        file: ENV_SCHEMA_PATH,
        message,
        severity: "error",
      });
    }
  }

  const bankingPatterns = [
    {
      message: "PLAID_CLIENT_ID for Plaid integration",
      pattern: /PLAID_CLIENT_ID/,
    },
    { message: "PLAID_SECRET for Plaid integration", pattern: /PLAID_SECRET/ },
    { message: "DWOLLA_KEY for Dwolla integration", pattern: /DWOLLA_KEY/ },
    {
      message: "DWOLLA_SECRET for Dwolla integration",
      pattern: /DWOLLA_SECRET/,
    },
    {
      message: "ENCRYPTION_KEY for data encryption",
      pattern: /ENCRYPTION_KEY/,
    },
  ];

  for (const { message, pattern } of bankingPatterns) {
    if (!pattern.test(content)) {
      errors.push({
        file: ENV_SCHEMA_PATH,
        message: `Consider adding ${message}`,
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
function validateZodSchemas(content: string): void {
  if (!content.includes("z.")) {
    errors.push({
      file: ENV_SCHEMA_PATH,
      message: "No Zod schemas found - should use z.object() for validation",
      severity: "error",
    });
  }

  if (!content.includes("z.string()")) {
    errors.push({
      file: ENV_SCHEMA_PATH,
      message:
        "No string validations found - consider adding string validations",
      severity: "warning",
    });
  }

  if (!content.includes(".default(")) {
    errors.push({
      file: ENV_SCHEMA_PATH,
      message:
        "No default values found - consider adding defaults for optional vars",
      severity: "warning",
    });
  }

  if (!content.includes(".optional()")) {
    errors.push({
      file: ENV_SCHEMA_PATH,
      message:
        "No optional values found - consider which vars are truly required",
      severity: "warning",
    });
  }
}

/** Description placeholder */
function validateEnvLocalExists(): void {
  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    errors.push({
      file: ".env.local",
      message: ".env.local file not found - create from .env.example",
      severity: "warning",
    });
  }
}

/** Description placeholder */
function validateEnvLocalContent(): void {
  if (!fs.existsSync(ENV_LOCAL_PATH)) return;

  const content = fs.readFileSync(ENV_LOCAL_PATH, "utf8");
  const lines = content.split("\n");

  let hasDatabaseUrl = false;
  let hasNextauthSecret = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed) continue;

    if (trimmed.startsWith("DATABASE_URL=")) {
      hasDatabaseUrl = true;
      const value = trimmed.split("=")[1];
      if (!value || value.includes("your_") || value.length < 10) {
        errors.push({
          file: ENV_LOCAL_PATH,
          message: "DATABASE_URL appears to be a placeholder",
          severity: "error",
        });
      }
    }

    if (trimmed.startsWith("NEXTAUTH_SECRET=")) {
      hasNextauthSecret = true;
      const value = trimmed.split("=")[1];
      if (!value || value.includes("your_") || value.length < 20) {
        errors.push({
          file: ENV_LOCAL_PATH,
          message:
            "NEXTAUTH_SECRET should be a strong random string (min 20 chars)",
          severity: "warning",
        });
      }
    }
  }

  if (!hasDatabaseUrl) {
    errors.push({
      file: ENV_LOCAL_PATH,
      message: "DATABASE_URL not defined in .env.local",
      severity: "error",
    });
  }

  if (!hasNextauthSecret) {
    errors.push({
      file: ENV_LOCAL_PATH,
      message: "NEXTAUTH_SECRET not defined in .env.local",
      severity: "error",
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
export async function validateEnv(): Promise<boolean> {
  console.log("🔍 Validating environment variables...\n");

  errors.length = 0;

  validateFileExists();

  if (!fs.existsSync(ENV_SCHEMA_PATH)) {
    console.log("❌ Env validation failed - schema file not found");
    return false;
  }

  const content = fs.readFileSync(ENV_SCHEMA_PATH, "utf8");

  validateEnvSchema(content);
  validateZodSchemas(content);
  validateEnvLocalExists();
  validateEnvLocalContent();

  if (errors.length > 0) {
    console.log("\n❌ Environment validation errors:\n");
    for (const error of errors) {
      const icon = error.severity === "error" ? "❌" : "⚠️";
      console.log(`  ${icon} ${error.message}`);
    }
  } else {
    console.log("✅ Environment variables are valid");
  }

  return errors.filter((e) => e.severity === "error").length === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = await validateEnv();
  if (!isValid) {
    process.exit(1);
  }
}
