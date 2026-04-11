# Init Enhanced — Documentation Sync

## Goals

- Produce a reproducible, auditable process to sync repository documentation with source of truth.
- Collect authoritative files, run validations, capture outputs, and produce an actionable Issue Catalog.
- Make minimal, incremental fixes (docs + small code changes) and provide a clear rollback path.

## Scope

- Repo-wide documentation and light code hygiene only: env validation, DAL/actions/Zod hygiene, CI/test commands, and high-value docs under AGENTS.md, .opencode, .cursor, and .github.
- This plan does NOT include large refactors or UI extraction work — those will be separate plans.

## Target Files

- AGENTS.md
- package.json (scripts)
- app-config.ts, lib/env.ts
- database/schema.ts
- types/next-auth.d.ts
- .cursor/rules/\*\*
- .opencode/instructions/\*\*
- .opencode/skills/\*\*
- .github/instructions/\*\*
- docs/ (write audits here)

## Risks

- Running validation (tests/lint/build) can be slow and may expose unrelated failures.
- Making schema or migration edits requires careful DB migration planning — avoid in-place destructive changes.
- Multiple plan locations exist (.opencode/plans vs .cursor/plans); this plan uses .opencode/plans per repository guidance in init-enhanced.

## Planned Changes

1. Phase 1 — Discovery & Verification
   - Gather authoritative files (Glob + Grep + Read) and capture them under docs/audit-snapshots/
2. Phase 2 — Run Validation Commands (ask for confirmation before executing)
   - format:check, type-check, lint:strict, test:browser (Vitest), test:ui (Playwright)
3. Phase 3 — Analyze outputs and create Issue Catalog (docs/issue-catalog.md)
4. Phase 4 — Checkpoint commit (cherry-pick docs/ and plan files only)
5. Phase 5 — Small, safe fixes (Zod.describe, auth checks in actions, DAL N+1 fixes). Each fix in separate small commits.
6. Phase 6 — Re-run validations and publish report (docs/init-enhanced-report.md)

## Validation

- Each planned change maps to a verification step. Example:
  - Add missing `.describe()` in Zod schemas → run `npm run type-check` and `npm run lint:strict` (zod rules)
  - Fix DAL N+1 patterns → add targeted unit tests or run query logs

## Rollback or Mitigation

- Keep commits small and descriptive; include migration down-scripts when adding migrations.
- If tests fail after a change, revert the commit and open a targeted follow-up plan to fix the root cause.

## Next Steps (immediate)

1. Confirm you want me to run the Phase 2 validation commands (they will run sequentially and capture outputs to the repo root as \*.txt files).
2. If confirmed, I'll run format/type-check/lint/tests and then produce the Issue Catalog.

---

Plan created: init-enhanced_f4c8b2a1.plan.md
