---
title: UI Refactor & Test Coverage Plan
date: 2026-04-17
version: 1.0
author: OpenCode (automated assist)
---

# Goals

- Implement Phase 1 (Schema & Validation Audit) for the frontend UI refactor plan.
- Centralize and standardize Zod schemas under `lib/schemas/` and ensure every field uses `.describe()` per repo rules.
- Fix a small set of server actions to use the centralized schemas and pass lint/type checks.

## Scope

- This plan covers the initial Phase 1 changes only (schemas and immediate action updates required to unblock lint/type checks).
- Files modified: `lib/schemas/auth.schema.ts`, (plan file), and follow-up changes in actions will be prepared after review.

## Target Files

- lib/schemas/auth.schema.ts
- actions/register.ts (consumes signUpSchema)
- actions/updateProfile.ts (consumes UpdateProfileSchema)

## Planned Changes (Phase 1)

1. Replace all `.meta({ description })` uses in `lib/schemas/auth.schema.ts` with `.describe("...")` so that schemas satisfy the repository rule requiring `.describe()`.
2. Fix minor zod refine option shape (use `message:` instead of `error:`) for password confirmation.
3. Leave existing schema filenames and exports intact (backward-compatible). Exported TS types remain available via `z.infer`.
4. Add this plan file under `.opencode/commands/` to comply with the >7-file-change policy for subsequent multi-file work.

## Exact patch snippets (to be applied)

- lib/schemas/auth.schema.ts: replace `.meta({ description: "..." })` with `.describe("...")` for all fields and update refine option to `{ message: "...", path: [...] }`.

## Validation Steps

1. Run `npm run format` (formats changed files).
2. Run `npm run type-check` locally for the touched files.
3. Run relevant unit tests for register/updateProfile if available (Vitest subset).

## Branch & PR

- Branch name: `feat/ui-refactor/schemas-phase1`.
- PR labels: `type:refactor`, `area:ui`, `needs-plan-if>7`.
- Default suggested reviewer: @you (per preference).

## Rollback/Mitigation

- Changes are limited and reversible. If issues are detected, revert the commit for `lib/schemas/auth.schema.ts` and re-open the plan.

## Notes

- This is Phase 1 only. Subsequent phases will be planned as separate, small PRs (<=7 files) and will reference this plan file.
