#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/build.ps1 (Windows variant)
 * CreatedBy: convert-scripts (fixer)
 * TODO: more faithful PowerShell output coloring
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const SCRIPT_DIR = path.dirname(process.argv[1]);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

function run(cmd: string) {
  const proc = spawnSync(cmd, { stdio: "inherit", shell: true });
  if (proc.error) {
    console.error(proc.error);
    process.exit(1);
  }
  return proc.status ?? 0;
}

const envFileArg = process.argv.find((a) => a.startsWith("--env-file="));
const EnvFile = envFileArg
  ? envFileArg.split("=")[1]
  : ".envs/production/.env.production";
const SkipMigrations = process.argv.includes("--skip-migrations");

console.log("");
console.log("Banking App - Docker Build (Node shim Windows)");

// prerequisites
run("docker --version");
run("docker compose version");

const FullEnvFile = path.join(PROJECT_ROOT, EnvFile.replace(/\//g, path.sep));
if (!fs.existsSync(FullEnvFile)) {
  console.warn(`${EnvFile} not found`);
}

run(
  `docker compose -f docker-compose.yml --env-file ${EnvFile} build --no-cache`,
);

if (!SkipMigrations) {
  run(
    `docker compose -f docker-compose.yml --env-file ${EnvFile} --profile init up`,
  );
  run(
    `docker compose -f docker-compose.yml --env-file ${EnvFile} --profile init down --remove-orphans`,
  );
}

console.log("Build complete!");
