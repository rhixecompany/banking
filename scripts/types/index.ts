/**
 * Shared type definitions for awesome-opencode
 */

/**
 * Entry interface matching the YAML schema
 */
export interface Entry {
  name: string;
  repo: string;
  tagline: string;
  description: string;
  scope?: ("global" | "project")[];
  tags?: string[];
  min_version?: string;
  homepage?: string;
  installation?: string;
  _filePath?: string;
  _fileName?: string;
}

/**
 * Validation result from AJV
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[] | null;
  filePath: string;
}

/**
 * Individual validation error
 */
export interface ValidationError {
  path: string;
  message: string;
  keyword: string;
  params: Record<string, unknown>;
}

/**
 * Category result for README generation
 */
export interface CategoryResult {
  html: string;
  count: number;
  errors: string[];
}

/**
 * Exported entry for JSON registry
 */
export interface ExportedEntry {
  productId: string;
  type: CategoryType;
  displayName: string;
  repoUrl: string;
  tagline: string;
  description: string;
  scope: ("global" | "project")[];
  tags: string[];
  homepageUrl?: string;
  installation?: string;
  minVersion?: string;
}

/**
 * Supported category types
 */
export type CategoryType =
  | "plugins"
  | "themes"
  | "agents"
  | "projects"
  | "resources";

/**
 * CLI arguments
 */
export interface CliArgs {
  outputPath?: string;
  pretty: boolean;
}
