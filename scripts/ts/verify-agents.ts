#!/usr/bin/env node
/**
 * Verifies agent configuration files exist and are well-formed JSON.
 * Replaces the former verify-agents.sh / verify-agents.ps1 wrappers.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { logger } from "@/lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const AGENT_FILES = [".opencode/opencode.json", "AGENTS.md"];

let allOk = true;

for (const rel of AGENT_FILES) {
  const abs = path.join(REPO_ROOT, rel);
  if (!fs.existsSync(abs)) {
    logger.error(`[verify-agents] Missing: ${rel}`);
    allOk = false;
    continue;
  }
  if (rel.endsWith(".json")) {
    try {
      const raw = fs.readFileSync(abs, "utf8");
      JSON.parse(raw);
      logger.info(`[verify-agents] OK: ${rel}`);
    } catch (e) {
      logger.error(
        `[verify-agents] Invalid JSON in ${rel}: ${e instanceof Error ? e.message : String(e)}`,
      );
      allOk = false;
    }
  } else {
    const stat = fs.statSync(abs);
    if (stat.size === 0) {
      logger.error(`[verify-agents] Empty file: ${rel}`);
      allOk = false;
    } else {
      logger.info(`[verify-agents] OK: ${rel}`);
    }
  }
}

if (!allOk) {
  process.exit(1);
}
logger.info("[verify-agents] All agent files verified.");
