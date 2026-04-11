# Documentation Normalization: Import & Plan Path Canonicalization

## Goals

- Normalize documentation references across the repository so automated agents and contributors use a single canonical form for imports and plan locations.
  - Replace legacy references: `@/lib/dal` -> `@/dal`, `@/lib/actions` -> `@/actions`, `lib/dal/` -> `dal/`, `lib/actions/` -> `actions/` in documentation files only. Note: references to `.cursor/plans/` should be flagged for human review and converted to `.opencode/plans/` only after confirmation (do not move/delete plan files).
- Ensure code examples in docs follow Zod and ESLint expectations (e.g., `.describe()` and explicit validator messages) and match executable sources of truth.

## Scope

- Files to modify: all documentation-only files (_.md, _.mdx, _.txt, _.json under repo) that contain the target legacy patterns. DO NOT modify TypeScript/JS source files.
- Do not create git commits automatically; leave edits in working tree uncommitted for review.

## Target Files

- All .md/.mdx/.txt/.json files containing any of the patterns:
  - `@/lib/dal`
  - `@/lib/actions`
  - `lib/dal/`
  - `lib/actions/`
  - `.cursor/plans/` (flagged: historical references — do not change unless confirmed; convert only after human review)

- High-priority files already identified:
  - AGENTS.md
  - README.opencode.md
  - .opencode/commands/\*\*
  - .opencode/instructions/\*\*
  - .opencode/skills/\*/SKILL.md
  - .cursor/plans/\*.plan.md (convert references only)
  - .github/copilot-instructions.md

## Risks

- Large prompt/plan files contain sensitive formatting; careless replacements can break prompt semantics or code fences.
- Replacing strings inside code fences must preserve exact formatting and examples. Some examples may intentionally use legacy paths; those will be updated only when safe.
- Changes may surface TypeScript or lint errors in code examples; we will update examples to comply (without touching real source files).

## Planned Changes

1. Run a repo-wide search to list all documentation files containing the target patterns.
2. Edit files in small batches (10–30 files) to apply canonical replacements, reviewing each replacement to preserve formatting and code fences.
3. Rewrite remaining SKILL.md files to the canonical SKILL.md template where necessary, keeping examples accurate.
4. Convert `.cursor/plans/` references to `.opencode/plans/` in docs (do not move or delete existing plan files).
5. After edits, run markdown lint/format, then `npm run type-check`, then `npm run lint:strict` and fix doc examples that cause issues.

## Validation

- Verify replacements applied only to documentation files by re-running the same search and confirming zero matches for the legacy patterns in docs.
- Run markdown linter (repo's preferred tool) and fix violations.
- Run `npm run type-check` and address any type errors originating from code examples in docs.
- Optionally run `npm run lint:strict` and fix lint warnings/errors from examples.

## Rollback or Mitigation

- Changes will be left uncommitted. If an issue is found, we can discard edits from the working tree or selectively revert files before committing.
- If a particular file is sensitive (large prompt/plan), revert changes for that file and open it for manual review instead.

## Timeline & Next Steps

1. Await your confirmation to proceed.
2. On approval: perform repo-wide search and apply changes in batches, running validations after each batch.
3. Provide a changelog/diff summary and wait for your instruction to commit or adjust scope.

---

Created: 2026-04-11 Author: OpenCode
