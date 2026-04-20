#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";
import { parseCli, printDryRunResult } from "../utils/cli";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} dir
 * @param {string[]} [filelist=[]]
 * @returns {{}}
 */
function walk(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) walk(fp, filelist);
    else filelist.push(fp);
  }
  return filelist;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @returns {*}
 */
function relative(p: string) {
  return path.relative(process.cwd(), p).replace(/\\/g, "/");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {{ discoveredAt: any; layouts: Record<string, any>; appRootPage: any; }}
 */
function discoverAppPages() {
  const appDir = path.join(process.cwd(), "app");
  if (!fs.existsSync(appDir)) {
    throw new Error("No app directory found at ./app");
  }
  const allFiles = walk(appDir);
  const layouts: Record<string, any> = {};
  for (const f of allFiles) {
    const rel = relative(f);
    const parts = rel.split("/");
    const layoutSeg = parts.find((p) => /^\(.+\)$/.test(p));
    const layout = layoutSeg || "root";
    layouts[layout] = layouts[layout] || {
      pages: [],
      components: [],
      files: [],
    };
    layouts[layout].files.push(rel);
    if (/page\.tsx?$|page\.jsx?$/.test(f)) layouts[layout].pages.push(rel);
    if (/components?/i.test(rel)) layouts[layout].components.push(rel);
  }
  const appRootPage = [
    "app/page.tsx",
    "app/page.ts",
    "app/page.jsx",
    "app/page.js",
  ].find((p) => fs.existsSync(path.join(process.cwd(), p)));
  return { discoveredAt: new Date().toISOString(), layouts, appRootPage };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const cli = parseCli();
  const out = cli.args["out"] || cli.args._[0];
  if (!out) {
    console.error(
      "Usage: npx tsx scripts/ts/tools/discover-app-pages.ts --out=path [--dry-run]",
    );
    process.exit(1);
  }
  const manifest = discoverAppPages();
  const json = JSON.stringify(manifest, null, 2);
  if (cli.dryRun) {
    printDryRunResult("Discovered app pages (dry-run)", manifest);
    return;
  }
  fs.writeFileSync(out, json, "utf8");
  console.log("Manifest written to", out);
}

if (require.main === module)
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
