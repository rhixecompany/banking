#!/usr/bin/env node
/**
 * generate-htpasswd-windows.ts - Windows variant
 */
import fs from "fs";
import path from "path";
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
const AUTH_DIR = path.join(SCRIPT_DIR, "compose", "traefik", "auth");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const HTPASSWD_FILE = path.join(AUTH_DIR, "htpasswd");
fs.mkdirSync(AUTH_DIR, { recursive: true });
console.log(
  "Windows: please install openssl or htpasswd and run generate-htpasswd.ts",
);
process.exit(0);
