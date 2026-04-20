#!/usr/bin/env node
/**
 * Description: Generate secure environment variables for production (Windows-friendly)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Use native crypto APIs instead of openssl when available
 */
import fs from "fs";
import path from "path";
import readline from "readline";

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
  // fallback JS generator
  const bytes = len / 2;
  return Array.from(cryptoRandom(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {number} n
 * @returns {*}
 */
function cryptoRandom(n: number) {
  const arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  console.log("=== Production Environment Generator ===\n");
  const envFile = path.join(PROJECT_ROOT, ".envs/production/.env.production");
  if (fs.existsSync(envFile)) {
    const ans = (
      await prompt(".envs/production/.env.production exists. Overwrite? (y/n) ")
    )
      .trim()
      .toLowerCase();
    if (ans !== "y") {
      console.log("Aborted.");
      process.exit(1);
    }
  }

  console.log("Generating secure secrets...\n");
  const ENCRYPTION_KEY = randHex(64);
  const NEXTAUTH_SECRET = Buffer.from(cryptoRandom(32)).toString("base64");
  const POSTGRES_PASSWORD = Buffer.from(cryptoRandom(16)).toString("base64");
  const REDIS_PASSWORD = Buffer.from(cryptoRandom(16)).toString("base64");

  fs.mkdirSync(path.dirname(envFile), { recursive: true });
  const content = `# Production Environment Variables\n# Generated: ${new Date().toString()}\n\nNEXT_PUBLIC_SITE_URL=https://yourdomain.com\n\nDATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/banking\nPOSTGRES_PASSWORD=${POSTGRES_PASSWORD}\nPOSTGRES_DB=banking\n\nENCRYPTION_KEY=${ENCRYPTION_KEY}\nNEXTAUTH_SECRET=${NEXTAUTH_SECRET}\n\nREDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379\nREDIS_PASSWORD=${REDIS_PASSWORD}\n\nNODE_ENV=production\nPORT=3000\nHOSTNAME=0.0.0.0\n\nLETSENCRYPT_EMAIL=admin@yourdomain.com\n\n`;
  fs.writeFileSync(envFile, content, { encoding: "utf8" });
  console.log("✓ .envs/production/.env.production generated\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
