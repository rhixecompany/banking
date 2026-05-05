---
plan name: markdown-docs-consolidation
plan description: Docs catalog and lint
plan status: active
---

## Idea

Inventory every Markdown file under `docs/**` and `.opencode/commands/**`, build a single catalog with purpose/metadata/links, triage duplicates, dead, and outdated docs using a defined rubric, and then consolidate safely (with reference/link checks). Harden repo-wide markdownlint by updating `.markdownlintrc.json` with sensible defaults and explicit overrides for `.opencode/commands/**` (plan frontmatter/structure), then run incremental formatting fixes until markdownlint passes across the repo.

## Implementation

- Confirm scope and guardrails: `.opencode/commands/**` is treated as immutable history (no deletions/moves; formatting/minimal metadata only) and markdownlint is enforced repo-wide with overrides for special cases.
- Generate a complete inventory of `**/*.md`, with emphasis on `docs/**` and `.opencode/commands/**`; read each file and extract metadata (title, headings, frontmatter, updated/lastReviewed, status) and outbound links.
- Create/maintain a markdown catalog table (path, purpose, lastReviewed/updated, owner/persona, status, duplicates, action) covering all files in scope.
- Apply triage rubric to classify each doc (keep/update/merge/deprecate/remove/archive) and group duplicates; draft a consolidation map describing intended merges/deprecations and which index docs need updating.
- Run safety checks before any merges/removals: repo-wide reference search for candidate paths, and link integrity checks for index docs; choose “stub redirect note” vs removal where appropriate (prefer stub for commonly referenced docs).
- Update `.markdownlintrc.json` to align with repo doc style and repo-wide enforcement; add overrides/ignores so `.opencode/commands/**` plan formats and YAML frontmatter are lint-safe.
- Run markdownlint baseline, then apply fixes incrementally: first `docs/**`, then `.opencode/commands/**`, then remaining repo markdown; resolve non-autofix issues manually while preserving required plan structure.
- After each consolidation batch, re-run markdownlint checks and update indexes; finish when `npm run format:markdown:check` passes with zero errors repo-wide.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
<!-- SPECS_END -->
