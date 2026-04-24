#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/read-secrets.sh
 * CreatedBy: convert-scripts (fixer)
 * TODO: support sourcing into current shell (not possible from Node); provide export output when run standalone
 */
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const arg = process.argv[2];
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
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ENV_FILE = arg || path.join(PROJECT_ROOT, ".envs/production/.env");

if (!fs.existsSync(ENV_FILE)) {
  logger.error(`Error: Environment file not found: ${ENV_FILE}`);
  process.exit(1);
}

logger.info("=== Loading Environment Variables ===");
logger.info(`Source: ${ENV_FILE}`);
logger.info("");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const text = fs.readFileSync(ENV_FILE, "utf8");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const lines = text.split(/\r?\n/);
for (const line of lines) {
  const m = line.match(/^([A-Z_]\w*)\s*=\s*(.*)$/i);
  if (!m) continue;
  const key = m[1];
  let val = m[2].trim();
  val = val.replace(/^['"]?(.*)['"]?$/, "$1");
  // Print export lines so consumers can eval the output
  logger.info(`${key}=${val}`);
}
