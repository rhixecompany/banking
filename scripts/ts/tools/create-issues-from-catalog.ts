#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs/promises";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const path =
    process.argv[2] || ".opencode/reports/init-enhanced-issue-catalog.json";
  const data = JSON.parse(await fs.readFile(path, "utf8"));
  for (const issue of data.issues || []) {
    const title =
      issue.title || `${issue.component}: ${issue.message.slice(0, 80)}`;
    const body = `File: ${issue.file}\nLine: ${issue.line}\nSeverity: ${issue.severity}\n\nSuggested fix:\n${issue.suggested_fix || "See description"}`;
    logger.info("Creating issue:", title);
    const cmd = `gh issue create --title "${escape(title)}" --body "${escape(body)}" --label "area:${escape(issue.component || "docs")}"`;
    try {
      execSync(cmd, { stdio: "inherit" });
    } catch (err) {
      logger.error("Failed to create issue for", title, err);
    }
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} s
 * @returns {*}
 */
function escape(s: string) {
  return s.replaceAll('"', '\\"');
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
