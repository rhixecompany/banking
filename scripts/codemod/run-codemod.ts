#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const script = path.join(ROOT, "scripts", "codemod", "find-process-env.ts");
const args = process.argv.slice(2);

async function main() {
  // Prefer running via npx tsx
  try {
    const res = spawnSync("npx", ["tsx", script, ...args], {
      stdio: "inherit",
    });
    if (res.error) {
      console.error("Failed to execute codemod runner:", res.error);
    }
    if (typeof res.status === "number") process.exitCode = res.status;
    return;
  } catch (err) {
    console.error("Failed to spawn tsx runner:", err);
  }

  // Fallback: dynamic import and call main
  try {
    const mod = await import(script);
    if (mod && typeof mod.main === "function") {
      await mod.main(args);
      return;
    }
    console.error("Codemod module did not export main");
    process.exitCode = 1;
  } catch (err) {
    console.error("Failed to import codemod script:", err);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}
