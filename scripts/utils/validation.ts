/**
 * Schema validation utilities for awesome-opencode
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";

import type { ValidationError, ValidationResult } from "../types/index.js";

import { ROOT_FOLDER } from "./constants.js";

// Initialize AJV with all errors option
/**
 * Description placeholder
 *
 * @type {*}
 */
const ajv = new Ajv({ allErrors: true });
// ajv-formats may be resolved with a nested Ajv dependency, which makes its
// types incompatible with the project's Ajv instance even though runtime works.
addFormats(ajv as unknown as Parameters<typeof addFormats>[0]);

/**
 * Description placeholder
 *
 * @type {(null | ReturnType<typeof ajv.compile>)}
 */
let validateFn: null | ReturnType<typeof ajv.compile> = null;

/**
 * Get the compiled validation function (lazy-loaded)
 */
function getValidator() {
  if (!validateFn) {
    const schemaPath = path.join(ROOT_FOLDER, ".opencode/schema.json");
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
      keyword: err.keyword,
      message: err.message ?? "Unknown error",
      params: err.params as Record<string, unknown>,
      path: err.instancePath || "/",
    }));
    return { errors, filePath, valid: false };
  }

  return { errors: null, filePath, valid: true };
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
