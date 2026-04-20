#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";

const program = new Command();

program
  .description(
    "Opencode MCP runner: discover and reconcile MCP servers (dry-run first)",
  )
  .option("--dry-run", "Print planned changes without applying them")
  .option(
    "--manifest <path>",
    "Path to mcp servers manifest",
    ".opencode/mcp_servers.json",
  )
  .option(
    "--backup-dir <path>",
    "Backup directory for manifests",
    ".opencode/backups",
  )
  .parse(process.argv);

const opts = program.opts();

async function readManifest(manifestPath: string) {
  try {
    const content = await fs.promises.readFile(manifestPath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return { servers: [] };
  }
}

async function writeManifest(
  manifestPath: string,
  data: any,
  dryRun = true,
  backupDir = ".opencode/backups",
) {
  const abs = path.resolve(manifestPath);
  const backupDirAbs = path.resolve(backupDir);
  await fs.promises.mkdir(backupDirAbs, { recursive: true });
  const backupPath = path.join(
    backupDirAbs,
    `${path.basename(manifestPath)}.backup-${Date.now()}.json`,
  );
  try {
    if (fs.existsSync(abs)) {
      await fs.promises.copyFile(abs, backupPath);
      console.log(`Backed up ${manifestPath} to ${backupPath}`);
    }
  } catch (err) {
    console.warn("Backup failed:", err);
  }

  if (dryRun) {
    console.log("[dry-run] would write manifest to:", manifestPath);
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  await fs.promises.writeFile(abs, JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote manifest ${manifestPath}`);
}

// Placeholder: discovery implementation should invoke docker mcp CLI or other discovery methods.
async function discoverMcpServers(): Promise<
  Array<{ name: string; sha?: string; metadata?: any }>
> {
  // For now we return an empty list — implementation will call docker CLI and parse output.
  return [];
}

async function main() {
  const manifestPath = opts.manifest;
  const dryRun = !!opts.dryRun;

  console.log(`Running mcp-runner (dryRun=${dryRun})`);
  const discovered = await discoverMcpServers();
  console.log(`Discovered ${discovered.length} MCP servers`);

  const manifest = await readManifest(manifestPath);
  const existing = manifest.servers ?? [];

  // Simple reconciliation: list names present and missing
  const existingNames = new Set(existing.map((s: any) => s.name));
  const discoveredNames = new Set(discovered.map((s) => s.name));

  const toAdd = discovered.filter((s) => !existingNames.has(s.name));
  const toRemove = existing.filter((s: any) => !discoveredNames.has(s.name));

  console.log(`toAdd: ${toAdd.length}, toRemove: ${toRemove.length}`);

  const newManifest = {
    ...manifest,
    servers: existing
      .filter((s: any) => discoveredNames.has(s.name))
      .concat(toAdd),
  };

  await writeManifest(manifestPath, newManifest, dryRun, opts.backupDir);

  if (!dryRun) {
    console.log("Manifest reconciled and written.");
  } else {
    console.log("Dry run completed. No changes applied.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
