#!/usr/bin/env node
/**
 * Server setup script wrapper
 * Delegates to platform-specific shell scripts via cross-platform spawn
 */
import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "../utils/cli";
import { run } from "../utils/spawn-safe";

function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/server/server-setup.ts [--dry-run | --apply]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  if (opts.dryRun) {
    logger.info("[DRY-RUN] Would run server setup script");
    process.exit(0);
  }

  logger.info("Running server setup...");
  const code = run("bash", ["scripts/server/server-setup.sh"]);
  process.exit(code);
}

main();
