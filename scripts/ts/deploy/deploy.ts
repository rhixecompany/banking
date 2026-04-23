#!/usr/bin/env node
/**
 * deploy.ts - converted from deploy.sh
 * TODO: preserve interactive choices and prompts where necessary
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {{ cwd?: string }} [opts={}]
 */
function run(cmd: string, args: string[], opts: { cwd?: string } = {}) {
  const res = spawnSync(cmd, args, { cwd: opts.cwd, stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");

logger.info("Banking App - Production Deployment Workflow");

// Verify docker
try {
  run("docker", ["--version"]);
} catch {
  logger.error("Docker not found. Please install Docker.");
  process.exit(1);
}

// Generate htpasswd if missing
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const htpath = path.join(
  PROJECT_ROOT,
  "compose",
  "traefik",
  "auth",
  "htpasswd",
);
if (!fs.existsSync(htpath)) {
  logger.info("Creating htpasswd file...");
  try {
    run("bash", [
      path.join(SCRIPT_DIR, "generate-htpasswd.sh"),
      "admin",
      process.env.TRAEFIK_PASSWORD || "admin",
    ]);
  } catch {
    logger.warn("Could not create htpasswd. Create it manually.");
  }
} else {
  logger.info("htpasswd already exists");
}

// Verify env
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ENV_FILE = path.join(
  PROJECT_ROOT,
  ".envs",
  "production",
  ".env.production",
);
if (!fs.existsSync(ENV_FILE)) {
  logger.error(`${ENV_FILE} not found`);
  process.exit(1);
}

logger.info("Building Docker image...");
run(
  "docker",
  [
    "compose",
    "-f",
    "docker-compose.yml",
    "--env-file",
    ENV_FILE,
    "build",
    "--no-cache",
  ],
  { cwd: PROJECT_ROOT },
);

logger.info("Running migrations (profile init)...");
run(
  "docker",
  [
    "compose",
    "-f",
    "docker-compose.yml",
    "--env-file",
    ENV_FILE,
    "--profile",
    "init",
    "up",
  ],
  { cwd: PROJECT_ROOT },
);
run(
  "docker",
  [
    "compose",
    "-f",
    "docker-compose.yml",
    "--env-file",
    ENV_FILE,
    "--profile",
    "init",
    "down",
    "--remove-orphans",
  ],
  { cwd: PROJECT_ROOT },
);

logger.info("Starting application...");
run(
  "docker",
  ["compose", "-f", "docker-compose.yml", "--env-file", ENV_FILE, "up", "-d"],
  { cwd: PROJECT_ROOT },
);

logger.info("Waiting for health check on http://localhost:3000/api/health");
// simple sleep loop
for (let i = 0; i < 60; i++) {
  const res = spawnSync("curl", ["-s", "http://localhost:3000/api/health"]);
  if (res.status === 0) {
    logger.info("Services healthy");
    break;
  }
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
}

logger.info("Deployment complete");
process.exit(0);
