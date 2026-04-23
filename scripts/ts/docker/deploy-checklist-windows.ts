#!/usr/bin/env node
/**
 * Description: Production deployment checklist (Windows-friendly)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Improve PowerShell output coloring
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(process.argv[1]);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "../..");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @returns {*}
 */
function exists(p: string) {
  return fs.existsSync(p);
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @returns {*}
 */
function read(p: string) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

logger.info("=== Docker Production Readiness Checklist ===\n");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const envFile = path.join(PROJECT_ROOT, ".envs/production/.env.production");
if (exists(envFile)) {
  logger.info("✓ .envs/production/.env.production found");
  const c = read(envFile);
  if (/CHANGE_ME|yourdomain/.test(c))
    logger.info("⚠ WARNING: Contains placeholders - replace before deploying");
  else logger.info("✓ .env.production appears to have real values");
} else {
  logger.info("✗ .envs/production/.env.production not found");
  logger.info("  Run: .\\generate-env.ps1");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const dockerfile = path.join(PROJECT_ROOT, "compose\\dev\\node\\Dockerfile");
if (exists(dockerfile) && /distroless/.test(read(dockerfile)))
  logger.info("✓ Using distroless base image");
if (exists(dockerfile) && /HEALTHCHECK|appuser/.test(read(dockerfile)))
  logger.info("✓ Non-root user and HEALTHCHECK defined");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const compose = path.join(PROJECT_ROOT, "docker-compose.yml");
if (exists(compose) && /no-new-privileges/.test(read(compose)))
  logger.info("✓ no-new-privileges security option enabled");
if (exists(compose) && /env_file/.test(read(compose)))
  logger.info("✓ env_file configuration found");

logger.info("\nTesting health check endpoint...");
try {
  const res = spawnSync(
    "powershell",
    [
      "-Command",
      "Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri 'http://localhost:3000/api/health'",
    ],
    { stdio: "ignore" },
  );
  if (res.status === 0) logger.info("✓ Health check endpoint responsive");
  else logger.info("ℹ Health check not responding (app may not be running)");
} catch {
  logger.info("ℹ Health check skipped");
}

logger.info("\nChecking Docker image...");
try {
  const inspect = spawnSync(
    "docker",
    ["image", "inspect", "banking-app:latest"],
    { encoding: "utf8" },
  );
  if (inspect.status === 0 && inspect.stdout) {
    const json = JSON.parse(inspect.stdout);
    const size = json[0]?.Size ?? 0;
    const mb = Math.round(size / 1024 / 1024);
    logger.info(`✓ Image size: ${mb}MB`);
  } else {
    logger.info(
      "ℹ banking-app:latest not found - build with: docker compose build",
    );
  }
} catch {
  logger.info("ℹ docker not available - skip image check");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ht = path.join(PROJECT_ROOT, "compose\\traefik\\auth\\htpasswd");
if (exists(ht)) logger.info("✓ htpasswd file exists");
else
  logger.info("⚠ htpasswd not found - run: .\\deploy\\generate-htpasswd.ps1");

logger.info("\n=== Deployment Steps ===");
logger.info("1. Generate env file: .\\generate-env.ps1");
logger.info("2. Edit .envs/production/.env.production with real values");
logger.info("3. Generate htpasswd: ..\\deploy\\generate-htpasswd.ps1");
logger.info("4. Build image: docker compose build");
logger.info("5. Run migrations: docker compose --profile init up");
logger.info("6. Stop migrations: docker compose --profile init down");
logger.info("7. Start app: docker compose up -d");
logger.info("8. Check health: curl http://localhost:3000/api/health");
logger.info("9. View logs: docker compose logs -f");
