import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function getTrackedMarkdownFiles(): string[] {
  const res = spawnSync("git", ["ls-files", "*.md"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  expect(res.status, res.stderr || "git ls-files failed").toBe(0);

  return res.stdout
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getCatalogPathSet(markdown: string): Set<string> {
  const set = new Set<string>();
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(/^\|\s+`([^`]+)`\s+\|/);
    if (m) set.add(m[1]);
  }
  return set;
}

describe("docs/markdown-catalog.md", () => {
  it("has valid table structure", () => {
    const catalogPath = path.join(process.cwd(), "docs", "markdown-catalog.md");
    const catalog = readFileSync(catalogPath, "utf8");

    // Table columns required by task.
    expect(catalog).toContain("| Path | Title/H1 | Frontmatter | Notes |");

    // Deterministic output (no generation timestamps).
    expect(catalog).not.toMatch(
      /Generated\s+at|Generated\s+on|Last\s+generated/i,
    );
  });

  it("includes key project directories", () => {
    const catalogPath = path.join(process.cwd(), "docs", "markdown-catalog.md");
    const catalog = readFileSync(catalogPath, "utf8");
    const inCatalog = getCatalogPathSet(catalog);

    // At minimum, docs/** and .opencode/commands/** must be included.
    expect(
      [...inCatalog].some((p) => p.startsWith("docs/") && p.includes(".")),
    ).toBe(true);
    expect(
      [...inCatalog].some((p) => p.startsWith(".opencode/commands/")),
    ).toBe(true);
  });
});
