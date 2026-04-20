#!/usr/bin/env ts-node
import { execSync } from "child_process";
import fs from "fs";

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

function main() {
  const git = getGitInfo();
  const files = readFilesArg();
  const now = new Date().toISOString();
  const branch = git ? git.branch : "nogit";
  const commit = git ? git.commit : "nogit";
  console.log(
    `Provenance: read ${files} | branch=${branch} commit=${commit} timestamp=${now}`,
  );
}

main();
