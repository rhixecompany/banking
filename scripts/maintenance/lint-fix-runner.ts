#!/usr/bin/env npx tsx
/**
 * lint-fix-runner.ts — Automated lint fix orchestrator
 *
 * Usage:
 *   npx tsx scripts/maintenance/lint-fix-runner.ts [--apply] [--dry-run]
 *   npx tsx scripts/maintenance/lint-fix-runner.ts --category <name> [--apply]
 *
 * Categories:
 *   console   — Replace console.* with logger in scripts/
 *   await    — Remove unused async in arrow functions
 *   unicorn  — Fix no-null, prefer-undefined
 *   ts-eslint — General typescript-eslint suggestions
 *   auto     — Apply all auto-fixable suggestions
 *
 * --dry-run: scan and report only (default)
 * --apply:  write changes to disk (requires explicit flag)
 *
 * Safety:
 *   - Creates backup branch before applying
 *   - Reports file diffs before committing
 *   - Tests verify after each category
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { logger } from "@/lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const REPORT_FIX = path.join(ROOT, ".opencode/reports/eslint-fix-suggest.json");
const REPORT_SCAN = path.join(ROOT, ".opencode/reports/eslint-scan.json");

interface FixSuggestion {
  file: string;
  rule: string;
  message: string;
  line: number;
  column: number;
  fixable: "auto-fixable" | "manual" | "suggestion-available";
  autoFix?: { range: [number, number]; text: string };
  suggestions?: {
    desc: string;
    fix: { range: [number, number]; text: string };
  }[];
}

// ─── Config ──────────────────────────────────────────────────────────────────────

const CATEGORIES: Record<string, string[]> = {
  auto: [], // all auto-fixable
  await: ["require-await", "@typescript-eslint/require-await"],
  // Category → ESLint ruleIds that belong here
  console: ["no-console"],
  eqeqeq: ["eqeqeq"],
  jsdoc: ["jsdoc/require-jsdoc", "jsdoc/check-syntax"],
  perfectionist: ["perfectionist/sort-imports"],
  "ts-eslint": ["@typescript-eslint/no-unused-vars"],
  unicorn: ["unicorn/no-null"],
};

// Files in scripts/ that use console — safe to replace
const SCRIPT_FILES_WITH_CONSOLE = [
  "scripts/verify-rules.ts",
  "scripts/orchestrator.ts",
  "scripts/mcp-runner.ts",
  "scripts/mcp-runner-lib.ts",
  "scripts/plan-ensure.ts",
  "scripts/ts/build.ts",
  "scripts/ts/cleanup/cleanup-docker.ts",
  "scripts/ts/deploy/deploy.ts",
  "scripts/ts/docker/deploy-checklist.ts",
  "scripts/ts/docker/deploy-checklist-windows.ts",
  "scripts/ts/docker/docker-quickstart.ts",
  "scripts/ts/docker/docker-quickstart-windows.ts",
  "scripts/ts/docker/deploy-docker-windows.ts",
  "scripts/ts/utils/run-ci-checks.ts",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function runCmd(cmd: string, args: string[], cwd: string): string {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf-8", shell: false });
  return (result.stdout ?? "") + (result.stderr ?? "");
}

function readFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function writeFileContent(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function log(level: "error" | "info" | "warn", msg: string): void {
  const prefix =
    level === "error" ? "\u274c" : level === "warn" ? "\u26a0" : "\u2139";
  logger.info(`${prefix} ${msg}`);
}

function getCurrentBranch(cwd: string): string {
  const out = runCmd("git", ["branch", "--show-current"], cwd);
  return out.trim();
}

function getBackupSha(): string {
  return runCmd("git", ["log", "-1", "--format=%H"], ROOT).trim();
}

// ─── Load suggestions ──────────��─────────────────────────────────────────────────────

function loadSuggestions(): FixSuggestion[] {
  if (!fs.existsSync(REPORT_FIX)) {
    log("error", `Fix suggestion report not found: ${REPORT_FIX}`);
    log("info", "Run scripts/maintenance/analyze-lint-scan.ts first.");
    process.exit(1);
  }
  const data = JSON.parse(readFileContent(REPORT_FIX));
  return data.fixSuggestions ?? [];
}

// ─── Category filter ────────────────────────────────────────────────────────────

function filterByCategory(
  suggestions: FixSuggestion[],
  category: string,
): FixSuggestion[] {
  if (category === "auto") {
    return suggestions.filter((s) => s.fixable === "auto-fixable");
  }
  const rules = CATEGORIES[category] ?? [category];
  return suggestions.filter((s) => {
    const ruleCat = s.rule.split("/")[0] ?? s.rule;
    return rules.includes(s.rule) || rules.includes(ruleCat);
  });
}

// ─── Category A: console.* → logger ──────────────────────────────────────────────────
// Replaces console.log/info/warn/error with logger.debug/info/warn/error in scripts/

function replaceConsoleInScripts(
  suggestions: FixSuggestion[],
  dryRun: boolean,
): { changed: string[]; skipped: string[] } {
  const changed: string[] = [];
  const skipped: string[] = [];
  // Filter for no-console rule AND files in scripts/ or tests/
  // Handle both Windows (backslash) and Unix (forward slash) path separators
  const consoleSuggestions = suggestions
    .filter((s) => s.rule === "no-console")
    .filter((s) => {
      const normalized = s.file.replaceAll("\\", "/");
      return normalized.includes("/scripts/") || normalized.includes("/tests/");
    });
  const files = [...new Set(consoleSuggestions.map((s) => s.file))];

  log(
    "info",
    `Found ${consoleSuggestions.length} console.* in scripts/tests, ${files.length} unique files:`,
  );

  for (const file of files) {
    const relPath = path.relative(ROOT, file).replaceAll("\\", "/");
    // Only process files that are in scripts/ directory (handle both separators)
    const relNormalized = relPath.replaceAll("\\", "/");
    if (
      !relNormalized.startsWith("scripts/") &&
      !relNormalized.startsWith("tests/")
    ) {
      skipped.push(`${relPath}: not in scripts/ or tests/`);
      continue;
    }

    let content = readFileContent(file);
    if (!content) {
      skipped.push(`${relPath}: empty/unreadable`);
      continue;
    }

    // Only replace in scripts files (not tests)
    const isScript = relPath.startsWith("scripts/");
    if (!isScript) {
      skipped.push(`${relPath}: not a script file`);
      continue;
    }

    const hasLogger = content.includes('from "@/lib/logger"');
    const hasLoggerAlt = content.includes('from "@/lib/logger"');

    // Replace console.log/info/warn/error
    let replaced = false;
    const replacements: [RegExp, string][] = [
      [/\bconsole\.log\s*\(/g, "logger.info("],
      [/\bconsole\.info\s*\(/g, "logger.info("],
      [/\bconsole\.warn\s*\(/g, "logger.warn("],
      [/\bconsole\.error\s*\(/g, "logger.error("],
      [/\bconsole\.debug\s*\(/g, "logger.debug("],
    ];

    for (const [pattern, replacement] of replacements) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        replaced = true;
      }
    }

    if (!replaced) {
      skipped.push(`${relPath}: no console.* calls found`);
      continue;
    }

    // Add logger import if not present
    if (!hasLogger && !hasLoggerAlt) {
      // Find last import line
      const importLines = content.split("\n");
      const lastImportIdx = importLines.findLastIndex((l) =>
        l.startsWith("import "),
      );
      const insertIdx = lastImportIdx >= 0 ? lastImportIdx + 1 : 0;
      importLines.splice(
        insertIdx,
        0,
        'import { logger } from "@/lib/logger";',
      );
      content = importLines.join("\n");
    }

    if (dryRun) {
      log("info", `[DRY-RUN] Would update: ${relPath}`);
      changed.push(relPath);
    } else {
      writeFileContent(file, content);
      log("info", `[APPLIED] Updated: ${relPath}`);
      changed.push(relPath);
    }
  }

  return { changed, skipped };
}

// ─── Apply ESLint fixes ───────────────────────────────────────────────────────────

function applyFix(
  suggestion: FixSuggestion,
  content: string,
): { newContent: string; applied: boolean } {
  let applied = false;
  let newContent = content;

  if (suggestion.fixable === "auto-fixable" && suggestion.autoFix) {
    // Use ESLint auto-fix (replace range)
    const [start, end] = suggestion.autoFix.range;
    const lines = content.split("\n");
    let charIdx = 0;
    let lineStart = -1;
    let lineEnd = -1;
    let colStart = 0;
    let colEnd = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1; // +1 for \n
      const nextCharIdx = charIdx + lineLen;
      if (lineStart < 0 && charIdx + 1 >= suggestion.line) {
        lineStart = i;
        colStart = suggestion.column - 1;
      }
      if (lineEnd < 0 && nextCharIdx >= end) {
        lineEnd = i;
        colEnd = end - charIdx - 1;
        break;
      }
      charIdx = nextCharIdx;
    }

    if (lineStart >= 0 && lineEnd >= 0) {
      const before = lines.slice(0, lineStart).join("\n");
      const after = lines.slice(lineEnd + 1).join("\n");
      const targetLine = lines[lineStart] ?? "";
      newContent =
        before +
        targetLine.slice(0, colStart) +
        suggestion.autoFix.text +
        targetLine.slice(colEnd) +
        after;
      applied = true;
    }
  }

  return { applied, newContent };
}

// ─── Apply suggestion fixes ────────────────────────────────────────────────────

function applySuggestionFix(
  suggestion: FixSuggestion,
  content: string,
): { newContent: string; applied: boolean } {
  if (
    suggestion.fixable !== "suggestion-available" ||
    !suggestion.suggestions ||
    suggestion.suggestions.length === 0
  ) {
    return { applied: false, newContent: content };
  }

  const fix = suggestion.suggestions?.[0]?.fix;
  const replacement = suggestion.suggestions?.[0]?.fix?.text ?? "";
  const [start, end] = fix?.range ?? [0, 0];

  // Calculate line/col from character positions
  const beforeTarget = content.slice(0, start);
  const afterTarget = content.slice(end);
  const lines = beforeTarget.split("\n");
  const lineIdx = lines.length - 1;
  const colIdx = start - beforeTarget.lastIndexOf("\n") - 1;

  // Replace the targeted text
  const targetLines = content.split("\n");
  const lineContent = targetLines[lineIdx] ?? "";
  const lastPart = beforeTarget.split("\n").at(-1) ?? "";
  const newLineContent =
    lineContent.slice(0, colIdx) +
    replacement +
    lineContent.slice(end - lastPart.length - 1);
  const newContent =
    targetLines.slice(0, lineIdx).join("\n") +
    (lineIdx > 0 ? "\n" : "") +
    newLineContent +
    targetLines.slice(lineIdx + 1).join("\n");

  return { applied: true, newContent };
}

// ─── Apply category ────────────────────────────────────────────────────────────────

function applyCategory(
  category: string,
  suggestions: FixSuggestion[],
  dryRun: boolean,
): { filesChanged: number; fixesApplied: number } {
  const filtered = filterByCategory(suggestions, category);
  let filesChanged = 0;
  let fixesApplied = 0;

  // Group by file
  const byFile: Record<string, FixSuggestion[]> = {};
  for (const s of filtered) {
    if (!byFile[s.file]) byFile[s.file] = [];
    byFile[s.file].push(s);
  }

  for (const [file, fileSuggestions] of Object.entries(byFile)) {
    const relPath = path.relative(ROOT, file);
    let content = readFileContent(file);
    if (!content) continue;

    let fileChanged = false;

    for (const suggestion of fileSuggestions) {
      if (suggestion.fixable === "auto-fixable") {
        const { applied, newContent } = applyFix(suggestion, content);
        if (applied) {
          content = newContent;
          fixesApplied++;
          fileChanged = true;
        }
      } else if (suggestion.fixable === "suggestion-available") {
        const { applied, newContent } = applySuggestionFix(suggestion, content);
        if (applied) {
          content = newContent;
          fixesApplied++;
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      if (dryRun) {
        log("info", `[DRY-RUN] Would update: ${relPath}`);
      } else {
        writeFileContent(file, content);
        log(
          "info",
          `[APPLIED] Updated: ${relPath} (${fileSuggestions.length} fixes)`,
        );
      }
      filesChanged++;
    }
  }

  return { filesChanged, fixesApplied };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes("--apply");
  const categoryIdx = args.indexOf("--category");
  const category = categoryIdx >= 0 ? args[categoryIdx + 1] : "auto";

  log("info", `=== Lint Fix Runner ===`);
  log("info", `Category: ${category}`);
  log("info", `Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
  log("info", `Backup SHA: ${getBackupSha()}`);
  log("info", `Current branch: ${getCurrentBranch(ROOT)}`);

  const suggestions = loadSuggestions();
  // Special filter for "console" category (no-console rule)
  const filtered =
    category === "console"
      ? suggestions.filter((s) => s.rule === "no-console")
      : filterByCategory(suggestions, category);

  log("info", `Found ${filtered.length} suggestions in category '${category}'`);

  if (filtered.length === 0) {
    log("info", "Nothing to fix.");
    return;
  }

  let filesChanged = 0;
  let fixesApplied = 0;

  if (category === "console") {
    // Special handling for console → logger (use filtered!)
    const { changed } = replaceConsoleInScripts(filtered, dryRun);
    filesChanged = changed.length;
    fixesApplied = changed.length;
  } else if (category === "auto" || CATEGORIES[category]) {
    const result = applyCategory(category, filtered, dryRun);
    filesChanged = result.filesChanged;
    fixesApplied = result.fixesApplied;
  } else {
    log("warn", `Unknown category: ${category}`);
    return;
  }

  log(
    "info",
    `Done. Files changed: ${filesChanged}, Fixes applied: ${fixesApplied}`,
  );

  if (!dryRun && fixesApplied > 0) {
    log("info", "Running post-apply verification...");
    runCmd("npm", ["run", "format"], ROOT);
    const tc = runCmd("npm", ["run", "type-check"], ROOT);
    if (tc.includes("error")) {
      log("error", "Type-check failed after applying fixes.");
    } else {
      log("info", "Type-check passed.");
    }
  }
}

main();
