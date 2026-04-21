---
plan name: root-group-refactor
plan description: Refactor root pages to server wrappers
plan status: active
---

## Idea

Refactor app/(root) pages to server wrappers and shared layouts

## Implementation

- Inventory repo and map imports for all app/(root) pages (dashboard, my-wallets, payment-transfer, settings, transaction-history) and related components. Produce .opencode/reports/root-pages-inventory.json and checklist. (15-30m)
- Design server-wrapper pattern and cache/tag strategy: define server wrapper interface, tag names, cacheLife policies, and test/mocking strategy. Write design doc: .opencode/specs/root-group-refactor.md. (30-60m)
- Create server wrappers for each root page that centralize DAL calls, validate shapes, add defensive fallbacks, convert dates to strings, and expose props for client components. Add revalidateTag/updateTag where mutations exist. (3-5 hours)
- Extract shared layout components (AppShell, SideNav, PageShell, ErrorBoundary) and replace duplicated layout code in root pages. Ensure 'use client' only used where needed. (2-4 hours)
- Add unit tests for each server wrapper (mock DAL), AppShell tests, and integration tests for client components. Update tests/setup.ts to support hermetic NextAuth mocks for server-side auth. (2-4 hours)
- Add Playwright E2E smoke tests with seeded session helpers (seeded user/admin), include scripts to prepare DB in CI (PLAYWRIGHT_PREPARE_DB). (2-3 hours)
- Run validations: format, type-check, lint, targeted unit tests, and a CI build. Address issues, iterate. (30-90m)
- Open PR(s): prefer incremental PRs per subtask (server wrappers + layouts + tests) but create an umbrella plan and coordinate reviewers. (15-30m)
- Rollout & monitoring: merge progressively, add logger/error alerts for any defensive fallbacks, monitor metrics, and rollback plan if errors increase. (ongoing)

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
<!-- SPECS_END -->
