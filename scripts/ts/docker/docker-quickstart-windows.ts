#!/usr/bin/env node
/**
 * Description: Interactive Docker Quick Start for Banking Application (Windows-friendly)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Improve PowerShell interop if needed
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

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
 * @returns {*}
 */
function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { shell: true, stdio: "inherit" });
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
 * @param {string} q
 * @returns {*}
 */
function prompt(q: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) =>
    rl.question(q, (a) => {
      rl.close();
      resolve(a);
    }),
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  if (!fileExists(path.join(PROJECT_ROOT, ".envs/local/.env.local"))) {
    // ok - we'll surface errors later
  }

  while (true) {
    console.log("\n=== Banking Application Docker Quick Start ===");
    console.log("1. Start development environment (with Traefik)");
    console.log("2. Start local environment (no Traefik, direct ports)");
    console.log("3. Start with monitoring (Prometheus + Grafana)");
    console.log("4. Stop all containers");
    console.log("5. View application logs");
    console.log("6. Build images");
    console.log("7. Run database migrations");
    console.log("8. Clean up volumes & restart");
    console.log("9. View services status");
    console.log("10. Exit\n");

    const choice = (await prompt("Select option [1-10]: ")).trim();
    switch (choice) {
      case "1":
        run("docker", [
          "compose",
          "-f",
          "docker-compose.yml",
          "--profile",
          "traefik",
          "--env-file",
          ".envs/local/.env.local",
          "up",
          "-d",
        ]);
        break;
      case "2":
        run("docker", [
          "compose",
          "--profile",
          "local",
          "--env-file",
          ".envs/local/.env.local",
          "up",
          "-d",
        ]);
        break;
      case "3":
        run("docker", [
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
        break;
      case "4":
        run("docker", ["compose", "down"]);
        break;
      case "5":
        run("docker", ["compose", "logs", "-f"]);
        break;
      case "6":
        run("docker", ["compose", "build"]);
        break;
      case "7":
        run("docker", [
          "compose",
          "--profile",
          "init",
          "--env-file",
          ".envs/local/.env.local",
          "up",
        ]);
        run("docker", ["compose", "--profile", "init", "down"]);
        break;
      case "8": {
        const c = await prompt(
          "This will remove all containers and volumes. Continue? (yes/no): ",
        );
        if (c === "yes") {
          run("docker", ["compose", "down", "-v"]);
          run("docker", [
            "compose",
            "-f",
            "docker-compose.yml",
            "--profile",
            "traefik",
            "--env-file",
            ".envs/local/.env.local",
            "up",
            "-d",
          ]);
        }
        break;
      }
      case "9":
        run("docker", ["compose", "ps"]);
        run("powershell", [
          "-Command",
          "docker volume ls | Select-String banking -SimpleMatch",
        ]);
        break;
      case "10":
        console.log("Goodbye!");
        process.exit(0);
      default:
        console.error("Invalid option");
    }
    await prompt("Press Enter to continue...");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
