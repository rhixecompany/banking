#!/usr/bin/env node
/*
 * Scans app/ and lib/ for direct `process.env.KEY` usages and produces a JSON report.
 * Usage: ts-node ./scripts/codemod/find-process-env.ts [--apply]
 */
import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
// Skip scripts/ts directory by default unless explicitly targeted
const TARGET_GLOBS = ["app", "lib", "pages", "components", "src"];
// ensure generated TS scripts under scripts/ts/docker are skipped
const IGNORED_DIRS = new Set([
  "scripts/ts",
  "scripts/ts/docker",
  // Skip converted script batches
  "scripts/ts/cleanup",
  "scripts/ts/deploy",
  "scripts/ts/server",
]);
const FILE_EXTS = new Set([".js", ".ts", ".jsx", ".tsx"]);

export async function main(argv: string[] = []) {
  const apply = argv.includes("--apply");
  const results: Record<string, string[]> = {};
  let filesScanned = 0;
  const keysSet = new Set<string>();

  async function walk(dir: string) {
    let entries: string[];
    try {
      entries = await fs.readdir(dir);
    } catch (err) {
      return;
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      // skip ignored dirs
      const rel = path.relative(ROOT, full).replace(/\\/g, "/");
      for (const ig of IGNORED_DIRS) {
        if (rel.startsWith(ig)) return;
      }
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await walk(full);
      } else if (stat.isFile()) {
        const ext = path.extname(full);
        if (!FILE_EXTS.has(ext)) continue;
        filesScanned++;
        const text = await fs.readFile(full, "utf8");
        const re = /process\.env\.([A-Za-z0-9_]+)/g;
        const found = new Set<string>();
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          found.add(m[1]);
          keysSet.add(m[1]);
        }
        if (found.size > 0) {
          results[path.relative(ROOT, full)] = Array.from(found).sort();
          if (apply) {
            // Build a stricter JSDoc-style TODO header as requested
            const keys = Array.from(found).sort().join(", ");
            const header = `/**\n * TODO: REPLACE_DIRECT_PROCESS_ENV\n * keys: ${keys}\n * auto-generated-by: convert-scripts\n */\n\n`;
            // Preserve BOM if present
            const hasBOM = text.startsWith("\uFEFF");
            const trimmed = hasBOM ? text.slice(1) : text;
            if (
              !trimmed.startsWith("/**\n * TODO: REPLACE_DIRECT_PROCESS_ENV")
            ) {
              const out = (hasBOM ? "\uFEFF" : "") + header + trimmed;
              await fs.writeFile(full, out, { encoding: "utf8" });
            }
          }
        }
      }
    }
  }

  for (const g of TARGET_GLOBS) {
    await walk(path.join(ROOT, g));
  }

  const report = {
    files: results,
    totalFiles: Object.keys(results).length,
    totalKeys: keysSet.size,
    scannedFiles: filesScanned,
    generatedAt: new Date().toISOString(),
  };

  const outPath = path.join(ROOT, "scripts", "codemod", "report.json");
  try {
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(report, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write report:", err);
  }

  // Print summary
  console.log("Process.env scan completed");
  console.log(`Scanned files: ${filesScanned}`);
  console.log(`Files with direct process.env usages: ${report.totalFiles}`);
  console.log(`Unique keys found: ${report.totalKeys}`);
  console.log(`Report written to: ${path.relative(ROOT, outPath)}`);
  if (report.totalFiles > 0) {
    console.log("Files:");
    for (const f of Object.keys(results)) {
      console.log(` - ${f}: ${results[f].join(",")}`);
    }
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  require.main === module
) {
  // Support both ts-node and compiled runtimes
  main(process.argv.slice(2)).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
