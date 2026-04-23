#!/usr/bin/env node

import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Categories}
 */
type Categories = Record<string, string[]>;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @param {string} root
 * @returns {*}
 */
function rel(p: string, root: string) {
  return path.relative(root, p).split(path.sep).join("/");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function isoTs() {
  return new Date().toISOString().replaceAll(":", "");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} p
 * @returns {*}
 */
function isExcluded(p: string) {
  return (
    p.includes("/node_modules/") ||
    p.includes("/.cursor/") ||
    p.includes("/.github/") ||
    p.includes("/.opencode/") ||
    p.includes("/data/")
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} dir
 * @param {(fp: string) => Promise<void>} cb
 * @returns {Promise<void>) => any}
 */
async function walk(dir: string, cb: (fp: string) => Promise<void>) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isExcluded(full)) continue;
    if (e.isDirectory()) await walk(full, cb);
    else if (e.isFile() && full.endsWith(".md")) await cb(full);
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} relPath
 * @returns {("CORE_KEEP" | "DOCKER_KEEP" | "INTEGRATION_KEEP" | "SWARM_DELETE" | "LEGACY_DELETE" | "OTHER_DELETE" | "ORPHANED_DELETE")}
 */
function categorize(relPath: string) {
  if (relPath === "README.md" || relPath === "AGENTS.md") return "CORE_KEEP";
  if (relPath.startsWith("docs/docker/")) return "DOCKER_KEEP";

  const integrationList = new Set([
    "docs/services/plaid-api.md",
    "docs/services/dwolla-api.md",
    "docs/services/react-patterns.md",
    "docs/services/shadcn-studio.md",
    "docs/services/shadcn-ui.md",
    "docs/plaid-quickstart.md",
    "docs/plaid-link.md",
    "docs/plaid-transactions.md",
    "docs/plaid-auth.md",
    "docs/plaid-balance.md",
    "docs/dwolla-context.md",
    "docs/dwolla-send-money.md",
    "docs/dwolla-transfer-between-users.md",
    "docs/react-bits.md",
    "docs/shadcn-ui-intro.md",
    "docs/shadcn.md",
  ]);
  if (relPath.startsWith("docs/plaid/") || integrationList.has(relPath))
    return "INTEGRATION_KEEP";

  if (
    relPath === "docs/docker/swarm-overview.md" ||
    relPath === "docs/traefik/docker-swarm.md"
  )
    return "SWARM_DELETE";

  const legacyList = new Set([
    "00-DOCKER-START-HERE.md",
    "00-START-HERE.md",
    "DOCKER-COMMANDS.md",
    "DOCKER-CONFIG-SUMMARY.md",
    "DOCKER-DEPLOYMENT.md",
    "DOCKER-IMPLEMENTATION.md",
    "DOCKER-INDEX.md",
    "DOCKER-MANIFEST.md",
    "DOCKER-QUICK-START.md",
    "DOCKER-SETUP-CHECKLIST.md",
    "DOCKER-SETUP.md",
    "DOCKER-SUMMARY.md",
    "DOCKERFILE-EXPLANATION.md",
    "DEPLOYMENT-MIGRATION.md",
    "PRODUCTION-DEPLOYMENT.md",
  ]);
  if (legacyList.has(relPath)) return "LEGACY_DELETE";

  const otherRoot = new Set([
    "INDEX.md",
    "QUICK-REFERENCE.md",
    "ARCHITECTURE.md",
    "SECURITY.md",
    "OPTIMIZATION-SUMMARY.md",
    "MARKETPLACE.md",
    "CONTRIBUTING.md",
    "SUPPORT.md",
    "setupTasks.md",
    "blocks.prompts.md",
    "README.opencode.md",
  ]);
  if (otherRoot.has(relPath)) return "OTHER_DELETE";

  if (relPath.startsWith("docs/traefik/")) return "LEGACY_DELETE";
  if (relPath.startsWith("docs/reports/")) return "OTHER_DELETE";

  if (relPath.startsWith("docs/")) {
    if (/^docs\/eslint-plugin-.*-context.md$/.test(relPath))
      return "OTHER_DELETE";
    return "OTHER_DELETE";
  }

  return "ORPHANED_DELETE";
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  try {
    const argv = process.argv.slice(2);
    const opts: any = { dryRun: true };
    for (const a of argv) {
      if (a === "--dry-run") opts.dryRun = true;
      else if (a === "--apply") opts.dryRun = false;
      else if (a.startsWith("--confirm=")) opts.confirm = a.split("=")[1];
      else if (a.startsWith("--action=")) opts.action = a.split("=")[1];
      else if (a.startsWith("--categories=")) opts.categories = a.split("=")[1];
      else if (a === "--help" || a === "-h") {
        logger.info(
          "Usage: --dry-run (default) | --apply --confirm=yes [--action=1|2|3|4] [--categories=ab]",
        );
        return;
      }
    }

    const scriptDir = path.dirname(new URL(import.meta.url).pathname);
    const projectRoot = path.resolve(scriptDir, "..", "..");

    const categories: Categories = {
      CORE_KEEP: [],
      DOCKER_KEEP: [],
      INTEGRATION_KEEP: [],
      LEGACY_DELETE: [],
      ORPHANED_DELETE: [],
      OTHER_DELETE: [],
      SWARM_DELETE: [],
    };

    await walk(projectRoot, async (fp) => {
      const r = rel(fp, projectRoot);
      const cat = categorize(r);
      categories[cat].push(r);
    });

    const counts = Object.fromEntries(
      Object.entries(categories).map(([k, v]) => [k, v.length]),
    ) as Record<string, number>;

    logger.info(
      `Scan complete. Keep: ${counts.CORE_KEEP + counts.DOCKER_KEEP + counts.INTEGRATION_KEEP}  To-review/delete: ${counts.SWARM_DELETE + counts.LEGACY_DELETE + counts.OTHER_DELETE + counts.ORPHANED_DELETE}`,
    );

    logger.info(JSON.stringify({ categories, summary: counts }, null, 2));

    if (!opts.dryRun) {
      if (opts.confirm !== "yes") {
        logger.error("Error: --apply requires --confirm=yes");
        process.exit(2);
      }

      let targets: string[] = [];
      const add = (arr?: string[]) => {
        if (arr) targets.push(...arr);
      };

      const action = opts.action ? Number(opts.action) : 3;
      const catLetters = opts.categories || "";

      if (opts.categories) {
        if (catLetters.includes("a")) add(categories.SWARM_DELETE);
        if (catLetters.includes("b")) add(categories.LEGACY_DELETE);
        if (catLetters.includes("c")) add(categories.OTHER_DELETE);
      } else {
        switch (action) {
          case 1:
            add(categories.SWARM_DELETE);
            break;
          case 2:
            add(categories.LEGACY_DELETE);
            break;
          case 3:
            add(categories.SWARM_DELETE);
            add(categories.LEGACY_DELETE);
            add(categories.OTHER_DELETE);
            break;
          case 4:
            add(categories.SWARM_DELETE);
            add(categories.LEGACY_DELETE);
            add(categories.OTHER_DELETE);
            break;
          default:
            logger.error("Unknown action");
            process.exit(3);
        }
      }

      targets = Array.from(new Set(targets));

      for (const relPath of targets) {
        const abs = path.join(projectRoot, relPath);
        try {
          const bak = `${abs}.bak.${isoTs()}`;
          await fs.promises.copyFile(abs, bak);
          await fs.promises.unlink(abs);
          logger.info(`Deleted: ${relPath} (backup: ${rel(bak, projectRoot)})`);
        } catch (err: any) {
          logger.error(`Failed to delete ${relPath}: ${err.message}`);
          process.exit(4);
        }
      }

      logger.info("Apply complete.");
      process.exit(0);
    }
  } catch (err: any) {
    logger.error("Error:", err?.message ? err.message : err);
    process.exit(1);
  }
}

main();
