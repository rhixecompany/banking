#!/usr/bin/env node
/**
 * gen-certs.ts - Generate self-signed TLS certificates for Traefik
 * TODO: Consider node-forge fallback for environments without openssl
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const CERT_DIR = path.join(
  SCRIPT_DIR,
  "..",
  "compose",
  "production",
  "traefik",
  "certs",
);
fs.mkdirSync(CERT_DIR, { recursive: true });

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 */
function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

logger.info("Generating CA...");
run("openssl", ["genrsa", "-out", path.join(CERT_DIR, "ca.key"), "2048"]);
run("openssl", [
  "req",
  "-new",
  "-x509",
  "-days",
  "365",
  "-key",
  path.join(CERT_DIR, "ca.key"),
  "-out",
  path.join(CERT_DIR, "ca.crt"),
  "-subj",
  "/CN=Banking CA",
]);

logger.info("Generating server key...");
run("openssl", ["genrsa", "-out", path.join(CERT_DIR, "server.key"), "2048"]);

logger.info("Generating server certificate...");
run("openssl", [
  "req",
  "-new",
  "-key",
  path.join(CERT_DIR, "server.key"),
  "-out",
  path.join(CERT_DIR, "server.csr"),
  "-subj",
  "/CN=banking.example.com",
]);
run("openssl", [
  "x509",
  "-req",
  "-days",
  "365",
  "-in",
  path.join(CERT_DIR, "server.csr"),
  "-CA",
  path.join(CERT_DIR, "ca.crt"),
  "-CAkey",
  path.join(CERT_DIR, "ca.key"),
  "-CAcreateserial",
  "-out",
  path.join(CERT_DIR, "server.crt"),
]);

try {
  fs.unlinkSync(path.join(CERT_DIR, "server.csr"));
} catch {}
try {
  fs.unlinkSync(path.join(CERT_DIR, "ca.key"));
} catch {}
try {
  fs.unlinkSync(path.join(CERT_DIR, "ca.srl"));
} catch {}

logger.info(`Certificates generated in ${CERT_DIR}:`);
logger.info(fs.readdirSync(CERT_DIR).join("\n"));

process.exit(0);
