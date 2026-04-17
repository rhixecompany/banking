#!/usr/bin/env tsx
import { execa } from "execa";

// Runs checks (eslint, type-check, prettier) only on changed files (git diff).
// Dry-run by default; pass --apply to execute formatting/fixes.

async function run(cmd: string, args: string[]) {
  const p = execa(cmd, args, { shell: true, stdio: "inherit" });
  await p;
}

async function getChangedFiles() {
  // Use async call to avoid sync-only types and to match execa ESM default export
  const p = await execa("git", ["diff", "--name-only", "HEAD"], {
    encoding: "utf8",
  });
  const out = p.stdout || "";
  return out.split(/\r?\n/).filter(Boolean);
}

async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const files = await getChangedFiles();
  if (files.length === 0) {
    console.log("No changed files detected (git diff HEAD).");
    return;
  }
  console.log("Changed files:", files);

  const tsFiles = files.filter((f: string) =>
    [".ts", ".tsx", ".js", ".jsx"].some((ext) => f.endsWith(ext)),
  );
  if (tsFiles.length > 0) {
    console.log("Running eslint on changed files:", tsFiles);
    if (!apply) {
      console.log(
        "Dry-run: eslint --config eslint.config.mts " + tsFiles.join(" "),
      );
    } else {
      await run("npx", [
        "eslint",
        "--config",
        "eslint.config.mts",
        "--fix",
        ...tsFiles,
      ]);
    }
  }

  // type-check only if ts/tsx files changed
  if (tsFiles.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"))) {
    console.log("Running type-check...");
    if (!apply) console.log("Dry-run: tsc --noEmit");
    else await run("npx", ["tsc", "--noEmit"]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
