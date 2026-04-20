#!/usr/bin/env node
/**
 * generate-htpasswd.ts - Generate htpasswd for Traefik
 * TODO: Add bcrypt-based fallback if openssl missing
 */
import fs from "fs";
import path from "path";
import { parseCli, printDryRunResult } from "../utils/cli";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const AUTH_DIR = path.join(
  SCRIPT_DIR,
  "..",
  "..",
  "compose",
  "traefik",
  "auth",
);
const HTPASSWD_FILE = path.join(AUTH_DIR, "htpasswd");

const cli = parseCli();
const args = cli.args._ as string[];
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin";
const USERNAME = args && args[0] ? args[0] : DEFAULT_USER;
const PASSWORD =
  args && args[1] ? args[1] : process.env.PASSWORD || DEFAULT_PASS;

if (cli.dryRun) {
  printDryRunResult(
    `Would create htpasswd at ${HTPASSWD_FILE} for user ${USERNAME}`,
    { user: USERNAME },
  );
  process.exit(0);
}

fs.mkdirSync(AUTH_DIR, { recursive: true });

try {
  // Prefer system htpasswd or openssl, else use bcryptjs fallback
  const { spawnSync } = await import("child_process");
  if (spawnSync("htpasswd", ["-v"]).status === 0) {
    const proc = spawnSync("htpasswd", ["-Bc", HTPASSWD_FILE, USERNAME], {
      input: PASSWORD + "\n",
      stdio: "pipe",
    } as any);
    if (proc.status !== 0) throw new Error("htpasswd failed");
  } else if (spawnSync("openssl", ["version"]).status === 0) {
    const res = spawnSync("openssl", ["passwd", "-apr1", PASSWORD], {
      encoding: "utf8",
    });
    fs.writeFileSync(HTPASSWD_FILE, `${USERNAME}:${res.stdout}`);
  } else {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(PASSWORD, salt);
    fs.writeFileSync(HTPASSWD_FILE, `${USERNAME}:${hash}\n`, "utf8");
  }
  fs.chmodSync(HTPASSWD_FILE, 0o600);
  console.log(`Created: ${HTPASSWD_FILE}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
