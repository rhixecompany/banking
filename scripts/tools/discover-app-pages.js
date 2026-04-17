#!/usr/bin/env node
/*
 * discover-app-pages.js
 * Produces a JSON manifest of Next.js app pages grouped by layout.
 * Usage: node scripts/tools/discover-app-pages.js --out=path [--dry-run]
 */

import fs from "fs";
import path from "path";

function usage() {
  console.log(
    "Usage: node scripts/tools/discover-app-pages.js --out=path [--dry-run]",
  );
}

function parseArgs() {
  const args = process.argv.slice(2);
  const outArg = args.find((a) => a.startsWith("--out="));
  const dryRun = args.includes("--dry-run");
  if (!outArg) {
    usage();
    process.exit(1);
  }
  const out = outArg.split("=")[1];
  return { out, dryRun };
}

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fp = path.join(dir, file);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      walk(fp, filelist);
    } else {
      filelist.push(fp);
    }
  });
  return filelist;
}

function relative(p) {
  return path.relative(process.cwd(), p).replace(/\\/g, "/");
}

function discoverAppPages() {
  const appDir = path.join(process.cwd(), "app");
  if (!fs.existsSync(appDir)) {
    console.error("No app directory found at ./app");
    process.exit(2);
  }

  const allFiles = walk(appDir);
  // simple heuristic: layout folders are (auth), (admin), (root) and pages are page.tsx/jsx/ts
  const layouts = {};

  allFiles.forEach((f) => {
    const rel = relative(f);
    const parts = rel.split("/");
    // find segment that matches a (layout)
    const layoutSeg = parts.find((p) => /^\(.+\)$/.test(p));
    const layout = layoutSeg || "root";
    layouts[layout] = layouts[layout] || {
      pages: [],
      components: [],
      files: [],
    };
    layouts[layout].files.push(rel);
    if (/page\.tsx?$|page\.jsx?$/.test(f)) {
      layouts[layout].pages.push(rel);
    }
    // simple components heuristic
    if (/components?/i.test(rel)) {
      layouts[layout].components.push(rel);
    }
  });

  // App root page
  const appRootPage = [
    "app/page.tsx",
    "app/page.ts",
    "app/page.jsx",
    "app/page.js",
  ].find((p) => fs.existsSync(path.join(process.cwd(), p)));

  return { discoveredAt: new Date().toISOString(), layouts, appRootPage };
}

function main() {
  const { out, dryRun } = parseArgs();
  const manifest = discoverAppPages();
  const json = JSON.stringify(manifest, null, 2);
  if (dryRun) {
    console.log("Dry-run manifest:");
    console.log(json);
  }
  fs.writeFileSync(out, json, "utf8");
  console.log("Manifest written to", out);
}

if (process.argv[1] && process.argv[1].endsWith("discover-app-pages.js"))
  main();
