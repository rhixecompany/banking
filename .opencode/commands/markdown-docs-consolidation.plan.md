---
status: in-progress
phase: 1
updated: 2026-04-24
---

# Plan: markdown-docs-consolidation

## Summary

Inventory every Markdown file under `docs/**` and `.opencode/commands/**`, build a single catalog with purpose/metadata/links, and safely consolidate documentation in `docs/**` while treating `.opencode/commands/**` as immutable history (format-only).

In parallel, harden repo-wide markdownlint by updating `.markdownlintrc.json` with sensible defaults and explicit overrides for `.opencode/commands/**` (plan YAML frontmatter and structure).

## Guardrails

- `.opencode/commands/**` is immutable history:
  - Do not delete or move existing files.
  - Allow only format-only changes and minimal metadata normalization where required.
- Consolidation (merge/deprecate/remove/archive) is **docs-only** (`docs/**`).
- Before any doc removal or rename in `docs/**`, check inbound references and links; prefer a stub/redirect note when a path is widely referenced.
- Keep changes incremental and re-run markdown checks after each batch.

## Catalog deliverable

- Create/maintain a single catalog in `docs/**` that includes, at minimum:
  - Path
  - Purpose
  - Updated / lastReviewed (if present)
  - Owner/persona (if known)
  - Status (keep/update/merge/deprecate/remove/archive)
  - Duplicates / related docs
  - Action notes and links

Suggested location: `docs/markdown-catalog.md`.

## markdownlint config deliverable

- Update `.markdownlintrc.json` to:
  - Enforce repo-wide markdownlint.
  - Allow YAML frontmatter and plan structure for `.opencode/commands/**`.
  - Add explicit overrides/ignores for known special-case paths (including `.opencode/commands/**`).

## Incremental fix order

Apply formatting/lint fixes in this order:

1. `docs/**` (includes consolidation work)
2. `.opencode/commands/**` (format-only)
3. The rest of the repository (`**/*.md`)

After each batch, re-run `npm run format:markdown:check`.

## Docs consolidation policy (docs/\*\* only)

- Triage each `docs/**` Markdown file using a rubric (keep/update/merge/deprecate/remove/archive).
- Group duplicates and draft a consolidation map describing:
  - Source docs
  - Target doc(s)
  - Which indexes need updates
  - Whether to add a stub note for redirects
- Perform safety checks before merges/removals:
  - Repo-wide reference search for candidate paths.
  - Link integrity checks for index docs.

## Idea (from planning toolkit)

Inventory every Markdown file under `docs/**` and `.opencode/commands/**`, build a single catalog with purpose/metadata/links, triage duplicates, dead, and outdated docs using a defined rubric, and then consolidate safely (with reference/link checks). Harden repo-wide markdownlint by updating `.markdownlintrc.json` with sensible defaults and explicit overrides for `.opencode/commands/**` (plan frontmatter/structure), then run incremental formatting fixes until markdownlint passes across the repo.

## Implementation (from planning toolkit)

- Confirm scope and guardrails: `.opencode/commands/**` is treated as immutable history (no deletions/moves; formatting/minimal metadata only) and markdownlint is enforced repo-wide with overrides for special cases.
- Generate a complete inventory of `**/*.md`, with emphasis on `docs/**` and `.opencode/commands/**`; read each file and extract metadata (title, headings, frontmatter, updated/lastReviewed, status) and outbound links.
- Create/maintain a markdown catalog table (path, purpose, lastReviewed/updated, owner/persona, status, duplicates, action) covering all files in scope.
- Apply triage rubric to classify each doc (keep/update/merge/deprecate/remove/archive) and group duplicates; draft a consolidation map describing intended merges/deprecations and which index docs need updating.
- Run safety checks before any merges/removals: repo-wide reference search for candidate paths, and link integrity checks for index docs; choose stub redirect note vs removal where appropriate (prefer stub for commonly referenced docs).
- Update `.markdownlintrc.json` to align with repo doc style and repo-wide enforcement; add overrides/ignores so `.opencode/commands/**` plan formats and YAML frontmatter are lint-safe.
- Run markdownlint baseline, then apply fixes incrementally: first `docs/**`, then `.opencode/commands/**`, then remaining repo markdown; resolve non-autofix issues manually while preserving required plan structure.
- After each consolidation batch, re-run markdownlint checks and update indexes; finish when `npm run format:markdown:check` passes with zero errors repo-wide.

## Required Specs

- `docs/specs/enhance-pages-spec.md`
- `docs/specs/enhance-pages-v2.md`
- `docs/specs/root-tests.md`

## Verification

- `npm run format:markdown:check`
