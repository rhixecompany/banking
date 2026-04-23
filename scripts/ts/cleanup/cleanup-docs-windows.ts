#!/usr/bin/env node
/**
 * cleanup-docs-windows.ts - Windows variant converted from cleanup-docs.ps1
 * TODO: Validate PowerShell parity for interactive prompts on Windows
 */
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

logger.info("(windows) Scanning documentation files...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} dir
 * @param {string[]} [out=[]]
 * @returns {{}}
 */
function walk(dir: string, out: string[] = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (stat.isFile() && full.endsWith(".md")) out.push(full);
  }
  return out;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const files = walk(PROJECT_ROOT).map((p) =>
  path.relative(PROJECT_ROOT, p).replaceAll("\\", "/"),
);
logger.info(`Found ${files.length} markdown files`);
for (const f of files.slice(0, 200)) logger.info(" -", f);

process.exit(0);
