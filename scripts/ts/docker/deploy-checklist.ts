#!/usr/bin/env node
/**
 * Description: Production deployment checklist (POSIX)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Optionally return non-zero codes for failing checks
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
 * @param {RegExp} pattern
 * @returns {*}
 */
function grepFile(p: string, pattern: RegExp) {
  if (!exists(p)) return false;
  try {
    const s = fs.readFileSync(p, "utf8");
    return pattern.test(s);
  } catch {
    return false;
  }
}

logger.info("=== Docker Production Readiness Checklist ===\n");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const envPath = path.join(PROJECT_ROOT, ".envs/production/.env.production");
if (exists(envPath)) {
  logger.info("✓ .envs/production/.env.production found");
  if (grepFile(envPath, /CHANGE_ME|yourdomain/))
    logger.info("⚠ WARNING: Contains placeholders - replace before deploying");
  else logger.info("✓ .env.production appears to have real values");
} else {
  logger.info("✗ .envs/production/.env.production not found");
  logger.info("  Run: ./scripts/docker/generate-env.sh");
}

logger.info("\nChecking Dockerfile optimizations...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const dockerfile = path.join(PROJECT_ROOT, "compose/dev/node/Dockerfile");
if (grepFile(dockerfile, /distroless/))
  logger.info("✓ Using distroless base image");
if (grepFile(dockerfile, /nonroot|appuser/))
  logger.info("✓ Non-root user configuration found");
if (grepFile(dockerfile, /HEALTHCHECK/)) logger.info("✓ HEALTHCHECK defined");

logger.info("\nChecking docker-compose security options...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const composeFile = path.join(PROJECT_ROOT, "docker-compose.yml");
if (grepFile(composeFile, /no-new-privileges/))
  logger.info("✓ no-new-privileges security option enabled");
if (grepFile(composeFile, /env_file/))
  logger.info("✓ env_file configuration found");

logger.info("\nTesting health check endpoint...");
try {
  const curl = spawnSync("curl", ["-s", "http://localhost:3000/api/health"], {
    stdio: "ignore",
  });
  if (curl.status === 0) logger.info("✓ Health check endpoint responsive");
  else logger.info("ℹ Health check not responding (app may not be running)");
} catch {
  logger.info("ℹ curl not found - skipping health check test");
}

logger.info("\nChecking Docker image...");
try {
  const inspect = spawnSync(
    "docker",
    ["image", "inspect", "banking-app:latest"],
    { encoding: "utf8" },
  );
  if (inspect.status === 0 && inspect.stdout) {
    try {
      const json = JSON.parse(inspect.stdout);
      const size = json[0]?.Size ?? 0;
      const mb = Math.round(size / 1024 / 1024);
      logger.info(`✓ Image size: ${mb}MB`);
    } catch {
      logger.info("✓ Image found");
    }
  } else {
    logger.info(
      "ℹ banking-app:latest not found - build with: docker compose build",
    );
  }
} catch {
  logger.info("ℹ docker not available - skip image check");
}

logger.info("\nChecking Traefik dashboard authentication...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const htpasswd = path.join(PROJECT_ROOT, "compose/traefik/auth/htpasswd");
if (exists(htpasswd)) logger.info("✓ htpasswd file exists");
else
  logger.info(
    "⚠ htpasswd not found - run: ./scripts/deploy/generate-htpasswd.sh",
  );

logger.info("\n=== Deployment Steps ===");
logger.info("1. Generate env file: ./scripts/docker/generate-env.sh");
logger.info("2. Edit .envs/production/.env.production with real values");
logger.info("3. Generate htpasswd: ./scripts/deploy/generate-htpasswd.sh");
logger.info("4. Build image: docker compose build");
logger.info("5. Run migrations: docker compose --profile init up");
logger.info("6. Stop migrations: docker compose --profile init down");
logger.info("7. Start app: docker compose up -d");
logger.info("8. Check health: curl http://localhost:3000/api/health");
logger.info("9. View logs: docker compose logs -f");
