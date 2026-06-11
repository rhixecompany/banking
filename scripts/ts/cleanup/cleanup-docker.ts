#!/usr/bin/env node
/**
 * Clean up Docker resources: images, containers, networks, volumes, and build cache
 * Supports --dry-run to preview what would be removed
 */
import fs from "fs";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "../utils/cli";
import { run } from "../utils/spawn-safe";

function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/cleanup/cleanup-docker.ts [--dry-run | --apply] [--verbose]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  // Check docker available
  const checkStatus = run("docker", ["--version"], { exitOnError: false });
  if (checkStatus !== 0) {
    logger.error("Docker not found or not running");
    process.exit(1);
  }

  logger.info("Current Docker Disk Usage:");
  run("docker", ["system", "df"]);

  logger.info("Items to be cleaned:");
  run("docker", ["images", "-f", "dangling=true", "-q"]);
  run("docker", ["ps", "-a", "-f", "status=exited", "-q"]);
  run("docker", ["network", "ls", "-f", "dangling=true", "-q"]);

  if (opts.dryRun) {
    logger.info(
      "[DRY-RUN] Would remove: dangling images, exited containers, unused networks, all images, build cache",
    );
    process.exit(0);
  }

  logger.info("Proceed with aggressive Docker cleanup? Type 'yes' to continue");
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
  logger.info("To remove orphaned volumes, run: docker volume prune -f");

  process.exit(0);
}

main();
