#!/usr/bin/env node
/**
 * cleanup-docker.ts - converted from cleanup-docker.sh
 * TODO: Add more interactive prompts parity where needed
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 */
function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

// Check docker available
try {
  run("docker", ["--version"]);
} catch {
  logger.error("Docker not found");
  process.exit(1);
}

logger.info("Current Docker Disk Usage:");
run("docker", ["system", "df"]);

logger.info("Listing items to be cleaned (summary):");
// call shells similar commands
run("bash", ["-c", 'docker images -f "dangling=true" -q | wc -l || true']);
run("bash", ["-c", "docker ps -a -f status=exited -q | wc -l || true"]);
run("bash", ["-c", "docker network ls -f dangling=true -q | wc -l || true"]);

logger.info("Proceed with aggressive Docker cleanup? Type 'yes' to continue");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const input = fs.readFileSync(0, "utf8");
if (input.trim() !== "yes") {
  logger.info("Cancelled.");
  process.exit(0);
}

logger.info("Removing dangling images...");
run("docker", ["image", "prune", "-f"]);
logger.info("Removing stopped containers...");
run("docker", ["container", "prune", "-f"]);
logger.info("Removing unused networks...");
run("docker", ["network", "prune", "-f"]);
logger.info("Removing unused images (aggressive)...");
run("docker", ["image", "prune", "-a", "-f"]);
logger.info("Removing build cache...");
run("docker", ["builder", "prune", "-af"]);

logger.info("Disk usage after cleanup:");
run("docker", ["system", "df"]);

logger.info("Volume cleanup: listing volumes...");
run("docker", ["volume", "ls"]);
logger.info("To remove volumes run: docker volume prune -f");

process.exit(0);
