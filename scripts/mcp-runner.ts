#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  diffLists,
  generateHelper,
  mergeCatalog,
  parseDockerPsOutput,
  parseGatewayOutput,
  readCatalog,
  rollbackRestore,
  runValidations,
  writeCatalog,
} from "./mcp-runner-lib";

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("dry-run", { type: "boolean", default: true })
    .option("apply", { type: "boolean", default: false })
    .option("prune", { type: "boolean", default: false })
    .option("force", { type: "boolean", default: false })
    .option("rollback", { type: "boolean", default: false })
    .option("backup", { type: "string", default: "" })
    .option("helpers-dir", { type: "string", default: ".opencode/mcp-helpers" })
    .option("catalog-path", {
      type: "string",
      default: ".opencode/mcp_servers.json",
    })
    .option("verbose", { type: "boolean", default: false })
    .option("list", { type: "boolean", default: false })
    .option("verify-only", { type: "boolean", default: false }).argv;

  const catalogPath = path.resolve(argv["catalog-path"] as string);
  const helpersDir = path.resolve(argv["helpers-dir"] as string);

  if (!fs.existsSync(catalogPath)) {
    console.error("Catalog not found:", catalogPath);
    process.exit(2);
  }

  const existing = readCatalog(catalogPath);

  if (argv["list"]) {
    // Print newline-separated server names
    for (const s of existing) console.log(s);
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
  } catch (e: any) {
    if (argv.verbose)
      console.warn("gateway discovery failed, falling back to docker ps");
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
      if (argv.verbose) console.warn("docker ps failed: ", e?.message ?? e);
    }
  }

  const merged = mergeCatalog(existing, discoveryRecords);
  const d = diffLists(existing, merged);

  if (argv["verify-only"]) {
    const discoveredOnly = discoveryRecords.map((r) => r.name);
    const diff = diffLists(existing, discoveredOnly);
    console.log(JSON.stringify(diff, null, 2));
    process.exit(diff.added.length || diff.removed.length ? 2 : 0);
  }

  console.log("Dry-run: proposed changes:");
  console.log(JSON.stringify(d, null, 2));

  if (!argv.apply) {
    console.log("Run with --apply to make changes (default is dry-run)");
    return;
  }

  // Rollback path (if requested)
  if (argv["rollback"]) {
    const backupPath = argv["backup"] as string;
    if (!backupPath) {
      console.error("--rollback requires --backup <path>");
      process.exit(2);
    }
    try {
      const res = rollbackRestore(backupPath, catalogPath);
      console.log("Restored backup:", backupPath, "->", catalogPath);
      // run validations after restore
      const validationCommands = [
        { name: "format", cmd: "npm run format" },
        { name: "type-check", cmd: "npm run type-check" },
        { name: "lint-strict", cmd: "npm run lint:strict" },
        { name: "verify-rules", cmd: "npm run verify:rules" },
        { name: "test-browser", cmd: "npm run test:browser" },
      ];
      const valResults = runValidations(validationCommands, {
        timeout: 10 * 60 * 1000,
      });
      console.log(
        "Post-restore validations:",
        JSON.stringify(valResults, null, 2),
      );
      process.exit(0);
    } catch (err: any) {
      console.error("Rollback failed:", err?.message ?? String(err));
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
      console.log("Aborted by user");
      return;
    }
  } else {
    // If running non-interactive force, require RUN_MCP_FORCE env flag
    if (!process.env.RUN_MCP_FORCE || process.env.RUN_MCP_FORCE !== "true") {
      console.error(
        "Non-interactive --force requires environment variable RUN_MCP_FORCE=true",
      );
      process.exit(3);
    }
  }

  console.log("Applying changes...");

  // Prepare audit artifact
  const audit: any = {
    timestamp: new Date().toISOString().replace(/[:.]/g, ""),
    commands: {
      gateway: gatewayOut ? gatewayOut.slice(0, 20000) : null,
      dockerPs: dockerPsOut ? dockerPsOut.slice(0, 20000) : null,
    },
    flags: argv,
    files: { written: [], backups: [] },
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
    { name: "format", cmd: "npm run format" },
    { name: "type-check", cmd: "npm run type-check" },
    { name: "lint-strict", cmd: "npm run lint:strict" },
    { name: "verify-rules", cmd: "npm run verify:rules" },
    { name: "test-browser", cmd: "npm run test:browser" },
  ];

  const valResults = runValidations(validationCommands, {
    timeout: 10 * 60 * 1000,
  });
  audit.validations.push(...valResults);
  for (const v of valResults) {
    if (argv.verbose) console.log(`${v.name} ${v.ok ? "passed" : "failed"}`);
    if (!v.ok) console.error(`${v.name} failed (see audit)`);
  }

  // Save audit file
  const auditDir = path.resolve(".opencode/mcp-audit");
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });
  const auditPath = path.join(
    auditDir,
    `mcp-runner-apply-${audit.timestamp}.json`,
  );
  fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");
  console.log("Wrote audit artifact:", auditPath);

  // Prune backups older than 365 days by default (no-op if none)
  try {
    const pruned = pruneBackups(path.dirname(catalogPath), 365);
    if (pruned.length && argv.verbose) console.log("Pruned backups:", pruned);
  } catch (e) {
    if (argv.verbose) console.warn("Prune backups failed:", e?.message ?? e);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
