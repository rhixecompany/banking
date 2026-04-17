# Plan: Refactor Presentational Components & Harden Tests

## Summary

- Extract presentational components used directly by pages into `components/layouts/` (kebab-case folders, `index.tsx` default export).
- Centralize shared Zod schemas under `lib/schemas/` with named exports.
- Ensure `actions/*` call `auth()` early, validate inputs with Zod, and return `{ ok: boolean; error?: string }`.
- Add minimal reusable components (card, form, row, datatable) under `components/layouts/`.
- Add `tests/fixtures/seed-admin.json` for deterministic admin scenarios.
- Update DAL helpers to eager-load related data and avoid N+1 queries.
- Harden tests: unskip and fix flaky tests, centralize msw handlers, use seeded data for Playwright.

## Scope

- Files to read/modify: per-page artifacts under `app/` and `components/`, `actions/`, `dal/`, `tests/`, and new `lib/schemas/`.
- This will touch multiple files (>7).

## Goals

- Each page must have UI-only presentational components in `components/layouts/` with unit tests.
- Server actions must follow the repository Server Action contract.
- Tests should be deterministic when using seeded data and mocks.

## Risks

- Modifying DAL/actions can affect runtime behavior. Mitigation: small focused changes and unit tests for DAL/actions.
- Tests may reveal infra problems. Mitigation: centralize mocks and seed fixtures.

## Verification

1. npm run format
2. npm run type-check
3. npm run lint:strict
4. npm run verify:rules
5. npm run db:seed -- --dry-run
6. npm run db:seed
7. npm run test

## Plan author

OpenCode (automated agent) — prepared local patches, no commits/pushes without explicit instruction.

## Provenance (files read to build this plan)

- docs/custom-components.md — component extraction & conventions
- docs/test-context.md — seeded data and test helpers
- docs/app-pages.md — per-page audits and artifacts
- app/\*\*/page.tsx (glob discovered list) — to enumerate pages
