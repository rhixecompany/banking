#!/usr/bin/env ts-node
import { execSync } from "child_process";
import fs from "fs";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {{ branch: any; commit: any; }}
 */
function getGitInfo() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    const commit = execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return { branch, commit };
  } catch (err) {
    return null;
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {string}
 */
function readFilesArg(): string {
  const args = process.argv.slice(2);
  if (args.length > 0) return args.join(",");
  if (process.env.PROVENANCE_FILES) return process.env.PROVENANCE_FILES;
  // Read from stdin if piped
  try {
    const stat = fs.fstatSync(0);
    if (stat && stat.size > 0) {
      const input = fs.readFileSync(0, "utf8").trim();
      if (input) return input;
    }
  } catch (err) {
    // ignore
  }
  return "<files-not-provided>";
}

/**
 * Description placeholder
 * @author Adminbot
 */
function main() {
  const git = getGitInfo();
  const files = readFilesArg();
  const now = new Date().toISOString();
  const branch = git ? git.branch : "nogit";
  const commit = git ? git.commit : "nogit";
  const line = `Provenance: read ${files} | branch=${branch} commit=${commit} timestamp=${now}`;
  console.log(line);
  // Also write to .beads/provenance.log for traceability
  try {
    fs.mkdirSync(".beads", { recursive: true });
    fs.appendFileSync(".beads/provenance.log", `${line}\n`, "utf8");
  } catch (err) {
    // ignore write failures
  }
}

main();
