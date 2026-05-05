#!/usr/bin/env tsx
import { execSync } from "child_process";
import fs from "fs";
import { globby } from "globby";
import inquirer from "inquirer";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Plan candidate found via scoring against changed files.
 * @interface PlanCandidate
 */
interface PlanCandidate {
  /** File path to the plan markdown file */
  file: string;
  /** Extracted title from plan's H1 heading */
  title?: string;
  /** Extracted goals section from plan */
  goals?: string;
  /** Target files mentioned in plan */
  targetFiles?: string[];
  /** Relevance score (0-1) based on target files and description matching */
  score?: number;
}

/**
 * Parse plan markdown file and extract metadata and sections.
 *
 * @param {string} p - Path to plan markdown file
 * @returns {{
 *   title?: string;
 *   goals?: string;
 *   targetFiles?: string[];
 * }} Extracted plan metadata (title, goals section, target files)
 */
export function readPlanFile(p: string): {
  title?: string;
  goals?: string;
  targetFiles?: string[];
} {
  const txt = fs.readFileSync(p, "utf8");
  const lines = txt.split(/\r?\n/);
  let title: string | undefined;
  let goals = "";
  let targetFiles: string[] = [];
  let inGoals = false;
  for (const l of lines) {
    if (!title && l.startsWith("# ")) title = l.replace(/^#\s*/, "").trim();
    if (l.match(/^##\s+Goals/i)) {
      inGoals = true;
      continue;
    }
    if (inGoals) {
      if (l.match(/^##\s+/)) break;
      goals += l + "\n";
    }
    const tfMatch = l.match(/\bTarget Files:\s*(.*)/i);
    if (tfMatch) {
      targetFiles = tfMatch[1]
        .split(/,|;/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return { goals: goals.trim(), targetFiles, title };
}

/**
 * Score a plan candidate based on changed files.
 * - Prefix boost: 0.35 points per target file that matches changed files
 * - Token overlap: up to 0.5 points for text overlap between changed files and plan title/goals
 *
 * @param {string[]} changed - List of changed file paths
 * @param {PlanCandidate} cand - Plan candidate to score
 * @returns {number} Relevance score (0-1)
 */
export function scoreCandidate(changed: string[], cand: PlanCandidate): number {
  let score = 0;
  // path prefix boost
  for (const cf of cand.targetFiles ?? []) {
    for (const ch of changed) {
      if (ch.startsWith(cf) || ch.startsWith(cf.replaceAll("\\", "/"))) {
        score += 0.35;
        break;
      }
    }
  }
  // token overlap between changed paths and goals/title
  const text = ((cand.title ?? "") + " " + (cand.goals ?? "")).toLowerCase();
  const tokens = new Set(text.split(/[^a-z0-9]+/).filter(Boolean));
  let overlap = 0;
  let total = 0;
  for (const ch of changed) {
    const parts = ch
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    for (const p of parts) {
      total++;
      if (tokens.has(p)) overlap++;
    }
  }
  const tokenScore = total > 0 ? (overlap / total) * 0.5 : 0;
  score = Math.min(1, score + tokenScore);
  return score;
}

/**
 * Get list of changed files from git staging area.
 * Uses `git diff --name-only --staged` to detect uncommitted changes.
 *
 * @async
 * @returns {Promise<string[]>} Array of file paths with staged changes (empty if none)
 */
async function getChangedFilesFromGit(): Promise<string[]> {
  try {
    const out = execSync("git diff --name-only --staged", {
      encoding: "utf8",
    }).trim();
    if (!out) return [];
    return out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Get list of changed files from git range (base...HEAD).
 * Uses `git diff --name-only <base>...HEAD` to detect changes relative to a base branch.
 *
 * @async
 * @param {string} [base="origin/main"] - Base branch reference for comparison
 * @returns {Promise<string[]>} Array of file paths changed since base (empty if none)
 */
async function getChangedFilesFromRange(
  base = "origin/main",
): Promise<string[]> {
  try {
    const out = execSync(`git diff --name-only ${base}...HEAD`, {
      encoding: "utf8",
    }).trim();
    if (!out) return [];
    return out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Main CLI flow: detect large changes, find/create plan candidates, and merge or scaffold.
 * - If <= 7 changed files: exit 0 (no plan required)
 * - If > 7 files (interactive): prompt user to select or scaffold a plan
 * - If > 7 files (CI mode): validate candidates against threshold, produce report
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const ci = args.includes("--ci");
  const baseIdx = args.indexOf("--base");
  const base = baseIdx >= 0 ? args[baseIdx + 1] : "origin/main";

  let changed: string[] = [];
  if (ci) {
    changed = await getChangedFilesFromRange(base);
  } else {
    changed = await getChangedFilesFromGit();
  }

  if (changed.length <= 7) {
    logger.info("Changed files <= 7 — no plan required.");
    process.exit(0);
  }

  // find candidate plans
  const planFiles = await globby(
    [".opencode/commands/*.plan.md", ".cursor/plans/*.plan.md"],
    { gitignore: true },
  );
  const candidates: PlanCandidate[] = [];
  for (const p of planFiles) {
    try {
      const parsed = readPlanFile(p);
      candidates.push({
        file: p,
        goals: parsed.goals,
        targetFiles: parsed.targetFiles,
        title: parsed.title,
      });
    } catch {
      // ignore
    }
  }

  // score candidates
  const scored: PlanCandidate[] = candidates.map((c) => ({
    ...c,
    score: scoreCandidate(changed, c),
  }));
  const shown = scored
    .filter((s) => (s.score ?? 0) >= 0.4)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (!ci) {
    // Interactive flow
    logger.info(
      `Detected ${changed.length} changed files — exceeding threshold (7).`,
    );
    if (shown.length === 0) {
      logger.info("No candidate plans found. Scaffolding a new plan draft.");
      const suggested = scaffoldNewPlan(changed);
      await openEditorAndSave(suggested);
      logger.info(
        "New plan draft created. Please commit it to include in your PR.",
      );
      process.exit(0);
    }

    logger.info("Candidate plans:");
    const choices = shown.map((s, i) => ({
      name: `${path.basename(s.file)} — score:${(s.score ?? 0).toFixed(2)} — ${s.title ?? "(no title)"}`,
      value: i,
    }));
    choices.push({ name: "Scaffold new plan", value: -1 });
    const ans = await inquirer.prompt([
      {
        choices,
        message: "Select a plan to merge into or scaffold new:",
        name: "pick",
        type: "list",
      },
    ]);
    const pick = ans.pick as number;
    if (pick === -1) {
      const suggested = scaffoldNewPlan(changed);
      await openEditorAndSave(suggested);
      logger.info("New plan draft created. Please commit it.");
      process.exit(0);
    }
    const candidate = shown[pick];
    const merged = mergeIntoPlan(candidate.file, changed);
    await openEditorAndSave(merged);
    logger.info(
      `Merged draft created at ${merged}. Please commit to include in your PR.`,
    );
    process.exit(0);
  } else {
    // CI flow: produce report and exit with code 0 in pilot mode
    if (shown.length === 0) {
      logger.info(
        "[CI] No candidate plan found for large change. Please run 'bun run plan:ensure' locally to scaffold a plan.",
      );
      // in pilot mode we warn — exit 0
      process.exit(0);
    }
    const top = shown[0];
    if ((top.score ?? 0) >= 0.8) {
      logger.info(
        `[CI] High-confidence candidate found: ${top.file} (score=${top.score}).`,
      );
      // write merged draft to artifact for maintainer to inspect
      const mergedPath = mergeIntoPlan(top.file, changed);
      logger.info(
        `[CI] Merged draft created at ${mergedPath} (artifact). Please review and commit.`,
      );
      process.exit(0);
    }
    logger.info(
      "[CI] Candidate plans found but none are high-confidence. Listing candidates:",
    );
    for (const s of shown) logger.info(`  - ${s.file} (score=${s.score})`);
    process.exit(0);
  }
}

/**
 * Create a new plan scaffold based on list of changed files.
 * Generates a timestamped plan file with template sections (Goals, Scope, Risks, etc.).
 *
 * @param {string[]} changed - List of changed file paths to include in plan
 * @returns {string} Path to the created plan file
 */
function scaffoldNewPlan(changed: string[]): string {
  const title = `Plan for changes: ${changed.slice(0, 3).join(", ")}${changed.length > 3 ? ` and ${changed.length - 3} more` : ""}`;
  const filename = `.${path.sep}opencode${path.sep}commands${path.sep}${slugify(title)}.merged.${new Date().toISOString()}.plan.md`;
  const content = buildPlanTemplate({ changedFiles: changed, title });
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, content, "utf8");
  return filename;
}

/**
 * Build markdown template for a new plan document.
 * Includes metadata (author, timestamp, changed files) and standard sections.
 *
 * @param {{
 *   title: string;
 *   changedFiles: string[];
 *   sourcePlan?: string;
 * }} opts - Plan options (title, list of changed files, optional source plan)
 * @returns {string} Markdown content for the plan template
 */
function buildPlanTemplate(opts: {
  title: string;
  changedFiles: string[];
  sourcePlan?: string;
}) {
  const meta = `author: ${getGitUser() || "unknown"}\ntimestamp: ${new Date().toISOString()}\nchanged-files: ${opts.changedFiles.join(", ")}\n`;
  return `# ${opts.title}\n\n${meta}\n## Goals\n- TODO: describe goals\n\n## Scope\n- Files changed:\n\n${opts.changedFiles.map((f) => `- ${f}`).join("\n")}\n\n## Target Files:\n- ${opts.changedFiles.slice(0, 5).join(", ")}\n\n## Risks\n- TODO\n\n## Planned Changes\n- TODO\n\n## Validation\n- TODO\n\n## Rollback or Mitigation\n- TODO\n`;
}

/**
 * Convert a string to a URL-safe slug (lowercase, hyphens, max 80 chars).
 * Removes leading/trailing hyphens and non-alphanumeric characters.
 *
 * @param {string} s - Input string to slugify
 * @returns {string} Slugified string (kebab-case, max 80 chars)
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Retrieve git user name and email from git config.
 * Returns formatted string or undefined if git user is not configured.
 *
 * @returns {string | undefined} Formatted user string "Name <email>" or undefined if not configured
 */
function getGitUser(): string | undefined {
  try {
    const name = execSync("git config user.name", { encoding: "utf8" }).trim();
    const email = execSync("git config user.email", {
      encoding: "utf8",
    }).trim();
    return `${name} <${email}>`;
  } catch {
    return undefined;
  }
}

/**
 * Merge changed files into an existing plan, creating a timestamped merged copy.
 * Appends a "Planned Changes" section with metadata to the existing plan content.
 *
 * @param {string} planFile - Path to the source plan file
 * @param {string[]} changed - List of changed file paths to include in merge
 * @returns {string} Path to the newly created merged plan file
 */
function mergeIntoPlan(planFile: string, changed: string[]): string {
  const parsed = fs.readFileSync(planFile, "utf8");
  const mergedName = `${planFile.replace(/\.plan\.md$/, "")}.merged.${new Date().toISOString()}.plan.md`;
  const header = `\n\n## Planned Changes (additional context)\n- merged-from: ${path.basename(planFile)}\n- changed-files:\n${changed.map((f) => `  - ${f}`).join("\n")}\n`;
  const out = parsed + header;
  fs.writeFileSync(mergedName, out, "utf8");
  return mergedName;
}

/**
 * Open a file in the system editor and validate with markdownlint after save.
 * Falls back to notepad on Windows or displays path if $EDITOR is not set.
 * Exits with code 1 if markdown linting fails.
 *
 * @async
 * @param {string} filename - Path to the file to open in editor
 * @returns {Promise<void>}
 */
async function openEditorAndSave(filename: string): Promise<void> {
  const editor = process.env.EDITOR;
  if (editor) {
    try {
      execSync(`${editor} "${filename}"`, { stdio: "inherit" });
    } catch {
      logger.warn(
        "Editor exited with error, please edit the file manually:",
        filename,
      );
    }
  } else {
    // fallback for Windows
    if (process.platform === "win32") {
      try {
        execSync(`notepad "${filename}"`, { stdio: "inherit" });
      } catch {
        logger.warn("Unable to open notepad. Please edit the file:", filename);
      }
    } else {
      logger.info(`$EDITOR not set. Please edit the file: ${filename}`);
    }
  }
  // run markdownlint if available
  try {
    execSync(`npx markdownlint-cli2 -c .markdownlintrc.json "${filename}"`, {
      stdio: "inherit",
    });
  } catch {
    logger.error(
      "Markdown lint errors detected. Please fix before continuing.",
    );
    process.exit(1);
  }
}

/**
 * Detect if this script is the main entry point (not imported as a module).
 * Checks if argv includes the script filename.
 *
 * @type {boolean}
 */
const isMain: boolean = process.argv.some(
  (a) =>
    (typeof a === "string" && a.endsWith("plan-ensure.ts")) ||
    String(process.argv).includes("plan-ensure.ts"),
);
if (isMain) {
  main().catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}
