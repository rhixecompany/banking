#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SELECTED_FRONTMATTER_KEYS = [
  "title",
  "description",
  "updated",
  "lastReviewed",
  "status",
  "phase",
  "plan name",
  "plan description",
  "plan status",
] as const;

type SelectedFrontmatterKey = (typeof SELECTED_FRONTMATTER_KEYS)[number];

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export interface CatalogEntry {
  frontmatter: Partial<Record<SelectedFrontmatterKey, string>>;
  notes: string;
  path: string;
  titleOrH1: string;
}

export function toPosixPath(filePath: string): string {
  const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  return normalized.startsWith("./") ? normalized : `./${normalized}`;
}

export function extractFrontmatter(markdown: string): {
  body: string;
  frontmatter: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(markdown);

  if (!match) {
    return { body: markdown, frontmatter: "" };
  }

  return {
    body: markdown.slice(match[0].length),
    frontmatter: match[1],
  };
}

export function extractSelectedFrontmatterFields(
  frontmatter: string,
): Partial<Record<SelectedFrontmatterKey, string>> {
  const selected = new Map<SelectedFrontmatterKey, string>();
  const wanted = new Set<string>(SELECTED_FRONTMATTER_KEYS);

  for (const rawLine of frontmatter.split(/\r?\n/)) {
    const line = rawLine.trim();
    const separatorIndex = line.indexOf(":");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim() as SelectedFrontmatterKey;

    if (!wanted.has(key)) {
      continue;
    }

    const rawValue = line.slice(separatorIndex + 1).trim();
    selected.set(key, stripWrappingQuotes(rawValue));
  }

  return Object.fromEntries(selected.entries()) as Partial<
    Record<SelectedFrontmatterKey, string>
  >;
}

export function extractFirstH1(markdownBody: string): string {
  let inFence = false;

  for (const line of markdownBody.split(/\r?\n/)) {
    if (/^(```|~~~)/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      return trimmed.slice(2).trim();
    }
  }

  return "";
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function renderFrontmatter(
  frontmatter: Partial<Record<SelectedFrontmatterKey, string>>,
): string {
  const parts = SELECTED_FRONTMATTER_KEYS.flatMap((key) => {
    const value = frontmatter[key];
    return value ? `${key}: ${value}` : [];
  });

  return parts.length > 0 ? parts.join("; ") : "-";
}

function inferNotes(filePath: string): string {
  const notes: string[] = [];

  if (filePath.startsWith(".opencode/commands/")) {
    notes.push("purpose: plan/history artifact");
    notes.push("owner: Implementer");
    notes.push("status: keep");
    notes.push("action: format-only");
    return notes.join("; ");
  }

  if (filePath === "docs/README.md") {
    notes.push("purpose: docs index");
    notes.push("owner: Maintainer");
    notes.push("status: update");
    notes.push("action: keep links aligned with living docs");
    return notes.join("; ");
  }

  if (filePath === "docs/markdown-catalog.md") {
    notes.push("purpose: generated docs catalog");
    notes.push("owner: Implementer");
    notes.push("status: keep");
    notes.push("action: regenerate with npm run docs:markdown-catalog");
    return notes.join("; ");
  }

  if (filePath.startsWith("docs/docker/")) {
    notes.push("purpose: Docker deployment docs");
    notes.push("owner: Maintainer");
    notes.push("status: keep");
    notes.push(
      "related: docs/deploy-to-hostinger.md, docs/services/traefik.md",
    );
    return notes.join("; ");
  }

  if (filePath.startsWith("docs/plans/")) {
    notes.push("purpose: legacy plan mirror");
    notes.push("owner: Implementer");
    notes.push("status: archive");
    notes.push("related: .opencode/commands/*.plan.md");
    notes.push("action: retain as legacy docs-only history");
    return notes.join("; ");
  }

  if (filePath.startsWith("docs/specs/")) {
    notes.push("purpose: repo spec artifact");
    notes.push("owner: Product Owner");
    notes.push("status: merge");
    notes.push("related: docs/plans/, .opencode/commands/");
    notes.push("action: consolidate with plan references");
    return notes.join("; ");
  }

  if (filePath.startsWith("docs/sections/")) {
    notes.push("purpose: split agent rules snapshot");
    notes.push("owner: Maintainer");
    notes.push("status: archive");
    notes.push("related: AGENTS.md, docs/AGENTS-CANONICAL.md");
    notes.push("action: preserve as generated reference only");
    return notes.join("; ");
  }

  if (
    filePath.startsWith("docs/issue-catalogs/") ||
    filePath.startsWith("docs/checkpoints/") ||
    filePath.startsWith("docs/init-enhanced-discovery/")
  ) {
    notes.push("purpose: generated checkpoint/discovery artifact");
    notes.push("owner: Implementer");
    notes.push("status: archive");
    notes.push("action: preserve for provenance");
    return notes.join("; ");
  }

  if (filePath.startsWith("docs/services/")) {
    notes.push("purpose: service/vendor reference");
    notes.push("owner: Maintainer");
    notes.push("status: merge");
    notes.push(
      "action: consolidate with product-specific docs where overlap exists",
    );
    return notes.join("; ");
  }

  if (filePath.includes("plaid")) {
    notes.push("purpose: Plaid reference or audit");
    notes.push("owner: Maintainer");
    notes.push("status: merge");
    notes.push("related: docs/plaid/, docs/services/plaid-api.md");
    notes.push("action: prefer one project-specific Plaid hub");
    return notes.join("; ");
  }

  if (filePath.includes("dwolla")) {
    notes.push("purpose: Dwolla reference or guide");
    notes.push("owner: Maintainer");
    notes.push("status: merge");
    notes.push("related: docs/services/dwolla-api.md");
    notes.push("action: prefer one Dwolla hub with scenario guides");
    return notes.join("; ");
  }

  if (
    /eslint|typescript|next-js|drizzleormguide|getstartedwith|guides-context/i.test(
      filePath,
    )
  ) {
    notes.push("purpose: imported upstream context snapshot");
    notes.push("owner: Maintainer");
    notes.push("status: deprecate");
    notes.push(
      "action: replace with links to canonical project guidance or upstream docs",
    );
    return notes.join("; ");
  }

  if (
    filePath === "docs/app-pages.md" ||
    filePath === "docs/custom-components.md" ||
    filePath === "docs/test-context.md"
  ) {
    notes.push("purpose: current project inventory");
    notes.push("owner: Implementer");
    notes.push("status: keep");
    notes.push("action: update when code structure changes");
    return notes.join("; ");
  }

  if (
    /audit|evidence_map|review-comments|dal-schedule|issue-catalog/.test(
      filePath,
    )
  ) {
    notes.push("purpose: audit or review record");
    notes.push("owner: Reviewer");
    notes.push("status: merge");
    notes.push("action: consolidate findings into fewer maintained audit docs");
    return notes.join("; ");
  }

  if (
    /README\.(agents|hooks|instructions|plugins|skills|workflows)\.md|MIGRATION-SUMMARY|schema-design|init-awesome-opencode/.test(
      filePath,
    )
  ) {
    notes.push("purpose: imported opencode reference");
    notes.push("owner: Maintainer");
    notes.push("status: archive");
    notes.push(
      "action: keep as migration history, not active project guidance",
    );
    return notes.join("; ");
  }

  notes.push("purpose: project documentation");
  notes.push("owner: unknown");
  notes.push("status: review");
  notes.push("action: classify during next consolidation batch");
  return notes.join("; ");
}

function getTrackedMarkdownFiles(cwd: string): string[] {
  const output = execFileSync("git", ["ls-files", "*.md"], {
    cwd,
    encoding: "utf8",
  });

  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

function buildCatalogEntry(cwd: string, filePath: string): CatalogEntry {
  const absolutePath = path.join(cwd, filePath);
  const markdown = readFileSync(absolutePath, "utf8");
  const { body, frontmatter } = extractFrontmatter(markdown);
  const selectedFrontmatter = extractSelectedFrontmatterFields(frontmatter);
  const titleOrH1 = extractFirstH1(body) || path.basename(filePath);

  return {
    frontmatter: selectedFrontmatter,
    notes: inferNotes(filePath),
    path: filePath,
    titleOrH1,
  };
}

function renderConsolidationMap(): string[] {
  return [
    "## Consolidation Map",
    "",
    "- `docs/plans/**` -> treat as legacy mirrors of plan work; keep for history, prefer `.opencode/commands/**` for canonical plans.",
    "- `docs/specs/**` -> consolidate with linked plan context and reduce duplicate spec text where mirrored elsewhere.",
    "- `docs/plaid*.md`, `docs/plaid/**`, `docs/services/plaid-api.md` -> merge toward one Plaid hub plus app-specific audits.",
    "- `docs/dwolla*.md`, `docs/services/dwolla-api.md` -> merge toward one Dwolla hub plus scenario guides.",
    "- `docs/sections/**`, `docs/AGENTS-CANONICAL.md` -> archive as generated snapshots; root `AGENTS.md` stays canonical.",
    "- `docs/issue-catalogs/**`, `docs/checkpoints/**`, `docs/init-enhanced-discovery/**` -> archive as provenance artifacts.",
    "- `docs/*-context.md`, `docs/DrizzleORMGuide-*.md`, `docs/eslint-*.md` -> deprecate as imported upstream snapshots unless made project-specific.",
  ];
}

export function generateCatalogMarkdown(entries: CatalogEntry[]): string {
  const sortedEntries = [...entries].sort((left, right) =>
    left.path.localeCompare(right.path),
  );

  const lines = [
    "# Markdown Catalog",
    "",
    "<!-- markdownlint-disable MD034 -->",
    "",
    "Inventory of tracked Markdown files across `docs/**` and `.opencode/commands/**` plus other tracked repo Markdown.",
    "",
    "## Catalog Rules",
    "",
    "- Paths are deterministic and sorted lexicographically.",
    "- `Frontmatter` shows selected stable fields only.",
    "- `Notes` captures purpose, likely owner/persona, triage status, related docs, and the next recommended action.",
    "- `.opencode/commands/**` entries are treated as immutable history and should receive format-only changes.",
    "",
    ...renderConsolidationMap(),
    "",
    "## Inventory",
    "",
    "| Path | Title/H1 | Frontmatter | Notes |",
    "| --- | --- | --- | --- |",
  ];

  for (const entry of sortedEntries) {
    lines.push(
      `| \`${escapeCell(entry.path)}\` | ${escapeCell(entry.titleOrH1 || "-")} | ${escapeCell(renderFrontmatter(entry.frontmatter))} | ${escapeCell(entry.notes || "-")} |`,
    );
  }

  lines.push("");
  return lines.join("\n");
}

function main(): void {
  const cwd = process.cwd();
  const shouldWrite = process.argv.includes("--write");
  const markdownFiles = getTrackedMarkdownFiles(cwd);
  const entries = markdownFiles.map((filePath) =>
    buildCatalogEntry(cwd, filePath),
  );
  const markdown = generateCatalogMarkdown(entries);

  if (!shouldWrite) {
    process.stdout.write(markdown);
    return;
  }

  const outputPath = path.join(cwd, "docs", "markdown-catalog.md");
  writeFileSync(outputPath, markdown, "utf8");
  process.stdout.write(`Wrote ${path.relative(cwd, outputPath)}\n`);
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  main();
}
