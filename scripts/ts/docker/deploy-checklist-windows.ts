#!/usr/bin/env node
/**
 * Description: Production deployment checklist (Windows-friendly)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Improve PowerShell output coloring
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const SCRIPT_DIR = path.dirname(process.argv[1]);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "../..");

function exists(p: string) {
  return fs.existsSync(p);
}
function read(p: string) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

console.log("=== Docker Production Readiness Checklist ===\n");
const envFile = path.join(PROJECT_ROOT, ".envs/production/.env.production");
if (exists(envFile)) {
  console.log("✓ .envs/production/.env.production found");
  const c = read(envFile);
  if (/CHANGE_ME|yourdomain/.test(c))
    console.log("⚠ WARNING: Contains placeholders - replace before deploying");
  else console.log("✓ .env.production appears to have real values");
} else {
  console.log("✗ .envs/production/.env.production not found");
  console.log("  Run: .\generate-env.ps1");
}

const dockerfile = path.join(PROJECT_ROOT, "compose\dev\node\Dockerfile");
if (exists(dockerfile) && /distroless/.test(read(dockerfile)))
  console.log("✓ Using distroless base image");
if (exists(dockerfile) && /HEALTHCHECK|appuser/.test(read(dockerfile)))
  console.log("✓ Non-root user and HEALTHCHECK defined");

const compose = path.join(PROJECT_ROOT, "docker-compose.yml");
if (exists(compose) && /no-new-privileges/.test(read(compose)))
  console.log("✓ no-new-privileges security option enabled");
if (exists(compose) && /env_file/.test(read(compose)))
  console.log("✓ env_file configuration found");

console.log("\nTesting health check endpoint...");
try {
  const res = spawnSync(
    "powershell",
    [
      "-Command",
      "Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 -Uri 'http://localhost:3000/api/health'",
    ],
    { stdio: "ignore" },
  );
  if (res.status === 0) console.log("✓ Health check endpoint responsive");
  else console.log("ℹ Health check not responding (app may not be running)");
} catch {
  console.log("ℹ Health check skipped");
}

console.log("\nChecking Docker image...");
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
    console.log(`✓ Image size: ${mb}MB`);
  } else {
    console.log(
      "ℹ banking-app:latest not found - build with: docker compose build",
    );
  }
} catch {
  console.log("ℹ docker not available - skip image check");
}

const ht = path.join(PROJECT_ROOT, "compose\traefik\auth\htpasswd");
if (exists(ht)) console.log("✓ htpasswd file exists");
else console.log("⚠ htpasswd not found - run: .\deploy\generate-htpasswd.ps1");

console.log("\n=== Deployment Steps ===");
console.log("1. Generate env file: .\generate-env.ps1");
console.log("2. Edit .envs/production/.env.production with real values");
console.log("3. Generate htpasswd: ..\deploy\generate-htpasswd.ps1");
console.log("4. Build image: docker compose build");
console.log("5. Run migrations: docker compose --profile init up");
console.log("6. Stop migrations: docker compose --profile init down");
console.log("7. Start app: docker compose up -d");
console.log("8. Check health: curl http://localhost:3000/api/health");
console.log("9. View logs: docker compose logs -f");
