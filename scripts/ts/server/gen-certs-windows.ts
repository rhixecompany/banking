#!/usr/bin/env node
/**
 * gen-certs-windows.ts - Windows variant of gen-certs.ps1
 */
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
const CERT_DIR = path.join(
  SCRIPT_DIR,
  "..",
  "compose",
  "production",
  "traefik",
  "certs",
);
console.log("Windows: ensure OpenSSL is available and run gen-certs.ts");
process.exit(0);
