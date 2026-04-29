#!/usr/bin/env node
/**
 * OpenCode Plugin Verifier
 * Validates that plugins in project config match runtime plugins
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

interface VerifyReport {
  ok: boolean;
  projectConfig: string;
  runtimeConfig: string;
  expectedCount: number;
  runtimeCount: number;
  missing: string[];
  extras: string[];
  projectDuplicates: string[];
  runtimeDuplicates: string[];
}

const REPO_ROOT = path.resolve(__dirname, "..");
const PROJECT_CONFIG = process.env.PROJECT_CONFIG || path.join(REPO_ROOT, "aiconfig.json");
const REPORT_DIR = process.env.REPORT_DIR || path.join(REPO_ROOT, ".opencode/reports");

const RAW_REPORT = path.join(REPORT_DIR, "opencode-debug-config.raw.txt");
const RUNTIME_REPORT = path.join(REPORT_DIR, "opencode-debug-config.runtime.json");
const VERIFY_REPORT = path.join(REPORT_DIR, "opencode-plugin-verify.json");

function log(msg: string): void {
  console.log(`[opencode-plugin-verify] ${msg}`);
}

function fail(msg: string): void {
  console.error(`[opencode-plugin-verify] ERROR: ${msg}`);
  process.exit(1);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runCommand(cmd: string, args: string[]): string {
  const result = spawnSync(cmd, args, { encoding: "utf-8" });
  if (result.error) throw result.error;
  return result.stdout;
}

function extractJsonFromRaw(raw: string): object {
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error("Could not locate JSON payload in raw output");
  }
  return JSON.parse(raw.slice(start));
}

function pluginKey(spec: string): string {
  if (typeof spec !== "string") return String(spec);
  if (spec.startsWith("github:")) return spec;
  if (!spec.includes("@")) return spec;
  if (spec.startsWith("@")) {
    const slashIndex = spec.indexOf("/");
    const versionIndex = spec.indexOf("@", slashIndex + 1);
    return versionIndex === -1 ? spec : spec.slice(0, versionIndex);
  }
  return spec.slice(0, spec.lastIndexOf("@"));
}

function dedupe(plugins: string[]): string[] {
  const dedupedReversed: string[] = [];
  const seen = new Set<string>();
  for (let index = plugins.length - 1; index >= 0; index--) {
    const spec = plugins[index];
    const key = pluginKey(spec);
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedReversed.push(spec);
  }
  return dedupedReversed.reverse();
}

function findDuplicates(plugins: string[]): string[] {
  const counts = new Map<string, number>();
  for (const plugin of plugins) {
    const key = pluginKey(plugin);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
}

async function main(): Promise<void> {
  // Check required commands
  try {
    spawnSync("node", ["--version"], { stdio: "ignore" });
  } catch {
    fail("Missing required command: node");
  }

  try {
    spawnSync("opencode", ["--version"], { stdio: "ignore" });
  } catch {
    fail("Missing required command: opencode");
  }

  // Check project config exists
  if (!fs.existsSync(PROJECT_CONFIG)) {
    fail(`Project config not found: ${PROJECT_CONFIG}`);
  }

  ensureDir(REPORT_DIR);

  log("Running opencode debug config");
  const rawOutput = runCommand("opencode", ["debug", "config"]);
  fs.writeFileSync(RAW_REPORT, rawOutput);

  // Extract runtime config from raw output
  const runtimeConfig = extractJsonFromRaw(rawOutput);
  fs.writeFileSync(RUNTIME_REPORT, JSON.stringify(runtimeConfig, null, 2));

  // Load and compare configs
  const projectConfig = JSON.parse(fs.readFileSync(PROJECT_CONFIG, "utf-8"));
  const runtimeConfigData = JSON.parse(fs.readFileSync(RUNTIME_REPORT, "utf-8"));

  const projectPlugins = Array.isArray(projectConfig.plugin) ? projectConfig.plugin : [];
  const runtimePlugins = Array.isArray(runtimeConfigData.plugin) ? runtimeConfigData.plugin : [];

  const expected = dedupe(projectPlugins);
  const runtime = dedupe(runtimePlugins);

  const missing = expected.filter((p) => !runtime.includes(p));
  const extras = runtime.filter((p) => !expected.includes(p));
  const projectDuplicates = findDuplicates(projectPlugins);
  const runtimeDuplicates = findDuplicates(runtimePlugins);

  const ok = missing.length === 0 && projectDuplicates.length === 0 && runtimeDuplicates.length === 0;

  const summary: VerifyReport = {
    ok,
    projectConfig: PROJECT_CONFIG,
    runtimeConfig: RUNTIME_REPORT,
    expectedCount: expected.length,
    runtimeCount: runtime.length,
    missing,
    extras,
    projectDuplicates,
    runtimeDuplicates,
  };

  fs.writeFileSync(VERIFY_REPORT, JSON.stringify(summary, null, 2));

  log(`Verification summary written to ${VERIFY_REPORT}`);
  console.log(JSON.stringify(summary, null, 2));

  if (!ok) {
    process.exit(1);
  }

  log("Verification passed");
  log(`Raw debug output: ${RAW_REPORT}`);
  log(`Normalized runtime config: ${RUNTIME_REPORT}`);
  log(`Verification report: ${VERIFY_REPORT}`);
}

main();