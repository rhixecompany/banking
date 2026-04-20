#!/usr/bin/env node
/**
 * generate-htpasswd.ts - Generate htpasswd for Traefik
 * TODO: Add bcrypt-based fallback if openssl missing
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const AUTH_DIR = path.join(SCRIPT_DIR, "compose", "traefik", "auth");
const HTPASSWD_FILE = path.join(AUTH_DIR, "htpasswd");

const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin";
const USERNAME = process.argv[2] || DEFAULT_USER;
const PASSWORD = process.argv[3] || process.env.PASSWORD || DEFAULT_PASS;

fs.mkdirSync(AUTH_DIR, { recursive: true });

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.error) throw res.error;
  return res;
}

try {
  if (spawnSync("htpasswd", ["-v"]).status === 0) {
    // system htpasswd exists
    const proc = spawnSync("htpasswd", ["-Bc", HTPASSWD_FILE, USERNAME], {
      input: PASSWORD + "\n",
      stdio: "pipe",
    });
    if (proc.status !== 0) throw new Error("htpasswd failed");
  } else if (spawnSync("openssl", ["version"]).status === 0) {
    const res = run("openssl", ["passwd", "-apr1", PASSWORD]);
    fs.writeFileSync(HTPASSWD_FILE, `${USERNAME}:${res.stdout}`);
  } else {
    console.error(
      "Neither htpasswd nor openssl found. Install apache2-utils or openssl.",
    );
    process.exit(1);
  }
  fs.chmodSync(HTPASSWD_FILE, 0o600);
  console.log(`Created: ${HTPASSWD_FILE}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
