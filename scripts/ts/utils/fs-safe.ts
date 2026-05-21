#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";

/**
 * Write file with backup (appends .bak.{timestamp})
 *
 * @export
 * @async
 * @param {string} filePath
 * @param {string} content
 * @param {?string} [timestamp]
 * @returns {unknown}
 */
export async function writeBackup(
  filePath: string,
  content: string,
  timestamp?: string,
) {
  timestamp = timestamp ?? new Date().toISOString().replaceAll(/[:.]/g, "-");
  const backup = `${filePath}.bak.${timestamp}`;
  await fs.mkdir(path.dirname(backup), { recursive: true });
  await fs.writeFile(backup, content, "utf8");
  return backup;
}

/**
 * Ensure directory exists (creates if missing)
 *
 * @export
 * @async
 * @param {string} dir
 * @returns {Promise<void>}
 */
export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Safely remove file (logs if verbose/dryRun)
 *
 * @export
 * @async
 * @param {string} filePath
 * @param {boolean} [dryRun=false]
 * @returns {Promise<void>}
 */
export async function safeRm(filePath: string, dryRun = false): Promise<void> {
  if (dryRun) {
    return;
  }
  try {
    await fs.rm(filePath, { force: true });
  } catch {
    // Ignore errors (file may not exist)
  }
}

/**
 * Safely move file from src to dest
 *
 * @export
 * @async
 * @param {string} src
 * @param {string} dest
 * @param {boolean} [dryRun=false]
 * @returns {Promise<void>}
 */
export async function safeMove(
  src: string,
  dest: string,
  dryRun = false,
): Promise<void> {
  if (dryRun) {
    return;
  }
  await ensureDir(path.dirname(dest));
  await fs.rename(src, dest);
}
