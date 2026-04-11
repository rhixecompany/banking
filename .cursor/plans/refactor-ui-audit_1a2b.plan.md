# Refactor UI & Audit Plan (refactor-ui-audit-20260411-1a2b)

## Goals

- Execute the full audit and refactor plan covering docs, DB schema, Actions/Zod/DALs, UI components, and scripts.
- Keep changes additive and focused; ensure test suite passes and migrations applied.

## Scope

- Files touched: docs/, .opencode/commands/init-enhanced.md, database/schema.ts, lib/actions/, lib/dal/ (or dal/), components/, scripts/, tests/.

## Target Files

- .opencode/commands/init-enhanced.md
- database/schema.ts
- lib/actions/\*_/_ (server actions)
- lib/dal/**/\* or dal/**/\*
- components/layouts/\*_/_
- scripts/\* (replace with Node AST-safe scripts)
- docs/\*.md (new audits and inventories)

## Risks

- Migrations may require data backfill; will keep additive only and provide rollback guidance.
- Tests may fail due to existing unstaged local changes — ensure local changes are preserved.

## Planned Changes

1. Add this plan file (required by repo rules for >3 file changes).
2. Update .opencode/commands/init-enhanced.md (docs only).
3. Run format/type-check/lint locally and run unit tests.
4. Produce audit docs under docs/ and implement schema diffs.
5. Implement Actions/Zod/DAL fixes, add tests.
6. Extract components/layouts and migrate pages incrementally.
7. Replace scripts with Node AST-safe versions supporting --dry-run.

## Validation

- Run: npm run format:check, npm run type-check, npm run lint:strict.
- Run: npm run test:browser (Vitest) and npm run test:ui (Playwright) after freeing port 3000.

## Rollback or Mitigation

- Keep commits small; if migrations fail, revert schema changes and provide down migrations.

## Notes

- Branch: feature/refactor-ui-audit-20260411-1a2b (local only)
