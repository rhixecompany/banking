---
plan name: playwright-e2e-fix
plan description: UI suite reliability work
plan status: active
---

## Idea

Fix failing Playwright E2E tests by first aligning real app redirect/auth behavior with spec expectations (especially /admin), then making Playwright authentication deterministic and resilient (cookie/session seeding + endpoint consistency), then hardening Playwright dev-server lifecycle (webServer env, setup/teardown ownership) to eliminate mid-run ERR_CONNECTION_REFUSED cascades, and finally iterating until the full `bun run test:ui` suite passes consistently. Original title: fix-playwright-failures-phased.

## Implementation

- Reproduce current failures locally with targeted specs first (start with `tests/e2e/admin.spec.ts`), capturing failure output, URLs, and any connection-refused patterns.
- Phase 1: Align /admin behavior with expectations: unauthenticated -> /sign-in; authenticated non-admin -> /dashboard; verify `tests/e2e/admin.spec.ts` passes.
- Phase 2: Stabilize Playwright auth fixture: ensure cookie seeding works reliably with the app’s NextAuth configuration; only fall back to UI sign-in when necessary; run `tests/e2e/auth.spec.ts` and `tests/e2e/wallet-linking.spec.ts` after changes.
- Phase 2b: Remove ambiguity around the test cookie endpoint: ensure fixtures target the correct route and consolidate/disable duplicates so `/__playwright__/set-cookie` is consistently available under test flags.
- Phase 3: Harden server lifecycle: ensure `playwright.config.ts` webServer config and env propagation match fixture baseURL usage; update global teardown to avoid killing unrelated servers; validate with a multi-spec run.
- Phase 4: Run full E2E gate: clear port 3000, run `bun run test:ui`, bucket remaining failures (auth redirect vs server availability vs seeding) and iterate until suite is green.
- Run `bun run type-check` and `bun run lint:strict` after stabilization to ensure no policy regressions.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
- playwright-e2e-spec
<!-- SPECS_END -->
