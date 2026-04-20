#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/build.sh
 * CreatedBy: convert-scripts (fixer)
 * TODO: replicate full OpenSSL fallbacks on Windows
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const SCRIPT_DIR = path.dirname(process.argv[1]);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

function run(cmd: string, args: string[] = []) {
  const parts = cmd.split(" ");
  const proc = spawnSync(parts[0], parts.slice(1).concat(args), {
    stdio: "inherit",
    shell: false,
  });
  if (proc.error) {
    console.error(proc.error);
    process.exit(1);
  }
  return proc.status ?? 0;
}

const envFileArg = process.argv.find((a) => a.startsWith("--env-file="));
const envFile = envFileArg
  ? envFileArg.split("=")[1]
  : path.join(PROJECT_ROOT, ".envs/production/.env.production");
const skipMigrations = process.argv.includes("--skip-migrations");

console.log("");
console.log("Banking App - Docker Build (Node shim)");

// Check docker
try {
  run("docker --version");
} catch (e) {
  console.error("Docker not found. Please install Docker.");
  process.exit(1);
}

// Check docker compose
try {
  run("docker compose version");
} catch (e) {
  console.error("Docker Compose not found. Please install Docker Compose.");
  process.exit(1);
}

if (!fs.existsSync(envFile)) {
  console.warn(`${envFile} not found`);
  const gen = path.join(PROJECT_ROOT, "generate-env.sh");
  if (fs.existsSync(gen)) {
    run(`bash ${gen}`);
  } else {
    console.error(
      `generate-env.sh not found. Please create ${envFile} manually.`,
    );
    process.exit(1);
  }
}

// Load env file into process.env for this run
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2].replace(/^['\"]?(.*)['\"]?$/, "$1");
    process.env[key] = val;
  }
}

// Auto-generate secrets if placeholders
if (
  !process.env.ENCRYPTION_KEY ||
  process.env.ENCRYPTION_KEY === "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE"
) {
  console.warn(
    "ENCRYPTION_KEY missing or placeholder; auto-generating for dev",
  );
  // attempt openssl
  try {
    const r = spawnSync("openssl", ["rand", "-hex", "32"], {
      encoding: "utf8",
    });
    if (r.status === 0) process.env.ENCRYPTION_KEY = r.stdout.trim();
  } catch {}
}
if (
  !process.env.NEXTAUTH_SECRET ||
  process.env.NEXTAUTH_SECRET === "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE"
) {
  console.warn(
    "NEXTAUTH_SECRET missing or placeholder; auto-generating for dev",
  );
  try {
    const r = spawnSync("openssl", ["rand", "-base64", "32"], {
      encoding: "utf8",
    });
    if (r.status === 0) process.env.NEXTAUTH_SECRET = r.stdout.trim();
  } catch {}
}

console.log("Building Docker image...");
const composeFile = "docker-compose.yml";
const buildArgs = [
  "-f",
  composeFile,
  "--env-file",
  envFile,
  "build",
  "--no-cache",
];
// append build-args
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

run(
  `docker compose ${buildArgs
    .concat(extra)
    .map((s) => (s.includes(" ") ? `"${s}"` : s))
    .join(" ")}`,
);

console.log("");
if (!skipMigrations) {
  console.log("Running database migrations...");
  run(
    `docker compose -f ${composeFile} --env-file ${envFile} --profile init up`,
  );
  run(
    `docker compose -f ${composeFile} --env-file ${envFile} --profile init down --remove-orphans`,
  );
}

console.log("Build complete!");
