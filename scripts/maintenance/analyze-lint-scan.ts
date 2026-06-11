import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { logger } from "@/lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scanPath = path.join(
  __dirname,
  "../../.opencode/reports/eslint-scan.json",
);
const outPath = path.join(
  __dirname,
  "../../.opencode/reports/eslint-fix-suggest.json",
);

interface EslintMessage {
  ruleId: null | string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  endLine?: number;
  endColumn?: number;
  fix?: { range: [number, number]; text: string };
  suggestions?: {
    messageId: string;
    fix?: { range: [number, number]; text: string };
    desc: string;
  }[];
}

interface EslintResult {
  filePath: string;
  messages: EslintMessage[];
  errorCount: number;
  warningCount: number;
  fixableWarningCount: number;
  fixableErrorCount: number;
}

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

const report: Record<string, unknown> = JSON.parse(
  fs.readFileSync(scanPath, "utf-8"),
);

// Handle both array and object formats
const results: EslintResult[] = Array.isArray(report)
  ? report
  : ((report as { results?: EslintResult[] }).results ?? []);

const fixSuggestions: FixSuggestion[] = [];
const stats = {
  filesWithIssues: 0,
  fixableAuto: 0,
  fixableSuggestion: 0,
  manual: 0,
  totalErrors: 0,
  totalFiles: 0,
  totalWarnings: 0,
};

const byCategory: Record<string, number> = {};

for (const result of results) {
  stats.totalFiles++;
  if (result.messages.length > 0) {
    stats.filesWithIssues++;
    stats.totalWarnings += result.warningCount;
    stats.totalErrors += result.errorCount;

    for (const msg of result.messages) {
      const rule = msg.ruleId ?? "unknown";
      const category = rule.split("/")[0] ?? rule;

      byCategory[category] = (byCategory[category] ?? 0) + 1;

      const suggestion: FixSuggestion = {
        autoFix: undefined,
        column: msg.column,
        file: result.filePath,
        fixable: "manual",
        line: msg.line,
        message: msg.message,
        rule,
        suggestions: undefined,
      };

      if (msg.fix) {
        suggestion.fixable = "auto-fixable";
        suggestion.autoFix = msg.fix;
        stats.fixableAuto++;
      } else if (msg.suggestions && msg.suggestions.length > 0) {
        suggestion.fixable = "suggestion-available";
        suggestion.suggestions = msg.suggestions
          .filter((s) => s.fix)
          .map((s) => ({
            desc: s.desc,
            fix: s.fix ?? { range: [0, 0], text: "" },
          }));
        stats.fixableSuggestion++;
      } else {
        stats.manual++;
      }

      fixSuggestions.push(suggestion);
    }
  }
}

// Group by category
const byRule: Record<string, FixSuggestion[]> = {};
for (const s of fixSuggestions) {
  if (!byRule[s.rule]) byRule[s.rule] = [];
  byRule[s.rule].push(s);
}

// Group by category
const byCategoryGrouped: Record<string, Record<string, FixSuggestion[]>> = {};
for (const [rule, items] of Object.entries(byRule)) {
  const cat = rule.split("/")[0] ?? rule;
  if (!byCategoryGrouped[cat]) byCategoryGrouped[cat] = {};
  byCategoryGrouped[cat][rule] = items;
}

// Files with most issues
const filesByCount: [string, number][] = Object.entries(
  fixSuggestions.reduce<Record<string, number>>((acc, s) => {
    acc[s.file] = (acc[s.file] ?? 0) + 1;
    return acc;
  }, {}),
).sort((a, b) => b[1] - a[1]);

const output = {
  byCategory,
  byCategoryGrouped,
  filesByCount: filesByCount.slice(0, 20),
  fixSuggestions: fixSuggestions.sort((a, b) => a.file.localeCompare(b.file)),
  generated: new Date().toISOString(),
  stats,
  totalFixSuggestions: fixSuggestions.length,
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
logger.info(
  `ESLint fix discovery complete. Found ${fixSuggestions.length} suggestions.`,
);
logger.info(`Stats: ${JSON.stringify(stats)}`);
logger.info(`Categories: ${JSON.stringify(byCategory)}`);
logger.info(`Top files: ${JSON.stringify(filesByCount.slice(0, 10))}`);
logger.info(`Report written to: ${outPath}`);
