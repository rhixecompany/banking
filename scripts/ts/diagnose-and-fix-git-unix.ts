#!/usr/bin/env node
/**
 * Description: Diagnose common git issues and optionally fix index.lock and run `git add -A` on Unix-like systems.
 * CreatedBy: convert-scripts (fixer batch 1)
 * TODO: add macOS-specific checks
 */
import { spawnSync } from "child_process";
import fs from "fs";
import readline from "readline";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 * @returns {{ code: any; stdout: any; stderr: any; }}
 */
function capture(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return {
    code: r.status ?? 0,
    stderr: r.stderr ?? "",
    stdout: r.stdout ?? "",
  };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} question
 * @returns {unknown}
 */
async function promptYesNo(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<boolean>((resolve) => {
    rl.question(question + " (y/N): ", (ans) => {
      rl.close();
      resolve(/^y(es)?$/i.test(ans.trim()));
    });
  });
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const which = capture("which", ["git"]);
  if (which.code !== 0) {
    logger.error("git not found in PATH");
    process.exit(1);
  }

  const status = capture("git", ["status", "--porcelain"]);
  logger.info("git status --porcelain output:\n", status.stdout);

  const lockPath = ".git/index.lock";
  if (fs.existsSync(lockPath)) {
    logger.info("Detected .git/index.lock");
    // Try ps to find Git processes; fallback to pgrep if available
    let running = false;
    const ps = capture("ps", ["-ef"]);
    if (ps.code === 0) {
      running = /git/i.test(ps.stdout + ps.stderr);
    } else {
      const pg = capture("pgrep", ["-a", "git"]);
      running = pg.code === 0 && pg.stdout.trim().length > 0;
    }
    if (running)
      logger.info(
        "Found running git-related processes; recommend closing them before removing index.lock",
      );
    const ok = await promptYesNo("Remove .git/index.lock now?");
    if (ok) {
      try {
        fs.unlinkSync(lockPath);
        logger.info("Removed .git/index.lock");
      } catch (err) {
        logger.error("Failed to remove lock:", err);
        process.exit(2);
      }
    }
  }

  const add = spawnSync("git", ["add", "-A"], { encoding: "utf8" });
  if (add.stdout) process.stdout.write(add.stdout);
  if (add.stderr) process.stderr.write(add.stderr);
  const code = add.status ?? 0;
  if (code !== 0) {
    logger.error(
      "git add failed. Suggestions:\n - Check for locked index or file permissions.\n - Run 'git status' to inspect changes.\n - Try removing .git/index.lock if safe.",
    );
  }
  process.exit(code);
}

if (require.main === module)
  main().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
