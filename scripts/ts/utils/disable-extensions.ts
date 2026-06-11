#!/usr/bin/env node
/**
 * Disable specified VS Code extensions in settings.json
 * Supports --dry-run to preview changes and --apply to commit them
 */
import fs from "fs/promises";
import path from "path";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "./cli";

const DISABLED_EXTENSIONS = [
  "github.copilot-chat",
  "eamodio.gitlens",
  "ms-vscode-remote.remote-containers",
  "mhutchie.git-graph",
  "quicktype.quicktype",
  "redis.redis-for-vscode",
  "github.vscode-pull-request-github",
  "github.vscode-github-actions",
  "gruntfuggly.todo-tree",
];

function getSettingsPath(): string {
  const platform = process.platform;
  if (platform === "win32") {
    return path.join(
      process.env.APPDATA || "",
      "Code",
      "User",
      "settings.json",
    );
  }
  if (platform === "darwin") {
    return path.join(
      process.env.HOME || "",
      "Library",
      "Application Support",
      "Code",
      "User",
      "settings.json",
    );
  }
  // default to linux-style
  return path.join(
    process.env.HOME || "",
    ".config",
    "Code",
    "User",
    "settings.json",
  );
}

function isoTimestampForFilename(d: Date): string {
  // ISO-ish without characters invalid in filenames (remove colons)
  return d.toISOString().replaceAll(":", "").slice(0, 19);
}

async function readJsonFile(filePath: string): Promise<any> {
  try {
    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    if (!raw.trim()) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  } catch (err: any) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
      return {};
    }
    throw err;
  }
}

async function writeJsonFile(
  filePath: string,
  obj: any,
  makeBackup: boolean,
): Promise<void> {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // ignore
  }

  let hadExisting = false;
  try {
    await fs.access(filePath);
    hadExisting = true;
  } catch {
    hadExisting = false;
  }

  if (hadExisting && makeBackup) {
    const timestamp = isoTimestampForFilename(new Date());
    const bakName = `${filePath}.bak.${timestamp}`;
    await fs.copyFile(filePath, bakName);
  }

  const content = JSON.stringify(obj, null, 2) + "\n";
  await fs.writeFile(filePath, content, { encoding: "utf8" });
}

async function main(): Promise<number> {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/utils/disable-extensions.ts [--dry-run | --apply] [--verbose]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  const settingsPath = getSettingsPath();

  try {
    const before = await readJsonFile(settingsPath);
    const beforeObj =
      typeof before === "object" && before !== null ? before : {};

    const afterObj: any = { ...beforeObj };
    afterObj["extensions.disabled"] = DISABLED_EXTENSIONS.slice();

    const changed =
      JSON.stringify(beforeObj, Object.keys(beforeObj).sort()) !==
      JSON.stringify(afterObj, Object.keys(afterObj).sort());

    const result = {
      after: afterObj,
      before: beforeObj,
      changed,
      path: settingsPath,
    };

    if (opts.dryRun) {
      logger.info(`${settingsPath}: ${changed ? "would change" : "no change"}`);
      if (opts.verbose) {
        logger.info(JSON.stringify(result, null, 2));
      }
      return 0;
    }

    // apply
    await writeJsonFile(settingsPath, afterObj, true);
    logger.info(`${settingsPath}: ${changed ? "changed" : "no change"}`);
    if (opts.verbose) {
      logger.info(JSON.stringify(result, null, 2));
    }
    return 0;
  } catch (err: any) {
    logger.error("Error:", err?.message ? err.message : String(err));
    if (opts.apply) return 1;
    return 0;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    logger.error("Unhandled error:", err);
    process.exit(1);
  });
