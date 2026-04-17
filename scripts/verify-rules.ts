#!/usr/bin/env node
import fs from "fs";
import { globby } from "globby";
import path from "path";
import process from "process";
import { Project, SyntaxKind } from "ts-morph";

type Severity = "info" | "warn" | "critical";

type Issue = {
  file: string;
  line: number;
  check: string;
  severity: Severity;
  message: string;
  snippet?: string;
};

export async function runChecks(
  opts: {
    patterns?: string[];
    allowlist?: string[];
    out?: string;
    ci?: boolean;
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
  } catch (e) {
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
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
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
        const normalized = g.replace(/\\/g, "/");
        const pattern = normalized.replace(/\*\*/g, "");
        return f.replace(/\\/g, "/").startsWith(pattern);
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
            (config.severities && config.severities["process.env-usage"]) ||
            (f.startsWith("app/") || f.startsWith("lib/")
              ? "critical"
              : "warn");
          issues.push({
            file: f,
            line: p.getStartLineNumber(),
            check: "process.env-usage",
            severity: sev as Severity,
            message:
              "Direct process.env usage detected. Use app-config.ts or lib/env.ts instead.",
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
      const sev = (config.severities && config.severities["no-any"]) || "warn";
      issues.push({
        file: f,
        line,
        check: "no-any",
        severity: sev as Severity,
        message: `Found 'any' type usage (${anyNodes.length} occurrences). Avoid using any.`,
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
          const sev =
            (config.severities && config.severities["direct-db-import"]) ||
            "warn";
          issues.push({
            file: f,
            line: imp.getStartLineNumber(),
            check: "direct-db-import",
            severity: sev as Severity,
            message: `Direct DB client import detected from '${txt}'. Use dal/* helpers instead.`,
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
            .replace(/\\/g, "/")
            .startsWith(g.replace(/\\/g, "/").replace("**", "")),
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
          const sev =
            (config.severities && config.severities["server-action-auth"]) ||
            "critical";
          issues.push({
            file: f,
            line: 1,
            check: "server-action-auth",
            severity: sev as Severity,
            message:
              "Server Action does not appear to call auth() early. Server Actions must authenticate first.",
          });
        }
        // zod check
        if (
          !/\.safeParse\(|z\.object\(|z\.string\(|\.parse\(|z\.infer\(/.test(
            text,
          )
        ) {
          const sev =
            (config.severities && config.severities["server-action-zod"]) ||
            "warn";
          issues.push({
            file: f,
            line: 1,
            check: "server-action-zod",
            severity: sev as Severity,
            message:
              "Server Action does not appear to validate inputs with Zod or use a shared schema.",
          });
        }
        // return shape check
        if (
          !/return\s+\{\s*ok\s*:|return\s+\{\s*ok\s*,|return\s+\{\s*ok\s*\}/.test(
            text,
          )
        ) {
          const sev =
            (config.severities &&
              config.severities["server-action-return-shape"]) ||
            "warn";
          issues.push({
            file: f,
            line: 1,
            check: "server-action-return-shape",
            severity: sev as Severity,
            message:
              "Server Action does not appear to return { ok: boolean, error?: string } shape.",
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
        file: hf,
        line: 1,
        check: "home-auth",
        severity: "critical",
        message: "Home page must remain public/static and not call auth().",
      });
    }
    if (/process\.env/.test(txt)) {
      issues.push({
        file: hf,
        line: 1,
        check: "home-process-env",
        severity: "critical",
        message: "Home page should not read process.env directly.",
      });
    }
    if (/\bdb\b/.test(txt) && /import/.test(txt)) {
      issues.push({
        file: hf,
        line: 1,
        check: "home-db",
        severity: "critical",
        message: "Home page should not access DB or DAL directly.",
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
  } catch (e) {
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

  return report;
}

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
    await runChecks({ out, ci });
  })();
}

export default runChecks;
