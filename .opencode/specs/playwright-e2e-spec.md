# Spec: playwright-e2e-spec

Scope: feature

# Playwright E2E Fixes (Phased)

## Goal

Make the full Playwright E2E suite pass reliably via phased fixes:

1. Behavior alignment (auth/redirect correctness)
2. Deterministic test authentication
3. Stable dev-server lifecycle under Playwright
4. Full-suite gate: `bun run test:ui` green

## Scope

- Playwright tests under `tests/e2e/**`
- Playwright fixtures under `tests/fixtures/**`
- Test-only app routes used by Playwright (e.g. `/__playwright__/set-cookie`)
- Playwright config + global setup/teardown
- App auth/redirect wrappers only insofar as they affect E2E correctness

## Non-Goals

- Broad refactors unrelated to E2E stability
- Masking failures via overly-permissive timeouts/retries
- Changing production behavior unless it is genuinely incorrect

## Behavioral Requirements

- `/admin` access:
  - Unauthenticated user visiting `/admin` is redirected to `/sign-in`.
  - Authenticated non-admin user visiting `/admin` is redirected to `/dashboard`.
- Protected routes such as `/dashboard` and `/settings` remain accessible for authenticated non-admin users.

## Test Harness Requirements

- Authenticated fixtures must be deterministic and resilient:
  - Prefer direct session/cookie seeding when possible.
  - UI sign-in is allowed only as a fallback when deterministic seeding is not possible.
- Test-only cookie endpoint (`/__playwright__/set-cookie`) must be consistent:
  - Single canonical route behavior, no ambiguous duplicates.
  - Endpoint is gated to non-production or explicit test flags.

## Server Lifecycle Requirements

- Playwright `webServer` must start the dev server with the required environment for the app to run E2E.
- Global teardown must not kill unrelated developer servers on local runs.
- No mid-run `ERR_CONNECTION_REFUSED` cascades attributable to mis-owned teardown or missing env.

## Acceptance Criteria

- Targeted specs pass:
  - `npx playwright test tests/e2e/admin.spec.ts --project=chromium`
  - `npx playwright test tests/e2e/auth.spec.ts --project=chromium`
  - `npx playwright test tests/e2e/wallet-linking.spec.ts --project=chromium`
- Full suite passes:
  - Preconditions: port 3000 free
  - `bun run test:ui` exits 0
- No new critical rule violations (`bun run verify:rules` clean)

## Diagnostics Expectations

- When seeding auth or using test endpoints, logs should be concise and actionable (no secrets).
