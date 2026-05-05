#!/usr/bin/env node
/**
 * Generate self-signed TLS certificates for Traefik
 * Requires OpenSSL installed and available in PATH
 * Supports --dry-run to preview certificate generation
 */
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "../utils/cli";
import { run } from "../utils/spawn-safe";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const CERT_DIR = path.join(
  SCRIPT_DIR,
  "..",
  "..",
  "compose",
  "production",
  "traefik",
  "certs",
);

function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/server/gen-certs.ts [--dry-run | --apply]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  if (opts.dryRun) {
    logger.info("[DRY-RUN] Would generate self-signed TLS certificates:");
    logger.info(`  - CA key: ${path.join(CERT_DIR, "ca.key")}`);
    logger.info(`  - CA cert: ${path.join(CERT_DIR, "ca.crt")}`);
    logger.info(`  - Server key: ${path.join(CERT_DIR, "server.key")}`);
    logger.info(`  - Server cert: ${path.join(CERT_DIR, "server.crt")}`);
    process.exit(0);
  }

  fs.mkdirSync(CERT_DIR, { recursive: true });

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
  } catch {
    // ignore
  }
  try {
    fs.unlinkSync(path.join(CERT_DIR, "ca.key"));
  } catch {
    // ignore
  }
  try {
    fs.unlinkSync(path.join(CERT_DIR, "ca.srl"));
  } catch {
    // ignore
  }

  logger.info(`Certificates generated in ${CERT_DIR}:`);
  logger.info(fs.readdirSync(CERT_DIR).join("\n"));

  process.exit(0);
}

main();
