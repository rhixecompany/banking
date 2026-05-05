# Spec: root-refactor

Scope: feature

Feature spec: Root Group Server-Wrapper Refactor

Overview

- Convert app/(root) pages to use server-wrapper Server Components that centralize DAL calls, validate returned shapes, provide defensive fallbacks, and hand off data to lightweight client components. Extract and standardize shared layouts (AppShell/PageShell/SideNav) used by root pages.

Goals

- Improve reliability: prevent UI crashes from uncaught DB or auth errors by centralizing error handling in server wrappers and DAL.
- Improve DX: make unit tests hermetic by mocking DAL and NextAuth in tests/setup, enabling fast local runs.
- Improve maintainability: remove duplicated layout/markup across root pages by extracting AppShell and shared subcomponents.
- Add targeted tests and Playwright smoke tests to validate critical user paths.

Scope

- Pages included: dashboard, my-wallets, payment-transfer, settings, transaction-history.
- Components: server wrappers for each page, AppShell/PageShell/SideNav, existing client components remain as-is but may receive prop contract updates.
- Tests: unit tests for server wrappers (mock DAL), AppShell unit tests, Playwright smoke tests with seeded session helper.

Acceptance criteria

1. Each root page uses a server wrapper that:
   - Fetches data via DAL (no direct DB imports), validates shapes, converts Date to ISO strings, and returns safe fallbacks when DAL fails.
   - Exposes typed props for client components.
2. Client components remain 'use client' only; no client-only APIs in server components.
3. Unit tests for each server wrapper exist and pass in a hermetic environment (no running DB required).
4. AppShell extracted and used by all root pages; visual regression not intended to change.
5. Playwright smoke tests for /dashboard and /my-wallets run in CI when PLAYWRIGHT_PREPARE_DB=true and pass against seeded DB.

Design constraints & decisions

- Minimal, incremental PRs: start with inventory + dashboard/my-wallets wrappers, then expand.
- Keep DAL contract unchanged; only wrap with try/catch and logging at server wrapper level when necessary.
- Use updateTag/revalidateTag for caches where mutations occur; tag granularity: wallets:user:{id}, transactions:user:{id}.
- Tests: use Vitest with mocks for DAL and mock getServerSession to simulate authenticated/unauthenticated flows.

Milestones / Tasks

1. Inventory & mapping file (.opencode/reports/root-pages-inventory.json).
2. Implement server wrappers for dashboard + my-wallets and update pages to use them (small PR).
3. Add unit tests for wrappers and AppShell.
4. Extract AppShell and replace duplicated layout markup.
5. Add server wrappers for remaining root pages.
6. Add Playwright smoke tests and CI tasks.

Testing strategy

- Unit: Mock DAL module and mock Auth (getServerSession) in tests/setup.ts. Validate fallback behavior on DAL errors.
- Integration/E2E: Seed DB using existing scripts/seed/run.ts in CI (PLAYWRIGHT_PREPARE_DB=true), use Playwright seeded cookies helper to bypass UI login.

Risks & mitigations

- Risk: inadvertently importing client-only modules into server components. Mitigation: enforce code review checklist and run type-check.
- Risk: caching misconfiguration shows stale balances. Mitigation: conservative tag granularity and short cache lifetimes; instrument revalidation flows.

Estimated effort

- Inventory + 1st small PR: 60–90 minutes.
- Full group refactor + tests + E2E: 8–12 hours (split into incremental PRs).

Rollback plan

- Merge incrementally. If UI regressions appear, revert the last PR. Add feature flags if needed to gate cache/tagging changes.

Next steps

- Confirm and I will implement the inventory + dashboard/my-wallets server wrappers in a small PR on a feature branch named feat/root-refactor-1.
