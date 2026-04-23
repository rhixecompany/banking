# Diagnose Playwright Auth Failure

## Goals

- Quickly identify why authenticated Playwright E2E tests for Dashboard are failing (UI missing expected elements).
- Implement the minimal reliable fix: ensure test fixture sets auth cookie in browser context so server-side auth() sees session.

## Scope

- Inspect the Playwright auth fixture and the set-cookie helper and routes.
- If set-cookie endpoint is unreliable, add a fallback to the test fixture to call page.context().addCookies(...).
- Add temporary diagnostic logs in tests only if necessary.

## Target Files

- tests/e2e/utils/auth-fixtures.ts
- lib/playwright/set-cookie.helper.ts
- app/**playwright**/set-cookie/route.ts
- app/api/**playwright**/set-cookie/route.ts
- tests/e2e/dashboard.spec.ts

## Risks

- Adding test-only code must be gated behind ENABLE_TEST_ENDPOINTS; avoid shipping test endpoints to production.
- Minimal changes to tests may require updating Playwright snapshots or timeouts.

## Planned Changes

1. Read files to confirm current behavior.
2. If setAuthCookie calls the app endpoint and relies on server to set cookie via APIRequestContext, add a fallback in setAuthCookie to use page.context().addCookies when response doesn't include Set-Cookie or when cookie not present in page.context().cookies() after navigation.
3. Re-run failing E2E (user to run) or provide code patch to tests for review.

## Validation

- After the change, authenticated dashboard E2E should render the "Welcome back" heading and pass related assertions.

## Rollback

- Revert test file changes; no production code modified.

## Files read (evidence)

- (Will populate after reading files)
