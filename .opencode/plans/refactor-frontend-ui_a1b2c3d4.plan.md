# Refactor Frontend UI — Plan

Version: 2026-04-14

## Summary

This plan describes an audit-and-refactor of the frontend UI surface. It covers:

- Auditing Server Actions, Zod schemas, and DALs for compliance with repo standards.
- Upgrading Actions, Zod schemas, and DALs to follow best practices (Zod meta, auth, DAL-only DB access, explicit types).
- Inventorying pages and custom components and producing markdown reports.
- Extracting reusable dynamic generic components into `components/layouts/` and replacing duplicates.
- Hardening tests (Vitest + Playwright) to be deterministic and removing flaky tests.
- Converting or wrapping scripts in `scripts/` to TypeScript with `--dry-run` support.

This plan was created with the user's approval. Changes touching multiple files will follow small, reviewable change sets.

## Goals

- Bring Actions, Zod schemas, and DALs into compliance with repository rules (no `any`, Zod `.describe()`, Server Actions pattern).
- Reduce duplication by creating reusable components under `components/layouts/`.
- Make tests deterministic and robust for CI.
- Ensure scripts follow repository scripts patterns (TypeScript, `--dry-run`, header docs).

## Scope

- Files/directories in scope:
  - actions/
  - dal/
  - database/
  - app/
  - components/ (excluding components/ui/)
  - tests/ (Vitest + Playwright)
  - scripts/
  - docs/

## Deliverables

1. Audit reports and inventories:
   - docs/app-pages.md
   - docs/custom-components.md
   - docs/test-context.md
2. Patches to Actions, Zod schemas, and DALs following the repo conventions.
3. New reusable components in components/layouts/ and updated usages.
4. Hardened tests and updated test helpers.
5. Updated scripts under scripts/ with `--dry-run` and header documentation.

## Process & Phases

Phase 0 — Create plan (this file) and get approval (done).

Phase 1 — Read-only audit and produce docs:

- Enumerate all pages in `app/` and save to `docs/app-pages.md`.
- Enumerate all custom components in `components/` excluding `components/ui/` and save to `docs/custom-components.md`.
- Enumerate tests and helpers and save to `docs/test-context.md`.
- Audit Server Actions, Zod schemas, and DALs for compliance; produce per-file notes.

Phase 2 — Triage and produce prioritized change-sets (small, testable patches).

Phase 3 — Implement changes iteratively per change-set:

- Zod schema fixes (.describe(), messages, remove z.any)
- Server Actions: `use server`, auth first, Zod validation, explicit return types, DAL usage, cache invalidation.
- DAL: centralize queries, avoid N+1, explicit return types.
- Component refactors: extract reusable components to components/layouts/ and update consumers.
- Tests: seed DB for deterministic Playwright auth, remove flaky tests, standardize assertions.
- Scripts: convert to TS wrappers and add --dry-run.

Phase 4 — Validation & QA:

- For each change-set run: `npm run format`, `npm run type-check`, `npm run lint:strict`, `npx tsx scripts/validate.ts --all`, and `npm run test`.

## Risk & Mitigation

- Changes touch many files — keep changes small and create multiple PRs. Use a seeded test DB for E2E.
- DB migrations and destructive scripts require `RUN_DESTRUCTIVE=true` and explicit human approval.

## Acceptance Criteria

- `npm run type-check` passes with zero errors.
- `npm run lint:strict` passes with zero warnings.
- Vitest and Playwright tests pass (or failures documented with remediation plan).
- `docs/app-pages.md`, `docs/custom-components.md`, `docs/test-context.md` exist and are markdownlint-compliant.

## Plan file id

- `.opencode/plans/refactor-frontend-ui_a1b2c3d4.plan.md`

---

Created by automation on user instruction: "start implementing".
