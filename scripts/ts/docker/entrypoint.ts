#!/usr/bin/env node
/**
 * Description: Entrypoint for runtime build-and-run container. Installs deps, builds standalone Next and starts server.
 * CreatedBy: convert-scripts (fixer)
 * TODO: Add more robust error handling and logging if needed
 */
import { spawnSync } from "child_process";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 */
function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

try {
  logger.info("[entrypoint] Installing dependencies (production)...");
  // Ensure node_modules can be created by the app user; best-effort
  run("mkdir", ["-p", "/app/node_modules", "/home/app/.npm"]);
  // chown may fail in some environments - ignore non-zero exit
  try {
    spawnSync(
      "chown",
      ["-R", "app:app", "/app/node_modules", "/home/app/.npm"],
      { stdio: "inherit" },
    );
  } catch {
    // ignore
  }

  run("npm", [
    "ci",
    "--production",
    "--legacy-peer-deps",
    "--no-audit",
    "--progress=false",
  ]);

  logger.info("[entrypoint] Building Next.js standalone output...");
  run("npm", ["run", "build:standalone"]);

  logger.info("[entrypoint] Starting standalone server");
  // Replace current process with node server.js
  const res = spawnSync("node", ["server.js"], { stdio: "inherit" });
  if (res.error) throw res.error;
  process.exit(res.status ?? 0);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
