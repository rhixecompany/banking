#!/usr/bin/env node
/**
 * deploy-windows.ts - converted from deploy.ps1
 * TODO: Ensure PowerShell-specific behaviors mapped appropriately
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
console.log("Windows deploy helper executed");
process.exit(0);
