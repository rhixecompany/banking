/**
 * MCP Runner (dry-run)
 *
 * Minimal, dependency-free CLI to inspect a locally-generated pages map and
 * propose (but not write) changes to opencode manifest files.
 *
 * This is a DRY-RUN tool only — it will never modify files. Run with:
 *   bunx tsx .opencode/tools/mcp-runner.ts
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

/** Inline logger — avoids the @/lib/logger app alias outside the Next.js tree */
const logger = {
  info: (...args: unknown[]) => console.log(...args),
  error: (...args: unknown[]) => console.error(...args),
};

interface PagesMap {
  generatedAt?: string;
  pages?: string[];
  source?: string;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T = unknown>(filePath: string): Promise<null | T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.error(`Failed to read/parse JSON at ${filePath}:`, err);
    return null;
  }
}

async function main() {
  const repoRoot = process.cwd();
  const pagesMapPath = path.join(
    repoRoot,
    ".opencode",
    "reports",
    "pages-map.json",
  );

  const out: {
    ok: boolean;
    report: string;
    proposals?: Record<string, unknown>;
  } = {
    ok: true,
    report: "",
  };

  let pagesMap: PagesMap = {};
  if (!(await fileExists(pagesMapPath))) {
    logger.error(
      `[warn] Pages map not found at ${pagesMapPath}; continuing with empty pages list.`,
    );
  } else {
    pagesMap = (await readJson<PagesMap>(pagesMapPath)) || {};
  }

  const pages = pagesMap.pages || [];

  const humanReportLines: string[] = [];
  humanReportLines.push("Discovered pages:");
  if (pages.length === 0) {
    humanReportLines.push("  (no pages found in pages-map.json)");
  } else {
    for (const p of pages) {
      humanReportLines.push(`  - ${p}`);
    }
  }

  const manifests = [
    path.join(repoRoot, ".opencode", "mcp_servers.json"),
    path.join(repoRoot, ".opencode", "opencode.json"),
  ];

  const proposals: Record<string, unknown> = {};

  for (const mPath of manifests) {
    if (!(await fileExists(mPath))) {
      proposals[path.relative(repoRoot, mPath)] = {
        action: "create",
        proposed: { pages },
        reason: "manifest missing",
      };
      continue;
    }

    const data = await readJson<Record<string, unknown>>(mPath);
    if (!data) {
      proposals[path.relative(repoRoot, mPath)] = {
        action: "read-failed",
        reason: "could not parse JSON",
      };
      continue;
    }

    if (Array.isArray(data.pages)) {
      const dataPages = data.pages as string[];
      const missing = pages.filter((p) => !dataPages.includes(p));
      if (missing.length > 0) {
        proposals[path.relative(repoRoot, mPath)] = {
          action: "update",
          missing,
          proposed: {
            pages: [...dataPages, ...missing],
          },
          reason: "missing pages",
        };
      }
    } else {
      proposals[path.relative(repoRoot, mPath)] = {
        action: "no-pages-key",
        proposed: { pages },
        reason: "manifest exists but has no 'pages' array",
      };
    }
  }

  out.report = humanReportLines.join("\n");
  if (Object.keys(proposals).length > 0) out.proposals = proposals;

  logger.info(out.report);
  if (out.proposals) {
    logger.info("\nProposals (dry-run, no files will be written):");
    logger.info(JSON.stringify(out.proposals, null, 2));
  } else {
    logger.info(
      "\nNo proposals — manifests appear to contain all discovered pages or are not applicable.",
    );
  }

  logger.info("\nJSON_OUTPUT_START");
  logger.info(JSON.stringify(out, null, 2));
  logger.info("JSON_OUTPUT_END");
  process.exit(0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logger.error("Unexpected error:", err);
    process.exit(1);
  });
}
