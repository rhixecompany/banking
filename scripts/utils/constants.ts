/**
 * Shared constants for awesome-opencode scripts
 */

import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
/**
 * Description placeholder
 *
 * @type {*}
 */
const __filename = fileURLToPath(import.meta.url);
/**
 * Description placeholder
 *
 * @type {*}
 */
const __dirname = path.dirname(__filename);

/**
 * Root folder of the project
 */
export const ROOT_FOLDER = path.resolve(__dirname, "../..");

/**
 * Data folder containing YAML entries
 */
export const DATA_DIR = path.join(ROOT_FOLDER, "data");

/**
 * Supported categories in order
 */
export const CATEGORIES: CategoryType[] = [
  "plugins",
  "themes",
  "agents",
  "projects",
  "resources",
] as const;

/**
 * Category to folder path mapping
 */
export const CATEGORY_PATHS: Record<CategoryType, string> = {
  agents: path.join(DATA_DIR, "agents"),
  plugins: path.join(DATA_DIR, "plugins"),
  projects: path.join(DATA_DIR, "projects"),
  resources: path.join(DATA_DIR, "resources"),
  themes: path.join(DATA_DIR, "themes"),
} as const;

/**
 * Category placeholder mapping for README template
 */
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  agents: "AGENTS",
  plugins: "PLUGINS",
  projects: "PROJECTS",
  resources: "RESOURCES",
  themes: "THEMES",
};

/**
 * Validation limits
 */
export const TAGLINE_MAX_LENGTH = 120;
/**
 * Description placeholder
 *
 * @type {1}
 */
export const NAME_MIN_LENGTH = 1;
/**
 * Description placeholder
 *
 * @type {100}
 */
export const NAME_MAX_LENGTH = 100;
/**
 * Description placeholder
 *
 * @type {500}
 */
export const DESCRIPTION_MAX_LENGTH = 500;

// Re-export CategoryType for convenience
import type { CategoryType } from "../types/index.js";
export { CategoryType };
