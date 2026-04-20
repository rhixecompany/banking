#!/usr/bin/env node
const { spawnSync } = require("child_process");
const fs = require("fs");

function runGit(cmd) {
  try {
    const r = spawnSync("git", cmd.split(" "), { encoding: "utf8" });
    if (r.status !== 0) return null;
    return r.stdout.trim();
  } catch {
    return null;
  }
}

let branch = runGit("rev-parse --abbrev-ref HEAD");
let commit = runGit("rev-parse --short HEAD");
if (!branch || !commit) {
  const ts = new Date().toISOString();
  branch = "nogit";
  commit = ts;
}

// determine files list
let filesArg = process.argv.slice(2).join(" ").trim();
if (!filesArg) {
  // try env
  filesArg = process.env.PROVENANCE_FILES || "";
}

function readStdinSync() {
  try {
    const stat = fs.fstatSync(0);
    if (stat.size > 0) {
      return fs.readFileSync(0, "utf8").trim();
    }
  } catch (e) {
    // ignore
  }
  return "";
}

if (!filesArg) {
  const piped = readStdinSync();
  if (piped) filesArg = piped;
}

if (!filesArg) filesArg = "unknown-files";

const iso = new Date().toISOString();
console.log(
  `Provenance: read ${filesArg} | branch=${branch} commit=${commit} timestamp=${iso}`,
);
process.exit(0);
