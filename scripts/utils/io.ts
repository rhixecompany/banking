#!/usr/bin/env node
/* eslint-disable n/no-process-env, no-console */
/** scripts/utils/io.ts
 *
 * Minimal centralized IO helper for scripts dry-run migration.
 * - Honors CLI --dry-run / -n precedence, DRY_RUN env, and globalThis.__SCRIPTS_DRY_RUN
 * - Provides writeFile, mkdirp, removeFile helpers that log dry-run actions and mask secrets
 * - Designed for use by scripts/generate/* and other migration targets
 */

import fs from "fs";
import path from "path";

/**
 * IO helper options
 *
 * @export
 * @interface IoOptions
 */
export interface IoOptions {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?boolean}
   */
  dryRun?: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?boolean}
   */
  yes?: boolean; // for destructive ops
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?boolean}
   */
  json?: boolean; // emit machine-readable JSON lines when true
}

/**
 * Check CLI flags / env for dry-run semantics
 *
 * @param {*} [argv=process.argv]
 * @returns {boolean}
 */
function isDryRunFlagSet(argv = process.argv): boolean {
  if (argv.includes("--dry-run") || argv.includes("-n")) return true;
  // Prefer lib/env when available to centralize configuration, fall back to process.env
  try {
    // Use require to avoid import-time validation side-effects in scripts
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { env } = require("@/lib/env") as any;
    if (env && (env.DRY_RUN === "true" || env.DRY_RUN === "1")) return true;
  } catch {
    // fall back to direct process.env when lib/env is not available
  }

  if (process.env["DRY_RUN"] === "true" || process.env["DRY_RUN"] === "1")
    return true;
  const globalDry = (globalThis as any).__SCRIPTS_DRY_RUN;
  if (globalDry === true || globalDry === "true" || globalDry === "1")
    return true;
  return false;
}

/**
 * Shorten content for logging preview
 *
 * @param {string} content
 * @param {number} [max=200]
 * @returns {string}
 */
function maskPreview(content: string, max = 200) {
  if (!content) return "";
  const preview = content.slice(0, max).replaceAll("\n", "\\n");
  return preview + (content.length > max ? "..." : "");
}

/**
 * Structured logging helper for scripts
 *
 * @param {string} action
 * @param {Record<string, unknown>} details
 * @param {boolean} [json=false]
 */
function log(action: string, details: Record<string, unknown>, json = false) {
  if (json) {
    // one-line JSON for machine parsing
    // avoid printing full content in JSON; include preview
    const out = { action, ...details } as any;
    if (typeof out.content === "string")
      out.content = maskPreview(out.content as string, 200);
    console.log(JSON.stringify(out));
  } else {
    console.warn(
      `${action}: ${Object.entries(details)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join(" ")}`,
    );
  }
}

/**
 * Ensure a directory exists (with dry-run support)
 *
 * @export
 * @async
 * @param {string} targetPath
 * @param {IoOptions} [opts={}]
 */
export async function mkdirp(targetPath: string, opts: IoOptions = {}) {
  const dry = opts.dryRun ?? isDryRunFlagSet();
  if (dry) {
    log(
      "[dry-run] mkdirp",
      { path: path.relative(process.cwd(), targetPath) },
      opts.json ?? false,
    );
    return;
  }
  await fs.promises.mkdir(targetPath, { recursive: true });
  log(
    "mkdir",
    { path: path.relative(process.cwd(), targetPath) },
    opts.json ?? false,
  );
}

/**
 * Write a file, creating directories as needed (dry-run aware)
 *
 * @export
 * @async
 * @param {string} filePath
 * @param {string} content
 * @param {IoOptions} [opts={}]
 */
export async function writeFile(
  filePath: string,
  content: string,
  opts: IoOptions = {},
) {
  const dry = opts.dryRun ?? isDryRunFlagSet();

  if (dry) {
    log(
      "[dry-run] writeFile",
      {
        content: maskPreview(content),
        path: path.relative(process.cwd(), filePath),
      },
      opts.json ?? false,
    );
    return;
  }

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, content, "utf8");
  log(
    "writeFile",
    { path: path.relative(process.cwd(), filePath), size: content.length },
    opts.json ?? false,
  );
}

/**
 * Remove a file (supports destructive gating and dry-run)
 *
 * @export
 * @async
 * @param {string} filePath
 * @param {IoOptions} [opts={}]
 */
export async function removeFile(filePath: string, opts: IoOptions = {}) {
  const dry = opts.dryRun ?? isDryRunFlagSet();
  const requireYes = process.env["RUN_DESTRUCTIVE"] === "true";
  if (requireYes && !opts.yes) {
    // If destructive gating is enabled via env, require opts.yes true
    if (dry) {
      log(
        "[dry-run] removeFile (gated)",
        { path: path.relative(process.cwd(), filePath) },
        opts.json ?? false,
      );
      return;
    }
    throw new Error(
      "Destructive operations require RUN_DESTRUCTIVE=true and --yes flag",
    );
  }

  if (dry) {
    log(
      "[dry-run] removeFile",
      { path: path.relative(process.cwd(), filePath) },
      opts.json ?? false,
    );
    return;
  }

  await fs.promises.rm(filePath, { force: true });
  log(
    "removeFile",
    { path: path.relative(process.cwd(), filePath) },
    opts.json ?? false,
  );
}

/**
 * Check dry-run status for callers
 *
 * @export
 * @param {?IoOptions} [opts]
 * @returns {boolean}
 */
export function isDryRun(opts?: IoOptions) {
  return opts?.dryRun ?? isDryRunFlagSet();
}

/**
 * Exported script IO helpers
 */
const exported = { isDryRun, mkdirp, removeFile, writeFile };
export default exported;
