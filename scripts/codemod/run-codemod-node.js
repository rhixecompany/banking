#!/usr/bin/env node
// Node-only codemod runner: scans target directories for process.env.KEY usages
// and writes scripts/codemod/report.json. This avoids shell wrappers and can be
// executed directly with `node scripts/codemod/run-codemod-node.js`.
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TARGET_GLOBS = ["app", "lib", "pages", "components", "src"];
const IGNORED_DIRS = new Set([
  "scripts/ts",
  "scripts/ts/docker",
  "scripts/ts/cleanup",
  "scripts/ts/deploy",
  "scripts/ts/server",
]);
const FILE_EXTS = new Set([".js", ".ts", ".jsx", ".tsx"]);

function walk(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    // skip ignored
    let skip = false;
    for (const ig of IGNORED_DIRS)
      if (rel.startsWith(ig)) {
        skip = true;
        break;
      }
    if (skip) continue;
    if (ent.isDirectory()) {
      walk(full, results);
    } else if (ent.isFile()) {
      if (FILE_EXTS.has(path.extname(full))) results.push(full);
    }
  }
  return results;
}

function scanFiles(files) {
  const re = /process\.env\.([A-Za-z0-9_]+)/g;
  const report = {
    files: {},
    totalFiles: 0,
    totalKeys: 0,
    scannedFiles: files.length,
    generatedAt: new Date().toISOString(),
  };
  const keySet = new Set();
  for (const f of files) {
    let content;
    try {
      content = fs.readFileSync(f, "utf8");
    } catch {
      continue;
    }
    const keys = new Set();
    let m;
    while ((m = re.exec(content)) !== null) keys.add(m[1]);
    if (keys.size > 0) {
      const rel = path.relative(ROOT, f);
      const arr = Array.from(keys).sort();
      report.files[rel] = arr;
      report.totalFiles += 1;
      for (const k of arr) keySet.add(k);
    }
  }
  report.totalKeys = keySet.size;
  return report;
}

function writeReport(report) {
  const outDir = path.join(ROOT, "scripts", "codemod");
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch {}
  const outPath = path.join(outDir, "report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  return outPath;
}

function main() {
  const files = [];
  for (const g of TARGET_GLOBS) walk(path.join(ROOT, g), files);
  const report = scanFiles(files);
  const outPath = writeReport(report);
  console.log("Wrote report to", outPath);
  console.log("Scanned files:", report.scannedFiles);
  console.log("Files with matches:", report.totalFiles);
  console.log("Unique keys:", report.totalKeys);
}

if (require.main === module) main();
