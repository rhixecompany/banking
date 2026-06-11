#!/usr/bin/env ts-node
/**
 * Description: Generate wrappers under scripts/ts for any remaining .sh/.ps1 scripts
 * CreatedBy: convert-scripts
 * TODO: Run this locally to create missing wrappers automatically
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
const ROOT = process.cwd();
// Walk scripts directory and find .sh/.ps1 files without a corresponding scripts/ts wrapper
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} dir
 * @param {string[]} [files=[]]
 * @returns {{}}
 */
function walk(dir: string, files: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 */
function ensureDir(filePath: string) {
  const d = path.dirname(filePath);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} original
 * @returns {*}
 */
function makeWrapper(original: string) {
  const rel = path.relative(ROOT, original).replaceAll("\\", "/");
  const tsPath = path
    .join(ROOT, "scripts", "ts", rel)
    .replace(/\.(sh|ps1)$/, ".ts");
  if (fs.existsSync(tsPath)) return null;
  ensureDir(tsPath);
  const isPs1 = original.endsWith(".ps1");
  const content = `#!/usr/bin/env ts-node\n/**\n * Auto-generated wrapper for ${rel}\n * CreatedBy: convert-scripts\n * TODO: Convert logic to native Node for better portability\n */\nimport { spawnSync } from "child_process";\n\nconst script = ${JSON.stringify(rel)};\n\nif (process.platform === "win32") {\n  spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", script], { stdio: "inherit" });\n} else {\n  spawnSync("bash", [script], { stdio: "inherit" });\n}\n`;
  fs.writeFileSync(tsPath, content, "utf8");
  return path.relative(ROOT, tsPath);
}

/**
 * Description placeholder
 * @author Adminbot
 */
function main() {
  const all = walk(path.join(ROOT, "scripts"));
  const shps = all.filter((p) => p.endsWith(".sh") || p.endsWith(".ps1"));
  const created: string[] = [];
  for (const s of shps) {
    // skip files already under scripts/ts
    if (s.includes(path.join("scripts", "ts"))) continue;
    const w = makeWrapper(s);
    if (w) created.push(w);
  }
  logger.info(`Created ${created.length} wrappers:`);
  for (const c of created) logger.info(` - ${c}`);
}

if (require.main === module) main();
