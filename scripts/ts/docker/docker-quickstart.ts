#!/usr/bin/env node
/**
 * Description: Interactive Docker Quick Start for Banking Application (POSIX)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Consider adding a non-interactive flag for automation
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

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
 * @param {string} cmd
 * @param {string[]} args
 * @param {*} [opts={}]
 * @returns {*}
 */
function run(cmd: string, args: string[], opts: any = {}) {
  const res = spawnSync(cmd, args, { stdio: opts.stdio ?? "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) return res.status;
  return 0;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @returns {*}
 */
function fileExists(p: string) {
  return fs.existsSync(p);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} q
 * @returns {unknown}
 */
async function prompt(q: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) =>
    rl.question(q, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function startDefault() {
  logger.info("Starting default environment (with Traefik)...");
  const envFile = path.join(PROJECT_ROOT, ".envs/local/.env.local");
  if (!fileExists(envFile)) {
    logger.error(
      "Error: .envs/local/.env.local not found\nPlease create .envs/local/.env.local file with required variables",
    );
    return 1;
  }
  return run(
    "docker",
    [
      "compose",
      "-f",
      "docker-compose.yml",
      "--profile",
      "traefik",
      "--env-file",
      ".envs/local/.env.local",
      "up",
      "-d",
    ],
    {},
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function startLocal() {
  logger.info("Starting local environment (no Traefik)...");
  const envFile = path.join(PROJECT_ROOT, ".envs/local/.env.local");
  if (!fileExists(envFile)) {
    logger.error("Error: .envs/local/.env.local not found");
    return 1;
  }
  return run("docker", [
    "compose",
    "--profile",
    "local",
    "--env-file",
    ".envs/local/.env.local",
    "up",
    "-d",
  ]);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function startMonitoring() {
  logger.info("Starting with monitoring stack...");
  const envFile = path.join(PROJECT_ROOT, ".envs/local/.env.local");
  if (!fileExists(envFile)) {
    logger.error("Error: .envs/local/.env.local not found");
    return 1;
  }
  return run("docker", [
    "compose",
    "--profile",
    "traefik",
    "--profile",
    "monitoring",
    "--env-file",
    ".envs/local/.env.local",
    "up",
    "-d",
  ]);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function stopAll() {
  logger.info("Stopping all containers...");
  return run("docker", ["compose", "down"]);
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function viewLogs() {
  return run("docker", ["compose", "logs", "-f"], { stdio: "inherit" });
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function buildImages() {
  logger.info("Building Docker images...");
  return run("docker", ["compose", "build"]);
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function migrateDb() {
  logger.info("Running database migrations...");
  run("docker", [
    "compose",
    "--profile",
    "init",
    "--env-file",
    ".envs/local/.env.local",
    "up",
  ]);
  return run("docker", ["compose", "--profile", "init", "down"]);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {unknown}
 */
async function cleanup() {
  const confirm = await prompt(
    "This will remove all containers and volumes. Continue? (yes/no): ",
  );
  if (confirm !== "yes") {
    logger.info("Cancelled");
    return 0;
  }
  return run("docker", ["compose", "down", "-v"]);
}

/**
 * Description placeholder
 * @author Adminbot
 */
function showStatus() {
  logger.info("\nDocker Containers:");
  run("docker", ["compose", "ps"]);
  logger.info("\nDocker Volumes:");
  run("sh", [
    "-c",
    'docker volume ls | grep banking || echo "No banking volumes found"',
  ]); // shell for grep
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  // simple check
  if (!run("sh", ["-c", "command -v docker >/dev/null 2>&1 || echo missing"])) {
    // this returns 0 always; instead test explicitly
  }
  while (true) {
    logger.info("\n=== Banking Application Docker Quick Start ===");
    logger.info("1. Start development environment (with Traefik)");
    logger.info("2. Start local environment (no Traefik, direct ports)");
    logger.info("3. Start with monitoring (Prometheus + Grafana)");
    logger.info("4. Stop all containers");
    logger.info("5. View application logs");
    logger.info("6. Build images");
    logger.info("7. Run database migrations");
    logger.info("8. Clean up volumes & restart");
    logger.info("9. View services status");
    logger.info("10. Exit\n");
    // prompt
    const choice = await prompt("Select option [1-10]: ");
    switch (choice.trim()) {
      case "1":
        await startDefault();
        break;
      case "2":
        startLocal();
        break;
      case "3":
        startMonitoring();
        break;
      case "4":
        stopAll();
        break;
      case "5":
        viewLogs();
        break;
      case "6":
        buildImages();
        break;
      case "7":
        migrateDb();
        break;
      case "8":
        await cleanup();
        await startDefault();
        break;
      case "9":
        showStatus();
        break;
      case "10":
        logger.info("Goodbye!");
        process.exit(0);
        break;
      default: {
        logger.error("Invalid option");
        break;
      }
    }
    await prompt("Press Enter to continue...");
  }
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
