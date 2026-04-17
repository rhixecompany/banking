#!/usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--template") {
      out.template = argv[++i];
    } else if (a === "--tmpfile") {
      out.tmpfile = argv[++i];
    }
  }
  return out;
}

function splitShellWords(s) {
  const re = /"([^"]*)"|'([^']*)'|([^\s"']+)/g;
  const parts = [];
  let m;
  while ((m = re.exec(s)) !== null) {
    parts.push(m[1] || m[2] || m[3]);
  }
  return parts;
}

async function main() {
  const opts = parseArgs();
  if (!opts.template || !opts.tmpfile) {
    console.error(
      'Usage: run-with-args.js --template "<tpl>" --tmpfile <tmpfile>',
    );
    process.exit(2);
  }

  let buf;
  try {
    buf = fs.readFileSync(opts.tmpfile);
  } catch (err) {
    console.error("Failed to read tmpfile", err.message);
    process.exit(2);
  }
  const entries = buf.toString("utf8").split("\0").filter(Boolean);

  // parse template into tokens, replace {path} with entries
  const tokens = splitShellWords(opts.template);
  const final = [];
  for (const t of tokens) {
    if (t === "{path}") {
      for (const e of entries) final.push(e);
    } else {
      final.push(t);
    }
  }

  if (final.length === 0) {
    console.error("No command to run");
    process.exit(2);
  }

  const cmd = final[0];
  const args = final.slice(1);

  const child = spawn(cmd, args, { stdio: "inherit", shell: false });
  child.on("exit", (code, signal) => {
    // attempt to remove tmpfile
    try {
      fs.unlinkSync(opts.tmpfile);
    } catch (e) {}
    if (signal) process.exit(1);
    process.exit(code === null ? 0 : code);
  });
  child.on("error", (err) => {
    console.error("Failed to spawn command:", err.message);
    try {
      fs.unlinkSync(opts.tmpfile);
    } catch (e) {}
    process.exit(2);
  });
}

main();
