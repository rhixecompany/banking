#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
const script = path.join(__dirname, "find-process-env.js");

const res = spawnSync(process.execPath, [script, ...args], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, "..", ".."),
});
process.exit(res.status || 0);
