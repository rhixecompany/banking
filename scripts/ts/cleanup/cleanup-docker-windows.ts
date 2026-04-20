#!/usr/bin/env node
/**
 * cleanup-docker-windows.ts - converted from cleanup-docker.ps1
 * TODO: Validate read-host style prompts on Windows
 */
import { spawnSync } from "child_process";
import path from "path";
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

run("docker", ["--version"]);
run("docker", ["system", "df"]);
run("docker", ["images", "-f", "dangling=true", "-q"]);
run("docker", ["ps", "-a", "-f", "status=exited", "-q"]);
run("docker", ["network", "ls", "-f", "dangling=true", "-q"]);

console.log("Windows variant: to prune volumes run: docker volume prune -f");
process.exit(0);
