#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import { globby } from "globby";
import path from "path";
import process from "process";
import { Project, SyntaxKind } from "ts-morph";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {Severity}
 */
type Severity = "critical" | "info" | "warn";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface Issue
 * @typedef {Issue}
 */
interface Issue {
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
   * @type {number}
   */
  line: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  check: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {Severity}
   */
  severity: Severity;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  message: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  snippet?: string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {{
 *     patterns?: string[];
 *     allowlist?: string[];
 *     out?: string;
 *     ci?: boolean;
 *     // When true, require a plan file to be present for large changes (>7 files)
 *     requirePlanForLargeChanges?: boolean;
 *     // Base ref used to compute changed files (git diff base...HEAD)
 *     planBase?: string;
 *   }} [opts={}]
 * @returns {unknown}
 */
export async function runChecks(
  opts: {
    patterns?: string[];
    allowlist?: string[];
    out?: string;
    ci?: boolean;
    // When true, require a plan file to be present for large changes (>7 files)
    requirePlanForLargeChanges?: boolean;
    // Base ref used to compute changed files (git diff base...HEAD)
    planBase?: string;
  } = {},
) {
  console.log("Starting verify-rules with opts:", opts);
  // Load optional config
  let config: any = {};
  const configPath = ".opencode/verify-rules.config.json";
  try {
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
  } catch {
    // ignore parse errors and fall back to defaults
    config = {};
  }

  const patterns = opts.patterns ?? [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "actions/**/*.{ts,tsx}",
  ];
  console.log("Resolved patterns:", patterns);
  const allowlist = opts.allowlist ?? config.allowlist ?? [];
  const files = await (globby as any)(patterns, { gitignore: true });

  const issues: Issue[] = [];

  // process.env check (AST-based for TS/TSX files to avoid false positives)
  // We'll detect `process.env` property access expressions using ts-morph

  // TypeScript AST checks using ts-morph
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    tsConfigFilePath: "tsconfig.json",
  });
  const tsFiles = await (globby as any)([
    "**/*.{ts,tsx}",
    "!node_modules/**",
    "!**/*.d.ts",
  ]);
  for (const f of tsFiles) {
    if (f.includes("node_modules")) continue;

    // Skip allowlisted files
    // Skip allowlisted files using glob-like prefix matching
    if (
      allowlist.some((g: string) => {
        const normalized = g.replaceAll("\\", "/");
        const pattern = normalized.replaceAll("**", "");
        return f.replaceAll("\\", "/").startsWith(pattern);
      })
    ) {
      continue;
    }

    const src = fs.readFileSync(f, "utf8");
    const sf = project.createSourceFile(f, src, { overwrite: true });

    // AST-based process.env detection
    const propAccesses = sf.getDescendantsOfKind(
      SyntaxKind.PropertyAccessExpression,
    );
    for (const p of propAccesses) {
      try {
        const expression = p.getExpression();
        const name = p.getName();
        if (expression.getText() === "process" && name === "env") {
          // Determine severity from config if present
          const sev =
            config.severities?.["process.env-usage"] ||
            (f.startsWith("app/") || f.startsWith("lib/")
              ? "critical"
              : "warn");
          issues.push({
            check: "process.env-usage",
            file: f,
            line: p.getStartLineNumber(),
            message:
              "Direct process.env usage detected. Use app-config.ts or lib/env.ts instead.",
            severity: sev as Severity,
            snippet: p.getText(),
          });
        }
      } catch {
        // ignore malformed nodes
      }
    }

    // any usage
    const anyNodes = sf.getDescendantsOfKind(SyntaxKind.AnyKeyword);
    if (anyNodes.length > 0) {
      const n = anyNodes[0];
      const { line } = n.getStartLineNumber
        ? { line: n.getStartLineNumber() }
        : { line: 0 };
      const sev = config.severities?.["no-any"] || "warn";
      issues.push({
        check: "no-any",
        file: f,
        line,
        message: `Found 'any' type usage (${anyNodes.length} occurrences). Avoid using any.`,
        severity: sev as Severity,
      });
    }

    // DB direct import heuristic
    const imports = sf.getImportDeclarations();
    for (const imp of imports) {
      const txt = imp.getModuleSpecifierValue();
      const named = imp.getNamedImports().map((n) => n.getName());
      if (
        /(^|\/)database($|\/)|\bdb\b|drizzle/i.test(txt) ||
        named.includes("db") ||
        imp.getDefaultImport()?.getText() === "db"
      ) {
        if (
          f.startsWith("app/") ||
          f.startsWith("components/") ||
          f.startsWith("pages/")
        ) {
          const sev = config.severities?.["direct-db-import"] || "warn";
          issues.push({
            check: "direct-db-import",
            file: f,
            line: imp.getStartLineNumber(),
            message: `Direct DB client import detected from '${txt}'. Use dal/* helpers instead.`,
            severity: sev as Severity,
          });
        }
      }
    }

    // Server Action heuristics for files in actions/
    if (f.startsWith("actions/") || f.includes("/actions/")) {
      // skip server-action checks for allowlisted files
      if (
        allowlist.some((g: string) =>
          f
            .replaceAll("\\", "/")
            .startsWith(g.replaceAll("\\", "/").replace("**", "")),
        )
      ) {
        continue;
      }
      const text = src;
      if (text.includes("use server")) {
        // auth check
        if (
          !/await\s+auth\(|\bconst\s+session\s*=\s*await\s*auth\(/.test(text)
        ) {
          const sev = config.severities?.["server-action-auth"] || "critical";
          issues.push({
            check: "server-action-auth",
            file: f,
            line: 1,
            message:
              "Server Action does not appear to call auth() early. Server Actions must authenticate first.",
            severity: sev as Severity,
          });
        }
        // zod check
        if (
          !/\.safeParse\(|z\.object\(|z\.string\(|\.parse\(|z\.infer\(/.test(
            text,
          )
        ) {
          const sev = config.severities?.["server-action-zod"] || "warn";
          issues.push({
            check: "server-action-zod",
            file: f,
            line: 1,
            message:
              "Server Action does not appear to validate inputs with Zod or use a shared schema.",
            severity: sev as Severity,
          });
        }
        // return shape check
        if (
          !/return\s+\{\s*ok\s*:|return\s+\{\s*ok\s*,|return\s+\{\s*ok\s*\}/.test(
            text,
          )
        ) {
          const sev =
            config.severities?.["server-action-return-shape"] || "warn";
          issues.push({
            check: "server-action-return-shape",
            file: f,
            line: 1,
            message:
              "Server Action does not appear to return { ok: boolean, error?: string } shape.",
            severity: sev as Severity,
          });
        }
      }
    }
  }

  // Home page static check
  const homeFiles = [
    "app/page.tsx",
    "components/home/home-server-wrapper.tsx",
    "components/home/home-client-wrapper.tsx",
  ].filter((p) => fs.existsSync(p));
  for (const hf of homeFiles) {
    const txt = fs.readFileSync(hf, "utf8");
    if (/\bawait\s+auth\(|\bauth\(/.test(txt)) {
      issues.push({
        check: "home-auth",
        file: hf,
        line: 1,
        message: "Home page must remain public/static and not call auth().",
        severity: "critical",
      });
    }
    if (/process\.env/.test(txt)) {
      issues.push({
        check: "home-process-env",
        file: hf,
        line: 1,
        message: "Home page should not read process.env directly.",
        severity: "critical",
      });
    }
    if (/\bdb\b/.test(txt) && /import/.test(txt)) {
      issues.push({
        check: "home-db",
        file: hf,
        line: 1,
        message: "Home page should not access DB or DAL directly.",
        severity: "critical",
      });
    }
  }

  const report = { generatedAt: new Date().toISOString(), results: issues };
  const outPath = opts.out ?? ".opencode/reports/rules-report.json";
  try {
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Writing rules report to ${outPath}`);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`Wrote rules report (${report.results.length} results)`);
  } catch {
    // ignore
  }

  // Console summary
  const counts = issues.reduce(
    (acc, it) => {
      acc[it.severity] = (acc[it.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  console.log("\nRules verification summary:");
  console.log(`  total issues: ${issues.length}`);
  console.log(`  critical: ${counts["critical"] || 0}`);
  console.log(`  warn: ${counts["warn"] || 0}`);
  console.log(`  info: ${counts["info"] || 0}`);

  if (issues.length > 0) {
    console.log("\nTop issues:");
    for (const it of issues.slice(0, 10)) {
      console.log(
        `- ${it.file}:${it.line} [${it.severity}] ${it.check} — ${it.message}`,
      );
    }
    console.log("");
  }

  const criticalFound = issues.some((i) => i.severity === "critical");
  if (opts.ci && criticalFound) {
    console.error("Critical rule violations found. Failing CI.");
    process.exit(2);
  }

  // Optional plan enforcement for large changes
  if (opts.requirePlanForLargeChanges) {
    try {
      const covered = await ensurePlanForLargeChanges(
        opts.planBase ?? "origin/main",
        opts.ci,
        issues,
      );
      if (opts.ci && !covered) {
        console.error(
          "Plan check failed: large change detected but no plan found. Failing CI as requested.",
        );
        process.exit(2);
      }
    } catch (e) {
      console.warn("Failed running plan check:", e);
    }
  }

  return report;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} base
 * @param {(boolean | undefined)} ci
 * @param {Issue[]} issues
 * @returns {Promise<boolean>}
 */
async function ensurePlanForLargeChanges(
  base: string,
  ci: boolean | undefined,
  issues: Issue[],
): Promise<boolean> {
  // Determine changed files using git
  let changed: string[] = [];
  try {
    const out = execSync(`git diff --name-only ${base}...HEAD`, {
      encoding: "utf8",
    }).trim();
    if (out)
      changed = out
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
  } catch (err) {
    // if git not available or command fails, skip
    const emsg =
      err && typeof err === "object" && "message" in err
        ? (err as any).message
        : String(err);
    console.warn("Could not determine changed files for plan check:", emsg);
    // If we cannot determine changed files, treat as covered to avoid false failures
    return true;
  }

  if (changed.length <= 7) return true; // no plan required -> covered

  // look for plan files that mention the changed files
  const planPatterns = [
    ".opencode/commands/*.plan.md",
    ".cursor/plans/*.plan.md",
  ];
  const planFiles = await (globby as any)(planPatterns, { gitignore: true });

  // If any plan contains a reference to one of the changed files, consider covered
  let covered = false;
  for (const pf of planFiles) {
    try {
      const txt = fs.readFileSync(pf, "utf8");
      for (const c of changed) {
        if (txt.includes(c) || txt.includes(path.basename(c))) {
          covered = true;
          break;
        }
      }
      if (covered) break;
    } catch {
      // ignore
    }
  }

  if (!covered) {
    // Not covered — return false so caller can decide to fail CI or warn
    issues.push({
      check: "plan-required",
      file: "(git diff)",
      line: 0,
      message: `Large change detected (${changed.length} files) but no plan file found in .opencode/commands or .cursor/plans. Run 'npm run plan:ensure' locally to scaffold or merge a plan and commit it to the PR.`,
      severity: "warn",
    });
    return false;
  }

  return true;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const isMain = process.argv.some(
  (a) =>
    (typeof a === "string" && a.endsWith("verify-rules.ts")) ||
    String(process.argv).includes("verify-rules.ts"),
);
if (isMain) {
  (async () => {
    const args = process.argv.slice(2);
    const outIdx = args.findIndex((a) => a === "--output");
    const out =
      outIdx >= 0 ? args[outIdx + 1] : ".opencode/reports/rules-report.json";
    const ci = args.includes("--ci");
    const requirePlan =
      args.includes("--require-plan") ||
      args.includes("--require-plan-for-large-changes");
    const baseIdx = args.findIndex(
      (a) => a === "--plan-base" || a === "--base",
    );
    const planBase = baseIdx >= 0 ? args[baseIdx + 1] : undefined;
    await runChecks({
      ci,
      out,
      planBase,
      requirePlanForLargeChanges: requirePlan,
    });
  })();
}

export default runChecks;
