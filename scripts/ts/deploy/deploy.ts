#!/usr/bin/env node
/**
 * Deployment orchestrator - supports both Unix and Windows
 * Builds Docker image, runs migrations, and starts application
 */
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";
import { run } from "../utils/spawn-safe";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

logger.info("Banking App - Production Deployment Workflow");

// Verify docker
try {
  run("docker", ["--version"]);
} catch {
  logger.error("Docker not found. Please install Docker.");
  process.exit(1);
}

// Generate htpasswd if missing
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
    run("bunx", [
      "tsx",
      path.join(SCRIPT_DIR, "generate-htpasswd.ts"),
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
// Simple sleep loop
for (let i = 0; i < 60; i++) {
  const res = run("curl", ["-s", "http://localhost:3000/api/health"], {
    exitOnError: false,
  });
  if (res === 0) {
    logger.info("Services healthy");
    break;
  }
  // Sleep 1 second
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
}

logger.info("Deployment complete");
process.exit(0);
