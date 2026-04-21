#!/usr/bin/env node
/**
 * Description: Production deployment checklist (POSIX)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Optionally return non-zero codes for failing checks
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

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

console.log("=== Docker Production Readiness Checklist ===\n");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const envPath = path.join(PROJECT_ROOT, ".envs/production/.env.production");
if (exists(envPath)) {
  console.log("✓ .envs/production/.env.production found");
  if (grepFile(envPath, /CHANGE_ME|yourdomain/))
    console.log("⚠ WARNING: Contains placeholders - replace before deploying");
  else console.log("✓ .env.production appears to have real values");
} else {
  console.log("✗ .envs/production/.env.production not found");
  console.log("  Run: ./scripts/docker/generate-env.sh");
}

console.log("\nChecking Dockerfile optimizations...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const dockerfile = path.join(PROJECT_ROOT, "compose/dev/node/Dockerfile");
if (grepFile(dockerfile, /distroless/))
  console.log("✓ Using distroless base image");
if (grepFile(dockerfile, /nonroot|appuser/))
  console.log("✓ Non-root user configuration found");
if (grepFile(dockerfile, /HEALTHCHECK/)) console.log("✓ HEALTHCHECK defined");

console.log("\nChecking docker-compose security options...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const composeFile = path.join(PROJECT_ROOT, "docker-compose.yml");
if (grepFile(composeFile, /no-new-privileges/))
  console.log("✓ no-new-privileges security option enabled");
if (grepFile(composeFile, /env_file/))
  console.log("✓ env_file configuration found");

console.log("\nTesting health check endpoint...");
try {
  const curl = spawnSync("curl", ["-s", "http://localhost:3000/api/health"], {
    stdio: "ignore",
  });
  if (curl.status === 0) console.log("✓ Health check endpoint responsive");
  else console.log("ℹ Health check not responding (app may not be running)");
} catch {
  console.log("ℹ curl not found - skipping health check test");
}

console.log("\nChecking Docker image...");
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
      console.log(`✓ Image size: ${mb}MB`);
    } catch {
      console.log("✓ Image found");
    }
  } else {
    console.log(
      "ℹ banking-app:latest not found - build with: docker compose build",
    );
  }
} catch {
  console.log("ℹ docker not available - skip image check");
}

console.log("\nChecking Traefik dashboard authentication...");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const htpasswd = path.join(PROJECT_ROOT, "compose/traefik/auth/htpasswd");
if (exists(htpasswd)) console.log("✓ htpasswd file exists");
else
  console.log(
    "⚠ htpasswd not found - run: ./scripts/deploy/generate-htpasswd.sh",
  );

console.log("\n=== Deployment Steps ===");
console.log("1. Generate env file: ./scripts/docker/generate-env.sh");
console.log("2. Edit .envs/production/.env.production with real values");
console.log("3. Generate htpasswd: ./scripts/deploy/generate-htpasswd.sh");
console.log("4. Build image: docker compose build");
console.log("5. Run migrations: docker compose --profile init up");
console.log("6. Stop migrations: docker compose --profile init down");
console.log("7. Start app: docker compose up -d");
console.log("8. Check health: curl http://localhost:3000/api/health");
console.log("9. View logs: docker compose logs -f");
