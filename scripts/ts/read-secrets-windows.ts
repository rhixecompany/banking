#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/read-secrets.ps1 (Windows)
 * CreatedBy: convert-scripts (fixer)
 * TODO: note: Node cannot set parent shell env; output key=value pairs for consumption
 */
import fs from "fs";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const arg = process.argv[2];
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(process.argv[1]);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ENV_FILE = arg || path.join(PROJECT_ROOT, ".envs/production/.env");

if (!fs.existsSync(ENV_FILE)) {
  console.error(`Environment file not found: ${ENV_FILE}`);
  process.exit(1);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const content = fs.readFileSync(ENV_FILE, "utf8");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const lines = content.split(/\r?\n/);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {number}
 */
let count = 0;
for (const line of lines) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
  if (!m) continue;
  const key = m[1];
  let value = m[2].trim();
  value = value.replace(/^(['\"]?)(.*)\1$/, "$2");
  console.log(`${key}=${value}`);
  count++;
}
console.error(`Loaded ${count} variables (to current process only).`);
