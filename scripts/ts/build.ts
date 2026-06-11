#!/usr/bin/env node
/**
 * Docker build orchestrator - supports both Unix and Windows
 * Builds Docker image with environment configuration and runs migrations
 */
import { spawnSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";
import { run } from "./utils/spawn-safe";

const SCRIPT_DIR = path.dirname(process.argv[1]);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");

const envFileArg = process.argv.find((a) => a.startsWith("--env-file="));
const envFile = envFileArg
  ? envFileArg.split("=")[1]
  : path.join(PROJECT_ROOT, ".envs/production/.env.production");
const skipMigrations = process.argv.includes("--skip-migrations");

logger.info("");
logger.info("Banking App - Docker Build");

// Check docker
try {
  run("docker", ["--version"]);
} catch {
  logger.error("Docker not found. Please install Docker.");
  process.exit(1);
}

// Check docker compose
try {
  run("docker", ["compose", "version"]);
} catch {
  logger.error("Docker Compose not found. Please install Docker Compose.");
  process.exit(1);
}

if (!fs.existsSync(envFile)) {
  logger.warn(`${envFile} not found`);
  const genEnvScript = path.join(PROJECT_ROOT, "generate-env.ts");
  if (fs.existsSync(genEnvScript)) {
    run("bunx", ["tsx", genEnvScript]);
  } else {
    logger.error(
      `generate-env.ts not found. Please create ${envFile} manually.`,
    );
    process.exit(1);
  }
}

// Load env file into process.env for this run
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]\w*)\s*=(.*)$/i);
    if (!m) continue;
    const key = m[1];
    const val = m[2].replaceAll(/^['"]?|['"]?$/g, "");
    process.env[key] = val;
  }
}

// Auto-generate secrets if placeholders
if (
  !process.env.ENCRYPTION_KEY ||
  process.env.ENCRYPTION_KEY === "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE"
) {
  logger.warn("ENCRYPTION_KEY missing or placeholder; auto-generating for dev");
  // Attempt openssl, fall back to crypto
  try {
    const r = spawnSync("openssl", ["rand", "-hex", "32"], {
      encoding: "utf8",
    });
    if (r.status === 0) {
      process.env.ENCRYPTION_KEY = r.stdout.trim();
    }
  } catch {
    // Use crypto.randomBytes as fallback
    process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
  }
}
if (
  !process.env.NEXTAUTH_SECRET ||
  process.env.NEXTAUTH_SECRET === "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE"
) {
  logger.warn(
    "NEXTAUTH_SECRET missing or placeholder; auto-generating for dev",
  );
  try {
    const r = spawnSync("openssl", ["rand", "-base64", "32"], {
      encoding: "utf8",
    });
    if (r.status === 0) {
      process.env.NEXTAUTH_SECRET = r.stdout.trim();
    }
  } catch {
    // Use crypto.randomBytes as fallback
    process.env.NEXTAUTH_SECRET = crypto.randomBytes(32).toString("base64");
  }
}

logger.info("Building Docker image...");
const composeFile = "docker-compose.yml";
const buildArgs = [
  "-f",
  composeFile,
  "--env-file",
  envFile,
  "build",
  "--no-cache",
];

const extra: string[] = [];
if (process.env.NEXT_PUBLIC_SITE_URL)
  extra.push(
    "--build-arg",
    `NEXT_PUBLIC_SITE_URL=${process.env.NEXT_PUBLIC_SITE_URL}`,
  );
if (process.env.DATABASE_URL)
  extra.push("--build-arg", `DATABASE_URL=${process.env.DATABASE_URL}`);
if (process.env.ENCRYPTION_KEY)
  extra.push("--build-arg", `ENCRYPTION_KEY=${process.env.ENCRYPTION_KEY}`);
if (process.env.NEXTAUTH_SECRET)
  extra.push("--build-arg", `NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET}`);

run("docker", ["compose", ...buildArgs, ...extra]);

logger.info("");
if (!skipMigrations) {
  logger.info("Running database migrations...");
  run("docker", [
    "compose",
    "-f",
    composeFile,
    "--env-file",
    envFile,
    "--profile",
    "init",
    "up",
  ]);
  run("docker", [
    "compose",
    "-f",
    composeFile,
    "--env-file",
    envFile,
    "--profile",
    "init",
    "down",
    "--remove-orphans",
  ]);
}

logger.info("Build complete!");
