---
title: Init-Enhanced Documentation Sync (Plan)
summary: Prepared plan file for init-enhanced documentation sync; use this to apply the checklist and run the verification steps.
---

# Init-Enhanced Documentation Sync — Plan

## Purpose

This plan contains the prepared, review-ready content for the `/init-enhanced` documentation-sync checklist. It is intended to be placed under `.opencode/plans/` for maintainers and agents to review, update, and apply. The content mirrors the recommended `.opencode/commands/init-enhanced.md` but is stored as a plan artifact so it can be reviewed and approved before applying to the commands directory.

## What this plan includes

- A comprehensive, agent-friendly checklist to sync repository documentation with source code
- Repo validation commands and capture locations
- Issue Catalog schema and remediation workflow
- GitHub CLI examples and a helper script template to create issues from the catalog
- Codemap guidance (generic + example path)
- Troubleshooting steps for common pre-commit hook failures
- Testing matrix and changelog guidance

## Location to apply final content

Recommended final destination (maintainer action):

`.opencode/commands/init-enhanced.md`

This plan file is a review artifact. After approval, maintainers should copy the contents into the commands location above (or let an authorized agent apply it directly) and make a small checkpoint commit following the plan's guidance.

## Prepared content (summary)

1. Discovery & authoritative inventory:
   - Collect AGENTS.md, package.json, app-config.ts, lib/env.ts, scripts/**, scripts/ts/**, .opencode/**, .cursor/**, database/schema.ts, docs/\*\*
   - Produce `inventory.json` under `.opencode/outputs/init-enhanced/`

2. Repo validation:
   - Run format, type-check, lint, verify-rules and capture outputs under `.opencode/outputs/init-enhanced/`.

3. Output analysis & Issue Catalog:
   - Parse outputs and produce `.opencode/reports/init-enhanced-issue-catalog.json` with schema: file, line, message, severity, type, suggested_fix, priority, estimated_hours, component, related_files, provenance.

4. Checkpoint commit (docs-only):
   - `git add` and `git commit` the report(s) with provenance in commit body. Do not bypass hooks.

5. Documentation updates (small patches):
   - Keep patches <=7 files. Include provenance in commit body. Use `chore(docs):` prefix.

6. Final verification & PR:
   - Run full verification, tests, and open PR with provenance and checklist.

## Automation helpers included in the plan

- Example `gh issue create` command for a single issue (with provenance)
- A TypeScript helper sketch `scripts/ts/tools/create-issues-from-catalog.ts` to create issues in bulk from the Issue Catalog JSON
- Node snippet to generate `inventory.json`

## Codemap guidance

- Document how to run a codemap (expensive) on a powerful machine. Example path: `npx tsx .opencode/tools/cartography/generate-codemap.ts --out .opencode/reports/codemap.json`. If your repo uses a different generator path, adjust accordingly.

## Troubleshooting pre-commit hooks

- If a hook blocks commits: run the underlying tool locally (e.g., `npm run format`, `npm run type-check`, `npx lint-staged --debug`) and fix issues.
- Only use `--no-verify` when explicitly approved by maintainers and record justification in the PR.

## Testing matrix & changelog guidance

- Node versions: document supported Node versions (recommended: Node 18/20; CI uses Node 22).
- OS: Linux (Ubuntu), macOS, Windows — test wrappers on all where applicable.
- Changelog: for doc-only changes, include `docs:` entries with provenance and PR link.

## Next steps (what I will not do without your explicit permission)

1. I will not apply this plan into `.opencode/commands/init-enhanced.md` without explicit permission (your initial preference was to prepare only).
2. I will not create git commits or open PRs without your explicit request.

## Instructions to apply locally

1. Copy this plan content (or `git apply` a patch) into `.opencode/commands/init-enhanced.md`.
2. Run Phase 2 validation commands and follow the plan.

## Provenance

Prepared by automated agent (orchestrator) based on your instructions. Review and confirm before committing into commands.
