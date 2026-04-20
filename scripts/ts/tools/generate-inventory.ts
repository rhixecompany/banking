#!/usr/bin/env node
import fs from "fs/promises";
import { glob } from "glob";

async function main() {
  const patterns = [
    "AGENTS.md",
    "package.json",
    "app-config.ts",
    "lib/env.ts",
    "scripts/**",
    "scripts/ts/**",
    ".opencode/**",
    ".cursor/**",
    "database/schema.ts",
    "docs/**",
  ];

  const files = new Set<string>();
  for (const p of patterns) {
    const matches = await glob(p, { nodir: true });
    for (const m of matches) files.add(m);
  }

  const outDir = ".opencode/outputs/init-enhanced";
  await fs.mkdir(outDir, { recursive: true });
  const outPath = `${outDir}/inventory.json`;
  const payload = {
    generatedAt: new Date().toISOString(),
    patterns,
    count: files.size,
    files: Array.from(files).sort(),
  };
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`Wrote ${outPath} (${files.size} files)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
