#!/usr/bin/env node
/**
 * Description: Diagnose common git issues and optionally fix index.lock and run `git add -A`.
 * CreatedBy: convert-scripts (fixer batch 1)
 * TODO: add more heuristics and tests
 */
import { spawnSync } from "child_process";
import fs from "fs";
import readline from "readline";

function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  return r.status ?? 0;
}

function capture(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return {
    code: r.status ?? 0,
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? "",
  };
}

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

async function main() {
  // Check git availability
  const which = capture(process.platform === "win32" ? "where" : "which", [
    "git",
  ]);
  if (which.code !== 0) {
    console.error("git not found in PATH");
    process.exit(1);
  }

  // Show porcelain status
  const status = capture("git", ["status", "--porcelain"]);
  console.log("git status --porcelain output:\n", status.stdout);

  // Detect index.lock
  const lockPath = ".git/index.lock";
  if (fs.existsSync(lockPath)) {
    console.log("Detected .git/index.lock");
    // Find running git processes on Windows via tasklist
    let running = false;
    if (process.platform === "win32") {
      const t = capture("tasklist", []);
      running = /git/i.test(t.stdout + t.stderr);
    } else {
      const t = capture("ps", ["-ef"]);
      running = /git/i.test(t.stdout + t.stderr);
    }
    if (running) {
      console.log(
        "Found running git-related processes; recommend closing them before removing index.lock",
      );
    }
    const ok = await promptYesNo("Remove .git/index.lock now?");
    if (ok) {
      try {
        fs.unlinkSync(lockPath);
        console.log("Removed .git/index.lock");
      } catch (err) {
        console.error("Failed to remove lock:", err);
        process.exit(2);
      }
    }
  }

  // Attempt git add -A
  const add = spawnSync("git", ["add", "-A"], { encoding: "utf8" });
  if (add.stdout) process.stdout.write(add.stdout);
  if (add.stderr) process.stderr.write(add.stderr);
  const code = add.status ?? 0;
  if (code !== 0) {
    console.error(
      "git add failed. Suggestions:\n - Check for locked index or file permissions.\n - Run 'git status' to inspect changes.\n - Try removing .git/index.lock if safe.",
    );
  }
  process.exit(code);
}

if (require.main === module)
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
