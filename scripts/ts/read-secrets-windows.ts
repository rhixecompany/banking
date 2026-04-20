#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/read-secrets.ps1 (Windows)
 * CreatedBy: convert-scripts (fixer)
 * TODO: note: Node cannot set parent shell env; output key=value pairs for consumption
 */
import fs from "fs";
import path from "path";

const arg = process.argv[2];
const SCRIPT_DIR = path.dirname(process.argv[1]);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
const ENV_FILE = arg || path.join(PROJECT_ROOT, ".envs/production/.env");

if (!fs.existsSync(ENV_FILE)) {
  console.error(`Environment file not found: ${ENV_FILE}`);
  process.exit(1);
}

const content = fs.readFileSync(ENV_FILE, "utf8");
const lines = content.split(/\r?\n/);
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
