# Ensure Plan Or Merge

Last Reviewed: 2026-04-17

## Goals

- Make the repository rule ("When a task is expected to change more than 7 files, create a plan before implementation") actionable and developer-friendly by:
  1. Searching for existing plans that may already cover a large change.
  2. Assisting the contributor to merge new context into an existing plan (interactive) or scaffold a new plan.
  3. Providing a non-interactive "build mode" (CI) that checks for plan coverage and gives actionable feedback during a pilot rollout.

## Scope

- Authoritative docs to update (after plan review): AGENTS.md, .opencode/instructions/09-plan-file-standards.md, .opencode/instructions/00-task-sync-note.md.
- Automation to add: scripts/plan-ensure.ts (TypeScript), extend scripts/verify-rules.ts with optional plan-check flag.
- CI: add GitHub Actions job "plan-check" that runs plan-ensure in non-interactive CI mode (pilot: warning).
- Tests: unit tests and integration tests for plan-ensure logic and verify-rules integration.

## Trigger

- The workflow is triggered when the set of changed files for a task/commit/PR is greater than 7 files (strictly > 7).

## High-level behavior

- Local interactive mode: identify changed files, search candidates, create merged draft or scaffold new plan, open editor for edits, run markdownlint.
- CI mode: non-interactive; search for candidates and post PR comments with suggestions; pilot mode warns instead of blocking.

## Implementation checklist

- Add scripts/plan-ensure.ts
- Add tests/unit/plan-ensure.\*.test.ts
- Add tests/integration/plan-check.ci.test.ts
- Modify scripts/verify-rules.ts (add --require-plan-for-large-changes flag)
- Modify package.json (add "plan:ensure" script)
- Add GitHub Actions workflow .github/workflows/plan-check.yml
- Update AGENTS.md and .opencode/instructions/09-plan-file-standards.md (after review)

## Provenance

- Created from repository review and user-approved design on 2026-04-17.
