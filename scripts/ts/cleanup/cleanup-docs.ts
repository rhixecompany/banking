#!/usr/bin/env node
/**
 * Clean up orphaned and deprecated documentation files
 * Supports --dry-run (default) to preview changes and --apply to commit them
 */
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "../utils/cli";

type Categories = Record<string, string[]>;

function rel(p: string, root: string) {
  return path.relative(root, p).split(path.sep).join("/");
}

function isoTs() {
  return new Date().toISOString().replaceAll(":", "");
}

function isExcluded(p: string) {
  return (
    p.includes("/node_modules/") ||
    p.includes("/.cursor/") ||
    p.includes("/.github/") ||
    p.includes("/.opencode/") ||
    p.includes("/data/")
  );
}

async function walk(dir: string, cb: (fp: string) => Promise<void>) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isExcluded(full)) continue;
    if (e.isDirectory()) await walk(full, cb);
    else if (e.isFile() && full.endsWith(".md")) await cb(full);
  }
}

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

async function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/cleanup/cleanup-docs.ts [--dry-run | --apply] [--verbose]",
    );
    logger.info("  --dry-run     Preview changes (default)");
    logger.info("  --apply       Delete files (requires --confirm=yes)");
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

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

  const keepCount =
    counts.CORE_KEEP + counts.DOCKER_KEEP + counts.INTEGRATION_KEEP;
  const deleteCount =
    counts.SWARM_DELETE +
    counts.LEGACY_DELETE +
    counts.OTHER_DELETE +
    counts.ORPHANED_DELETE;

  logger.info(`Scan complete. Keep: ${keepCount}  To-delete: ${deleteCount}`);

  if (opts.verbose) {
    logger.info(JSON.stringify({ categories, summary: counts }, null, 2));
  }

  if (!opts.apply) {
    process.exit(0);
  }

  // Apply mode requires explicit --confirm=yes
  if (opts.confirm !== "yes") {
    logger.error("Error: --apply requires --confirm=yes");
    process.exit(2);
  }

  const targets = [
    ...categories.SWARM_DELETE,
    ...categories.LEGACY_DELETE,
    ...categories.OTHER_DELETE,
    ...categories.ORPHANED_DELETE,
  ];

  let deletedCount = 0;
  for (const relPath of targets) {
    const abs = path.join(projectRoot, relPath);
    try {
      const bak = `${abs}.bak.${isoTs()}`;
      await fs.promises.copyFile(abs, bak);
      await fs.promises.unlink(abs);
      deletedCount++;
      if (opts.verbose) {
        logger.info(`Deleted: ${relPath} (backup: ${rel(bak, projectRoot)})`);
      }
    } catch (err: any) {
      logger.error(`Failed to delete ${relPath}: ${err.message}`);
      process.exit(4);
    }
  }

  logger.info(`Deleted ${deletedCount} files. Apply complete.`);
  process.exit(0);
}

main().catch((err) => {
  logger.error("Error:", err?.message ? err.message : err);
  process.exit(1);
});
