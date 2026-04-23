/**
 * MCP Runner (dry-run)
 *
 * Minimal, dependency-free CLI to inspect a locally-generated pages map and
 * propose (but not write) changes to opencode manifest files.
 *
 * This is a DRY-RUN tool only — it will never modify files. Run with:
 *   node ./scripts/ts/mcp/mcp-runner.js
 * (after transpiling with tsc or running with ts-node)
 */
import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface PagesMap
 * @typedef {PagesMap}
 */
interface PagesMap {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  generatedAt?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string[]}
   */
  pages?: string[];
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  source?: string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} filePath
 * @returns {unknown}
 */
async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @template [T=any]
 * @param {string} filePath
 * @returns {Promise<null | T>}
 */
async function readJson<T = any>(filePath: string): Promise<null | T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    // Log underlying error for visibility but keep behavior as a non-throwing helper
    logger.error(`Failed to read/parse JSON at ${filePath}:`, err);
    return null;
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

  if (!(await fileExists(pagesMapPath))) {
    out.ok = false;
    out.report = `Pages map not found at ${pagesMapPath}`;
    // Human-facing error -> stderr
    logger.error(out.report);
    // Machine-readable output remains on stdout
    logger.info(JSON.stringify(out, null, 2));
    process.exit(1);
  }

  const pagesMap = (await readJson<PagesMap>(pagesMapPath)) || {};
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

  // Check potential manifest files and propose additions if pages missing
  const manifests = [
    path.join(repoRoot, ".opencode", "mcp_servers.json"),
    path.join(repoRoot, ".opencode", "opencode.json"),
  ];

  const proposals: Record<string, unknown> = {};

  for (const mPath of manifests) {
    if (!(await fileExists(mPath))) {
      // propose creating a minimal manifest with pages
      proposals[path.relative(repoRoot, mPath)] = {
        action: "create",
        proposed: { pages },
        reason: "manifest missing",
      };
      continue;
    }

    const data = await readJson<any>(mPath);
    if (!data) {
      proposals[path.relative(repoRoot, mPath)] = {
        action: "read-failed",
        reason: "could not parse JSON",
      };
      continue;
    }

    // If manifest has a 'pages' array, compare and propose additions
    if (Array.isArray(data.pages)) {
      const missing = pages.filter((p) => !data.pages.includes(p));
      if (missing.length > 0) {
        proposals[path.relative(repoRoot, mPath)] = {
          action: "update",
          missing,
          proposed: {
            pages: [...data.pages, ...missing],
          },
          reason: "missing pages",
        };
      }
    } else {
      // Unknown shape: propose merging under pages key
      proposals[path.relative(repoRoot, mPath)] = {
        action: "no-pages-key",
        proposed: { pages },
        reason: "manifest exists but has no 'pages' array",
      };
    }
  }

  out.report = humanReportLines.join("\n");
  if (Object.keys(proposals).length > 0) out.proposals = proposals;

  // Print human-readable report first
  logger.info(out.report);
  if (out.proposals) {
    logger.info("\nProposals (dry-run, no files will be written):");
    logger.info(JSON.stringify(out.proposals, null, 2));
  } else {
    logger.info(
      "\nNo proposals — manifests appear to contain all discovered pages or are not applicable.",
    );
  }

  // Print machine-readable JSON as final output
  logger.info("\nJSON_OUTPUT_START");
  logger.info(JSON.stringify(out, null, 2));
  logger.info("JSON_OUTPUT_END");
  // Success
  process.exit(0);
}

if (require.main === module) {
  main().catch((err) => {
    // Unexpected error should write to stderr and exit non-zero
    logger.error("Unexpected error:", err);
    process.exit(1);
  });
}
