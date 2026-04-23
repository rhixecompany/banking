#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { logger } from "@/lib/logger";

import {
  diffLists,
  generateHelper,
  mergeCatalog,
  parseDockerPsOutput,
  parseGatewayOutput,
  pruneBackups,
  readCatalog,
  rollbackRestore,
  runValidations,
  writeCatalog,
} from "./mcp-runner-lib";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
export async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("dry-run", { default: true, type: "boolean" })
    .option("apply", { default: false, type: "boolean" })
    .option("prune", { default: false, type: "boolean" })
    .option("force", { default: false, type: "boolean" })
    .option("rollback", { default: false, type: "boolean" })
    .option("backup", { default: "", type: "string" })
    .option("helpers-dir", { default: ".opencode/mcp-helpers", type: "string" })
    .option("catalog-path", {
      default: ".opencode/mcp_servers.json",
      type: "string",
    })
    .option("verbose", { default: false, type: "boolean" })
    .option("list", { default: false, type: "boolean" })
    .option("verify-only", { default: false, type: "boolean" }).argv;

  const catalogPath = path.resolve(argv["catalog-path"] as string);
  const helpersDir = path.resolve(argv["helpers-dir"] as string);

  if (!fs.existsSync(catalogPath)) {
    logger.error("Catalog not found:", catalogPath);
    process.exit(2);
  }

  const existing = readCatalog(catalogPath);

  if (argv["list"]) {
    // Print newline-separated server names
    for (const s of existing) logger.info(s);
    process.exit(0);
  }

  // --verify-only handled after discoveryRecords are collected

  // Attempt gateway discovery first, capture outputs for audit
  let gatewayOut = "";
  let dockerPsOut = "";
  const discoveryRecords = [] as any[];
  try {
    gatewayOut = execSync("docker mcp gateway run --profile adminbot", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (gatewayOut) {
      const r = parseGatewayOutput(gatewayOut);
      discoveryRecords.push(...r);
    }
  } catch {
    if (argv.verbose)
      logger.warn("gateway discovery failed, falling back to docker ps");
  }

  if (discoveryRecords.length === 0) {
    try {
      dockerPsOut = execSync("docker ps --format '{{.Names}}'", {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      if (dockerPsOut) {
        const r = parseDockerPsOutput(dockerPsOut);
        discoveryRecords.push(...r);
      }
    } catch (e: any) {
      if (argv.verbose) logger.warn("docker ps failed: ", e?.message ?? e);
    }
  }

  const merged = mergeCatalog(existing, discoveryRecords);
  const d = diffLists(existing, merged);

  if (argv["verify-only"]) {
    const discoveredOnly = discoveryRecords.map((r) => r.name);
    const diff = diffLists(existing, discoveredOnly);
    logger.info(JSON.stringify(diff, null, 2));
    process.exit(diff.added.length || diff.removed.length ? 2 : 0);
  }

  logger.warn("Dry-run: proposed changes:");
  logger.warn(JSON.stringify(d, null, 2));

  if (!argv.apply) {
    logger.info("Run with --apply to make changes (default is dry-run)");
    return;
  }

  // Rollback path (if requested)
  if (argv["rollback"]) {
    const backupPath = argv["backup"] as string;
    if (!backupPath) {
      logger.error("--rollback requires --backup <path>");
      process.exit(2);
    }
    try {
      const res = rollbackRestore(backupPath, catalogPath);
      logger.info("Restored backup:", backupPath, "->", catalogPath);
      // run validations after restore
      const validationCommands = [
        { cmd: "npm run format", name: "format" },
        { cmd: "npm run type-check", name: "type-check" },
        { cmd: "npm run lint:strict", name: "lint-strict" },
        { cmd: "npm run verify:rules", name: "verify-rules" },
        { cmd: "npm run test:browser", name: "test-browser" },
      ];
      const valResults = runValidations(validationCommands, {
        timeout: 10 * 60 * 1000,
      });
      logger.info(
        "Post-restore validations:",
        JSON.stringify(valResults, null, 2),
      );
      process.exit(0);
    } catch (err: any) {
      logger.error("Rollback failed:", err?.message ?? String(err));
      process.exit(1);
    }
  }

  // Interactive confirmation unless --force
  if (!argv.force) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await new Promise<string>((res) =>
      rl.question("Type APPLY to confirm writing changes: ", (ans: string) => {
        rl.close();
        res(ans);
      }),
    );
    if (answer.trim() !== "APPLY") {
      logger.info("Aborted by user");
      return;
    }
  } else {
    // If running non-interactive force, require RUN_MCP_FORCE env flag
    if (!process.env.RUN_MCP_FORCE || process.env.RUN_MCP_FORCE !== "true") {
      logger.error(
        "Non-interactive --force requires environment variable RUN_MCP_FORCE=true",
      );
      process.exit(3);
    }
  }

  logger.warn("Applying changes...");

  // Prepare audit artifact
  const audit: any = {
    commands: {
      dockerPs: dockerPsOut ? dockerPsOut.slice(0, 20000) : null,
      gateway: gatewayOut ? gatewayOut.slice(0, 20000) : null,
    },
    files: { backups: [], written: [] },
    flags: argv,
    timestamp: new Date().toISOString().replaceAll(/[:.]/g, ""),
    validations: [],
  };

  // Write catalog (backup created by writeCatalog)
  const backup = writeCatalog(catalogPath, merged);
  audit.files.backups.push(backup);

  // Generate helpers
  for (const s of merged) {
    const out = generateHelper(s, helpersDir);
    if (out.written) audit.files.written.push(out.path);
  }

  // Run post-apply validations using helper
  const validationCommands = [
    { cmd: "npm run format", name: "format" },
    { cmd: "npm run type-check", name: "type-check" },
    { cmd: "npm run lint:strict", name: "lint-strict" },
    { cmd: "npm run verify:rules", name: "verify-rules" },
    { cmd: "npm run test:browser", name: "test-browser" },
  ];

  const valResults = runValidations(validationCommands, {
    timeout: 10 * 60 * 1000,
  });
  audit.validations.push(...valResults);
  for (const v of valResults) {
    if (argv.verbose) logger.info(`${v.name} ${v.ok ? "passed" : "failed"}`);
    if (!v.ok) logger.error(`${v.name} failed (see audit)`);
  }

  // Save audit file
  const auditDir = path.resolve(".opencode/mcp-audit");
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
  const auditPath = path.join(
    auditDir,
    `mcp-runner-apply-${audit.timestamp}.json`,
  );
  fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");
  logger.info("Wrote audit artifact:", auditPath);

  // Prune backups older than 365 days by default (no-op if none)
  try {
    const pruned = pruneBackups(path.dirname(catalogPath), 365);
    if (pruned.length && argv.verbose) logger.info("Pruned backups:", pruned);
  } catch (e) {
    if (argv.verbose)
      logger.warn("Prune backups failed:", (e as any)?.message ?? e);
  }
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
