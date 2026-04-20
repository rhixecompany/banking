#!/usr/bin/env node
/**
 * Description: Entrypoint for runtime build-and-run container. Installs deps, builds standalone Next and starts server.
 * CreatedBy: convert-scripts (fixer)
 * TODO: Add more robust error handling and logging if needed
 */
import { spawnSync } from "child_process";

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

try {
  console.log("[entrypoint] Installing dependencies (production)...");
  // Ensure node_modules can be created by the app user; best-effort
  run("mkdir", ["-p", "/app/node_modules", "/home/app/.npm"]);
  // chown may fail in some environments - ignore non-zero exit
  try {
    spawnSync(
      "chown",
      ["-R", "app:app", "/app/node_modules", "/home/app/.npm"],
      { stdio: "inherit" },
    );
  } catch (e) {
    // ignore
  }

  run("npm", [
    "ci",
    "--production",
    "--legacy-peer-deps",
    "--no-audit",
    "--progress=false",
  ]);

  console.log("[entrypoint] Building Next.js standalone output...");
  run("npm", ["run", "build:standalone"]);

  console.log("[entrypoint] Starting standalone server");
  // Replace current process with node server.js
  const res = spawnSync("node", ["server.js"], { stdio: "inherit" });
  if (res.error) throw res.error;
  process.exit(res.status ?? 0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
