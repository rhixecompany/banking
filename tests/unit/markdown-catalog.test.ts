import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function getTrackedMarkdownFiles(): string[] {
  const res = spawnSync("git", ["ls-files", "*.md"], {
    encoding: "utf8",
    cwd: process.cwd(),
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
  it("lists all tracked markdown files deterministically", () => {
    const catalogPath = path.join(process.cwd(), "docs", "markdown-catalog.md");
    const catalog = readFileSync(catalogPath, "utf8");

    // Table columns required by task.
    expect(catalog).toContain("| Path | Title/H1 | Frontmatter | Notes |");

    // Deterministic output (no generation timestamps).
    expect(catalog).not.toMatch(
      /Generated\s+at|Generated\s+on|Last\s+generated/i,
    );

    const tracked = getTrackedMarkdownFiles();
    const inCatalog = getCatalogPathSet(catalog);

    for (const mdPath of tracked) {
      expect(inCatalog.has(mdPath)).toBe(true);
    }

    // At minimum, docs/** and .opencode/commands/** must be included.
    expect(tracked.some((p) => p.startsWith("docs/") && inCatalog.has(p))).toBe(
      true,
    );
    expect(
      tracked.some(
        (p) => p.startsWith(".opencode/commands/") && inCatalog.has(p),
      ),
    ).toBe(true);
  });
});
