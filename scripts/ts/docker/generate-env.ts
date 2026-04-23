#!/usr/bin/env node
/**
 * Description: Generate secure environment variables for production
 * CreatedBy: convert-scripts (fixer)
 * TODO: Add support for external secrets managers
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCRIPT_DIR = path.dirname(process.argv[1]);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "../..");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} q
 * @returns {*}
 */
function prompt(q: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolve) =>
    rl.question(q, (a) => {
      rl.close();
      resolve(a);
    }),
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {number} len
 * @returns {*}
 */
function randHex(len: number) {
  const r = spawnSync("openssl", ["rand", "-hex", String(len / 2)], {
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error("openssl rand failed");
  return r.stdout.trim();
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {number} bytes
 * @returns {*}
 */
function randBase64(bytes: number) {
  const r = spawnSync("openssl", ["rand", "-base64", String(bytes)], {
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error("openssl rand failed");
  return r.stdout.trim();
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  logger.info("=== Production Environment Generator ===\n");
  const envFile = path.join(PROJECT_ROOT, ".envs/production/.env.production");
  if (fs.existsSync(envFile)) {
    const ans = (
      await prompt(".envs/production/.env.production exists. Overwrite? (y/n) ")
    )
      .trim()
      .toLowerCase();
    if (ans !== "y") {
      logger.info("Aborted.");
      process.exit(1);
    }
  }

  logger.info("Generating secure secrets...\n");
  const ENCRYPTION_KEY = randHex(64);
  const NEXTAUTH_SECRET = randBase64(32);
  const POSTGRES_PASSWORD = randBase64(16);
  const REDIS_PASSWORD = randBase64(16);

  logger.info(
    `Secrets generated:\n  ENCRYPTION_KEY: ${ENCRYPTION_KEY.slice(0, 20)}...\n  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET.slice(0, 20)}...\n`,
  );

  fs.mkdirSync(path.dirname(envFile), { recursive: true });
  const content = `# Production Environment Variables\n# Generated: ${new Date().toString()}\n\nNEXT_PUBLIC_SITE_URL=https://yourdomain.com\n\nDATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/banking\nPOSTGRES_PASSWORD=${POSTGRES_PASSWORD}\nPOSTGRES_DB=banking\n\nENCRYPTION_KEY=${ENCRYPTION_KEY}\nNEXTAUTH_SECRET=${NEXTAUTH_SECRET}\n\nREDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379\nREDIS_PASSWORD=${REDIS_PASSWORD}\n\nNODE_ENV=production\nPORT=3000\nHOSTNAME=0.0.0.0\n\nLETSENCRYPT_EMAIL=admin@yourdomain.com\n\nPLAID_CLIENT_ID=\nPLAID_SECRET=\nPLAID_ENV=sandbox\nPLAID_BASE_URL=https://sandbox.plaid.com\n\nDWOLLA_KEY=\nDWOLLA_SECRET=\nDWOLLA_ENV=sandbox\nDWOLLA_BASE_URL=https://api-sandbox.dwolla.com\n\n`;
  fs.writeFileSync(envFile, content, { encoding: "utf8" });
  logger.info("✓ .envs/production/.env.production generated\n");
  logger.info(
    "⚠ IMPORTANT: Edit .envs/production/.env.production and set your domain and email\n",
  );
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
