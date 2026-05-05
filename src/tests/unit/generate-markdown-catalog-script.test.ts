import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

/* eslint-disable security/detect-non-literal-fs-filename */
import {
  extractFirstH1,
  extractFrontmatter,
  extractSelectedFrontmatterFields,
  generateCatalogMarkdown,
  toPosixPath,
} from "../../scripts/ts/docs/generate-markdown-catalog";

describe("generate-markdown-catalog helpers", () => {
  it("extracts YAML frontmatter and first H1", () => {
    const md = [
      "---",
      "title: Hello",
      "description: World",
      "lastReviewed: 2026-04-24",
      "plan name: Sample Plan",
      "---",
      "",
      "# Heading One",
      "",
      "```ts",
      "# Not a heading",
      "```",
      "",
    ].join("\n");

    const { body, frontmatter } = extractFrontmatter(md);
    expect(body).toContain("# Heading One");

    const h1 = extractFirstH1(body);
    expect(h1).toBe("Heading One");

    const selected = extractSelectedFrontmatterFields(frontmatter);
    expect(selected).toMatchObject({
      description: "World",
      lastReviewed: "2026-04-24",
      "plan name": "Sample Plan",
      title: "Hello",
    });
  });

  it("generates deterministic markdown sorted by path", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "md-catalog-"));
    const a = path.join(tmp, "docs", "a.md");
    const b = path.join(tmp, ".opencode", "commands", "b.plan.md");

    await fs.mkdir(path.dirname(a), { recursive: true });
    await fs.mkdir(path.dirname(b), { recursive: true });

    await fs.writeFile(a, "# Alpha\n", "utf8");
    await fs.writeFile(
      b,
      [
        "---",
        "status: in-progress",
        "phase: 1",
        "updated: 2026-04-24",
        "---",
        "",
        "# Plan B",
        "",
      ].join("\n"),
      "utf8",
    );

    const markdown = generateCatalogMarkdown([
      {
        frontmatter: extractSelectedFrontmatterFields(
          extractFrontmatter(await fs.readFile(b, "utf8")).frontmatter,
        ),
        notes: "",
        path: toPosixPath(path.relative(tmp, b)),
        titleOrH1: extractFirstH1(
          extractFrontmatter(await fs.readFile(b, "utf8")).body,
        ),
      },
      {
        frontmatter: extractSelectedFrontmatterFields(
          extractFrontmatter(await fs.readFile(a, "utf8")).frontmatter,
        ),
        notes: "",
        path: toPosixPath(path.relative(tmp, a)),
        titleOrH1: extractFirstH1(
          extractFrontmatter(await fs.readFile(a, "utf8")).body,
        ),
      },
    ]);

    expect(markdown).toContain("| Path | Title/H1 | Frontmatter | Notes |");
    // Ensure sorting by path (b comes before docs/a).
    expect(markdown.indexOf("`./.opencode/commands/b.plan.md`")).toBeLessThan(
      markdown.indexOf("`./docs/a.md`"),
    );
    // Ensure posix path rendering.
    expect(markdown).toContain("`./docs/a.md`");
    // Ensure selected frontmatter key/value appears.
    expect(markdown).toMatch(/status:\s*in-progress/);
  });
});
