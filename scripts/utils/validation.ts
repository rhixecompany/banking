/**
 * Schema validation utilities for awesome-opencode
 * Based on patterns from Banking/eng/validate-*.ts
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import type { ValidationError, ValidationResult } from "../types/index.js";
import { ROOT_FOLDER } from "./constants.js";

// Initialize AJV with all errors option
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

let validateFn: ReturnType<typeof ajv.compile> | null = null;

/**
 * Get the compiled validation function (lazy-loaded)
 */
function getValidator() {
  if (!validateFn) {
    const schemaPath = path.join(ROOT_FOLDER, "data/schema.json");
    const schemaContent = fs.readFileSync(schemaPath, "utf8");
    const schema = JSON.parse(schemaContent);
    validateFn = ajv.compile(schema);
  }
  return validateFn;
}

/**
 * Validate an entry against the schema
 */
export function validateEntry(
  data: unknown,
  filePath: string,
): ValidationResult {
  const validate = getValidator();

  // Remove internal metadata fields before validation
  const cleanData = { ...(data as Record<string, unknown>) };
  delete cleanData._filePath;
  delete cleanData._fileName;

  const valid = validate(cleanData);

  if (!valid && validate.errors) {
    const errors: ValidationError[] = validate.errors.map((err) => ({
      path: err.instancePath || "/",
      message: err.message || "Unknown error",
      keyword: err.keyword,
      params: err.params as Record<string, unknown>,
    }));
    return { valid: false, errors, filePath };
  }

  return { valid: true, errors: null, filePath };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  if (result.valid) return "";

  const lines: string[] = [`Validation failed for ${result.filePath}:`];
  if (result.errors) {
    for (const err of result.errors) {
      lines.push(`  - ${err.path}: ${err.message}`);
    }
  }
  return lines.join("\n");
}
