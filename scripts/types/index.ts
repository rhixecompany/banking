/**
 * Shared type definitions for awesome-opencode
 */

/**
 * Entry interface matching the YAML schema
 */
export interface Entry {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  repo: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  tagline: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  description: string;
  /**
   * Description placeholder
   *
   * @type {?("global" | "project")[]}
   */
  scope?: ("global" | "project")[];
  /**
   * Description placeholder
   *
   * @type {?string[]}
   */
  tags?: string[];
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  min_version?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  homepage?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  installation?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  _filePath?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  _fileName?: string;
}

/**
 * Validation result from AJV
 */
export interface ValidationResult {
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  valid: boolean;
  /**
   * Description placeholder
   *
   * @type {(null | ValidationError[])}
   */
  errors: null | ValidationError[];
  /**
   * Description placeholder
   *
   * @type {string}
   */
  filePath: string;
}

/**
 * Individual validation error
 */
export interface ValidationError {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  path: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  message: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  keyword: string;
  /**
   * Description placeholder
   *
   * @type {Record<string, unknown>}
   */
  params: Record<string, unknown>;
}

/**
 * Category result for README generation
 */
export interface CategoryResult {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  html: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  count: number;
  /**
   * Description placeholder
   *
   * @type {string[]}
   */
  errors: string[];
}

/**
 * Exported entry for JSON registry
 */
export interface ExportedEntry {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  productId: string;
  /**
   * Description placeholder
   *
   * @type {CategoryType}
   */
  type: CategoryType;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  displayName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  repoUrl: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  tagline: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  description: string;
  /**
   * Description placeholder
   *
   * @type {("global" | "project")[]}
   */
  scope: ("global" | "project")[];
  /**
   * Description placeholder
   *
   * @type {string[]}
   */
  tags: string[];
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  homepageUrl?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  installation?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  minVersion?: string;
}

/**
 * Supported category types
 */
export type CategoryType =
  | "agents"
  | "plugins"
  | "projects"
  | "resources"
  | "themes";

/**
 * CLI arguments
 */
export interface CliArgs {
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  outputPath?: string;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  pretty: boolean;
}
