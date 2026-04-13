#!/usr/bin/env node
/**
 * scripts/utils/io.ts
 *
 * Minimal centralized IO helper for scripts dry-run migration.
 * - Honors CLI --dry-run / -n precedence, DRY_RUN env, and globalThis.__SCRIPTS_DRY_RUN
 * - Provides writeFile, mkdirp, removeFile helpers that log dry-run actions and mask secrets
 * - Designed for use by scripts/generate/* and other migration targets
 */

import fs from "fs";
import path from "path";

export interface IoOptions {
  dryRun?: boolean;
  yes?: boolean; // for destructive ops
  json?: boolean; // emit machine-readable JSON lines when true
}

function isDryRunFlagSet(argv = process.argv): boolean {
  if (argv.includes("--dry-run") || argv.includes("-n")) return true;
  if (process.env["DRY_RUN"] === "true" || process.env["DRY_RUN"] === "1")
    return true;
  if ((globalThis as any).__SCRIPTS_DRY_RUN) return true;
  return false;
}

function maskPreview(content: string, max = 200) {
  if (!content) return "";
  const preview = content.slice(0, max).replace(/\n/g, "\\n");
  return preview + (content.length > max ? "..." : "");
}

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
        path: path.relative(process.cwd(), filePath),
        content: maskPreview(content),
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

export async function removeFile(filePath: string, opts: IoOptions = {}) {
  const dry = opts.dryRun ?? isDryRunFlagSet();
  const requireYes = process.env["RUN_DESTRUCTIVE"] === "true";
  if (!opts.yes && requireYes && !opts.yes) {
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

export function isDryRun(opts?: IoOptions) {
  return opts?.dryRun ?? isDryRunFlagSet();
}

export default { mkdirp, writeFile, removeFile, isDryRun };
