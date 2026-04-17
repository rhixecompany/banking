#!/usr/bin/env -S node
/* eslint-disable security/detect-non-literal-fs-filename */
import { spawn } from "child_process";
import fs from "fs";

function parseArgs() {
  const argv = process.argv.slice(2);
  const out: { template?: string; tmpfile?: string } = {};
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

function splitShellWords(s: string) {
  const re = /"([^"]*)"|'([^']*)'|([^\s"']+)/g;
  const parts: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    parts.push(m[1] || m[2] || m[3]);
  }
  return parts;
}

async function main() {
  const opts = parseArgs();
  if (!opts.template || !opts.tmpfile) {
    console.error(
      'Usage: run-with-args.ts --template "<tpl>" --tmpfile <tmpfile>',
    );
    process.exit(2);
  }

  let buf: Buffer;
  try {
    buf = fs.readFileSync(opts.tmpfile);
  } catch (err: any) {
    console.error("Failed to read tmpfile", err?.message ?? String(err));
    process.exit(2);
  }
  const entries = buf.toString("utf8").split("\0").filter(Boolean);

  const tokens = splitShellWords(opts.template);
  const final: string[] = [];
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

  const child = spawn(cmd, args, { shell: false, stdio: "inherit" });
  child.on("exit", (code, signal) => {
    try {
      if (opts.tmpfile) fs.unlinkSync(opts.tmpfile);
    } catch (e) {
      // ignore
    }
    if (signal) process.exit(1);
    process.exit(code === null ? 0 : code);
  });
  child.on("error", (err: any) => {
    console.error("Failed to spawn command:", err?.message ?? String(err));
    try {
      if (opts.tmpfile) fs.unlinkSync(opts.tmpfile);
    } catch (e) {
      // ignore
    }
    process.exit(2);
  });
}

main().catch((err) => {
  console.error(
    "Unhandled error in run-with-args:",
    err?.message ?? String(err),
  );
  process.exit(2);
});
