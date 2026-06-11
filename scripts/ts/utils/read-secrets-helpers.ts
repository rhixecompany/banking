#!/usr/bin/env ts-node
/**
 * Description: Helper utilities for read-secrets scripts
 * CreatedBy: convert-scripts
 * TODO: Expand to support secret rotation and KMS
 */
import fs from "fs";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} filePath
 * @returns {*}
 */
export function readEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const out: Record<string, string> = {};
  for (const l of lines) {
    const m = l.match(/^([^#=\s]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}
