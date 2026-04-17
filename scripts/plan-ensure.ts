#!/usr/bin/env tsx
import { execSync } from "child_process";
import fs from "fs";
import { globby } from "globby";
import inquirer from "inquirer";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const CMD = process.argv[1];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface PlanCandidate
 * @typedef {PlanCandidate}
 */
interface PlanCandidate {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  file: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  title?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  goals?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string[]}
   */
  targetFiles?: string[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  score?: number;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} p
 * @returns {{
 *   title?: string;
 *   goals?: string;
 *   targetFiles?: string[];
 * }}
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
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string[]} changed
 * @param {PlanCandidate} cand
 * @returns {number}
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
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {Promise<string[]>}
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
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} [base="origin/main"]
 * @returns {unknown}
 */
async function getChangedFilesFromRange(base = "origin/main") {
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
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
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
    console.log("Changed files <= 7 — no plan required.");
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
    console.log(
      `Detected ${changed.length} changed files — exceeding threshold (7).`,
    );
    if (shown.length === 0) {
      console.log("No candidate plans found. Scaffolding a new plan draft.");
      const suggested = scaffoldNewPlan(changed);
      await openEditorAndSave(suggested);
      console.log(
        "New plan draft created. Please commit it to include in your PR.",
      );
      process.exit(0);
    }

    console.log("Candidate plans:");
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
      console.log("New plan draft created. Please commit it.");
      process.exit(0);
    }
    const candidate = shown[pick];
    const merged = mergeIntoPlan(candidate.file, changed);
    await openEditorAndSave(merged);
    console.log(
      `Merged draft created at ${merged}. Please commit to include in your PR.`,
    );
    process.exit(0);
  } else {
    // CI flow: produce report and exit with code 0 in pilot mode
    if (shown.length === 0) {
      console.log(
        "[CI] No candidate plan found for large change. Please run 'npm run plan:ensure' locally to scaffold a plan.",
      );
      // in pilot mode we warn — exit 0
      process.exit(0);
    }
    const top = shown[0];
    if ((top.score ?? 0) >= 0.8) {
      console.log(
        `[CI] High-confidence candidate found: ${top.file} (score=${top.score}).`,
      );
      // write merged draft to artifact for maintainer to inspect
      const mergedPath = mergeIntoPlan(top.file, changed);
      console.log(
        `[CI] Merged draft created at ${mergedPath} (artifact). Please review and commit.`,
      );
      process.exit(0);
    }
    console.log(
      "[CI] Candidate plans found but none are high-confidence. Listing candidates:",
    );
    for (const s of shown) console.log(`  - ${s.file} (score=${s.score})`);
    process.exit(0);
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string[]} changed
 * @returns {string}
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
 * Description placeholder
 * @author Adminbot
 *
 * @param {{
 *   title: string;
 *   changedFiles: string[];
 *   sourcePlan?: string;
 * }} opts
 * @returns {string}
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
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} s
 * @returns {*}
 */
function slugify(s: string) {
  return s
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "")
    .slice(0, 80);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {string}
 */
function getGitUser() {
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
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} planFile
 * @param {string[]} changed
 * @returns {string}
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
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} filename
 * @returns {*}
 */
async function openEditorAndSave(filename: string) {
  const editor = process.env.EDITOR;
  if (editor) {
    try {
      execSync(`${editor} "${filename}"`, { stdio: "inherit" });
    } catch {
      console.warn(
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
        console.warn("Unable to open notepad. Please edit the file:", filename);
      }
    } else {
      console.log(`$EDITOR not set. Please edit the file: ${filename}`);
    }
  }
  // run markdownlint if available
  try {
    execSync(`npx markdownlint-cli2 -c .markdownlintrc.json "${filename}"`, {
      stdio: "inherit",
    });
  } catch {
    console.error(
      "Markdown lint errors detected. Please fix before continuing.",
    );
    process.exit(1);
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const isMain = process.argv.some(
  (a) =>
    (typeof a === "string" && a.endsWith("plan-ensure.ts")) ||
    String(process.argv).includes("plan-ensure.ts"),
);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
