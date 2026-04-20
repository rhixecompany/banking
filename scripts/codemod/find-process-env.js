#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const globs = ["app", "lib"];

function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // skip node_modules and .git
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      walk(full, results);
    } else if (ent.isFile()) {
      results.push(full);
    }
  }
  return results;
}

function matchesTarget(filePath) {
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  for (const g of globs) {
    if (rel.startsWith(g + "/")) {
      if (/[.](js|ts|jsx|tsx)$/.test(rel)) return true;
    }
  }
  return false;
}

const files = walk(process.cwd()).filter(matchesTarget);
const report = { files: {}, totalFiles: 0, totalKeys: 0 };
const re = /process\.env\.([A-Za-z0-9_]+)/g;

for (const f of files) {
  let content;
  try {
    content = fs.readFileSync(f, "utf8");
  } catch {
    continue;
  }
  const keys = new Set();
  let m;
  while ((m = re.exec(content)) !== null) {
    keys.add(m[1]);
  }
  if (keys.size > 0) {
    const arr = Array.from(keys).sort();
    report.files[path.relative(process.cwd(), f)] = arr;
    report.totalFiles += 1;
    report.totalKeys += arr.length;
  }
}

// write report
try {
  const outDir = path.join(process.cwd(), "scripts", "codemod");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "report.json"),
    JSON.stringify(report, null, 2),
    "utf8",
  );
} catch (err) {
  console.error("Failed to write report:", err);
}

// summary
console.log(
  "Found",
  report.totalFiles,
  "files with process.env usage, and",
  report.totalKeys,
  "unique keys.",
);
for (const [file, keys] of Object.entries(report.files)) {
  console.log("- " + file + ": " + keys.join(", "));
}

// --apply handling
const args = process.argv.slice(2);
if (args.includes("--apply")) {
  console.log(
    "\n--apply specified: inserting TODO comment blocks where missing",
  );
  for (const [relPath, keys] of Object.entries(report.files)) {
    const abs = path.join(process.cwd(), relPath);
    try {
      let content = fs.readFileSync(abs, "utf8");
      const marker = "REPLACE_DIRECT_PROCESS_ENV";
      if (!content.includes(marker)) {
        const comment = `/* TODO: ${marker}: keys: ${keys.join(",")} */\n`;
        fs.writeFileSync(abs, comment + content, "utf8");
        console.log("Patched", relPath);
      } else {
        console.log("Skipped (already has marker):", relPath);
      }
    } catch (err) {
      console.error("Failed to patch", relPath, err);
    }
  }
}

process.exit(0);
