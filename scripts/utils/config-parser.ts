/**
 * Configuration Parser Utilities
 *
 * Parses and validates configuration files for the banking system:
 * - Drizzle database config
 * - Environment schemas
 * - Application config files
 */

import fs from "fs";
import yaml from "js-yaml";
import path from "path";

/**
 * Description placeholder
 *
 * @interface DrizzleConfig
 * @typedef {DrizzleConfig}
 */
interface DrizzleConfig {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  schema: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  out: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  dialect: string;
  /** Description placeholder */
  [key: string]: unknown;
}

/**
 * Description placeholder
 *
 * @interface ConfigResult
 * @typedef {ConfigResult}
 * @template T
 */
interface ConfigResult<T> {
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  success: boolean;
  /**
   * Description placeholder
   *
   * @type {?T}
   */
  data?: T;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  error?: string;
}

/**
 * Description placeholder
 *
 * @template T
 * @param {() => T} operation
 * @param {string} _filePath
 * @param {(null | T)} [defaultValue=null]
 * @returns {(null | T)}
 */
function safeFileOperation<T>(
  operation: () => T,
  _filePath: string,
  defaultValue: null | T = null,
): null | T {
  try {
    return operation();
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return defaultValue;
  }
}

/**
 * Description placeholder
 *
 * @export
 * @returns {ConfigResult<DrizzleConfig>}
 */
export function parseDrizzleConfig(): ConfigResult<DrizzleConfig> {
  const configPath = path.join(process.cwd(), "drizzle.config.ts");

  const result = safeFileOperation(
    () => {
      const content = fs.readFileSync(configPath, "utf8");

      const schemaMatch = content.match(/schema:\s*["']([^"']+)["']/);
      const outMatch = content.match(/out:\s*["']([^"']+)["']/);
      const dialectMatch = content.match(/dialect:\s*["']([^"']+)["']/);

      if (!schemaMatch || !outMatch) {
        throw new Error("Could not parse drizzle config");
      }

      return {
        data: {
          dialect: dialectMatch?.[1] || "postgresql",
          out: outMatch[1],
          schema: schemaMatch[1],
        },
        success: true,
      };
    },
    configPath,
    null,
  );

  if (result) {
    return result;
  }
  return { error: "Failed to parse drizzle config", success: false };
}

/**
 * Description placeholder
 *
 * @export
 * @returns {ConfigResult<Record<string, unknown>>}
 */
export function parseEnvSchema(): ConfigResult<Record<string, unknown>> {
  const envPath = path.join(process.cwd(), "lib", "env.ts");

  const result = safeFileOperation(
    () => {
      const content = fs.readFileSync(envPath, "utf8");

      const schemaMatch = content.match(/export\s+const\s+schema\s*=\s*/);
      if (!schemaMatch) {
        return { error: "Could not find schema definition", success: false };
      }

      return {
        data: { raw: "schema found" },
        success: true,
      };
    },
    envPath,
    null,
  );

  if (result) {
    return result;
  }
  return { error: "Failed to parse env schema", success: false };
}

/**
 * Description placeholder
 *
 * @export
 * @template [T=unknown]
 * @param {string} filePath
 * @returns {ConfigResult<T>}
 */
export function parseYamlConfig<T = unknown>(
  filePath: string,
): ConfigResult<T> {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  const result = safeFileOperation(
    () => {
      const content = fs.readFileSync(fullPath, "utf8");
      const data = yaml.load(content) as T;
      return { data, success: true };
    },
    fullPath,
    null,
  );

  if (result) {
    return result;
  }
  return { error: `Failed to parse ${filePath}`, success: false };
}

/**
 * Description placeholder
 *
 * @export
 * @template [T=unknown]
 * @param {string} filePath
 * @returns {ConfigResult<T>}
 */
export function parseJsonConfig<T = unknown>(
  filePath: string,
): ConfigResult<T> {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  const result = safeFileOperation(
    () => {
      const content = fs.readFileSync(fullPath, "utf8");
      const data = JSON.parse(content) as T;
      return { data, success: true };
    },
    fullPath,
    null,
  );

  if (result) {
    return result;
  }
  return { error: `Failed to parse ${filePath}`, success: false };
}

/**
 * Description placeholder
 *
 * @export
 * @template T
 * @param {Record<string, unknown>} config
 * @param {string} key
 * @param {T} defaultValue
 * @returns {T}
 */
export function getConfigValue<T>(
  config: Record<string, unknown>,
  key: string,
  defaultValue: T,
): T {
  const keys = key.split(".");
  let value: unknown = config;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return defaultValue;
    }
  }

  return (value as T) ?? defaultValue;
}

/**
 * Description placeholder
 *
 * @export
 * @param {Record<string, unknown>} config
 * @param {string[]} required
 * @returns {string[]}
 */
export function validateConfigRequired(
  config: Record<string, unknown>,
  required: string[],
): string[] {
  const errors: string[] = [];

  for (const key of required) {
    const value = getConfigValue(config, key, null);
    if (value === null) {
      errors.push(`Missing required config: ${key}`);
    }
  }

  return errors;
}
