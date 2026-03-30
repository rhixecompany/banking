/**
 * Shared constants for awesome-opencode scripts
 */

import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
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
  plugins: path.join(DATA_DIR, "plugins"),
  themes: path.join(DATA_DIR, "themes"),
  agents: path.join(DATA_DIR, "agents"),
  projects: path.join(DATA_DIR, "projects"),
  resources: path.join(DATA_DIR, "resources"),
} as const;

/**
 * Category placeholder mapping for README template
 */
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  plugins: "PLUGINS",
  themes: "THEMES",
  agents: "AGENTS",
  projects: "PROJECTS",
  resources: "RESOURCES",
};

/**
 * Validation limits
 */
export const TAGLINE_MAX_LENGTH = 120;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

// Re-export CategoryType for convenience
import type { CategoryType } from "../types/index.js";
export { CategoryType };
