#!/usr/bin/env ts-node
import fs from "fs/promises";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
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
  timestamp = timestamp ?? new Date().toISOString().replace(/[:.]/g, "-");
  const backup = `${filePath}.bak.${timestamp}`;
  await fs.mkdir(path.dirname(backup), { recursive: true });
  await fs.writeFile(backup, content, "utf8");
  return backup;
}
