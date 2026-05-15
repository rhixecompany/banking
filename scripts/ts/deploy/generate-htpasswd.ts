#!/usr/bin/env node
/**
 * Generate htpasswd file for Traefik basic auth
 * Uses system htpasswd, OpenSSL, or bcryptjs fallback
 */
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "../utils/cli";
import { run } from "../utils/spawn-safe";

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

const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin";

function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/deploy/generate-htpasswd.ts [username] [password] [--dry-run | --apply]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  const username = opts.args._[0] ?? DEFAULT_USER;
  const password = opts.args._[1] ?? process.env.PASSWORD ?? DEFAULT_PASS;

  if (opts.dryRun) {
    logger.info(
      `[DRY-RUN] Would create htpasswd at ${HTPASSWD_FILE} for user ${username}`,
    );
    process.exit(0);
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });

  try {
    // Try system htpasswd first
    const htpasswdStatus = run("htpasswd", ["-v"], {
      exitOnError: false,
    });
    if (htpasswdStatus === 0) {
      logger.info("Using system htpasswd...");
      run("htpasswd", ["-Bc", HTPASSWD_FILE, username], {
        exitOnError: false,
      });
      logger.info(`Created: ${HTPASSWD_FILE}`);
      fs.chmodSync(HTPASSWD_FILE, 0o600);
      process.exit(0);
    }

    // Try OpenSSL
    const opensslStatus = run("openssl", ["version"], {
      exitOnError: false,
    });
    if (opensslStatus === 0) {
      logger.info("Using openssl...");
      const tempFile = `${HTPASSWD_FILE}.tmp`;
      fs.writeFileSync(tempFile, password);
      const result = run("openssl", ["passwd", "-apr1", "-in", tempFile], {
        exitOnError: false,
      });
      fs.unlinkSync(tempFile);
      if (result === 0) {
        fs.writeFileSync(HTPASSWD_FILE, `${username}:${password}\n`);
        fs.chmodSync(HTPASSWD_FILE, 0o600);
        logger.info(`Created: ${HTPASSWD_FILE}`);
        process.exit(0);
      }
    }

    // Fallback to bcryptjs
    logger.info("Using bcryptjs fallback...");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    fs.writeFileSync(HTPASSWD_FILE, `${username}:${hash}\n`, "utf8");
    fs.chmodSync(HTPASSWD_FILE, 0o600);
    logger.info(`Created: ${HTPASSWD_FILE}`);
  } catch (err) {
    logger.error("Error:", err);
    process.exit(1);
  }
}

main();
