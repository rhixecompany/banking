#!/usr/bin/env node
/**
 * Diagnose common git issues and optionally fix index.lock and run `git add -A`
 * Supports --dry-run (default) to preview, --apply to make changes
 */
import fs from "fs";
import readline from "readline";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "./utils/cli";
import { capture } from "./utils/spawn-safe";

function promptYesNo(question: string): Promise<boolean> {
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

async function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/diagnose-and-fix-git.ts [--dry-run | --apply] [--verbose]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  // Check git availability
  const which = capture(process.platform === "win32" ? "where" : "which", [
    "git",
  ]);
  if (which.code !== 0) {
    logger.error("git not found in PATH");
    process.exit(1);
  }

  // Show porcelain status
  const status = capture("git", ["status", "--porcelain"]);
  logger.info("git status --porcelain output:");
  logger.info(status.stdout);

  // Detect index.lock
  const lockPath = ".git/index.lock";
  if (fs.existsSync(lockPath)) {
    logger.info("Detected .git/index.lock");

    // Find running git processes
    let running = false;
    if (process.platform === "win32") {
      const t = capture("tasklist", []);
      running = /git/i.test(t.stdout + t.stderr);
    } else {
      const t = capture("ps", ["-ef"]);
      running = /git/i.test(t.stdout + t.stderr);
    }

    if (running) {
      logger.info(
        "Found running git-related processes; recommend closing them before removing index.lock",
      );
    }

    if (opts.apply) {
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
    } else if (opts.dryRun) {
      logger.info("[DRY-RUN] Would remove .git/index.lock if prompted");
    }
  }

  // Attempt git add -A
  if (opts.dryRun) {
    logger.info("[DRY-RUN] Would run: git add -A");
    process.exit(0);
  }

  const add = capture("git", ["add", "-A"]);
  if (add.stdout) process.stdout.write(add.stdout);
  if (add.stderr) process.stderr.write(add.stderr);

  if (add.code !== 0) {
    logger.error(
      "git add failed. Suggestions:\n - Check for locked index or file permissions.\n - Run 'git status' to inspect changes.\n - Try removing .git/index.lock if safe.",
    );
  }
  process.exit(add.code);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
