---
name: fix-playwright-failures-phased
overview: Fix all failing Playwright tests in phased order by correcting real auth/redirect behavior first, then stabilizing test auth seeding and server lifecycle, and finally validating the full UI suite.
todos:
  - id: phase1-admin-redirect
    content: Align admin redirect behavior with authenticated/non-authenticated expectations and pass admin.spec.ts
    status: pending
  - id: phase2-auth-fixture
    content: Stabilize Playwright auth fixture cookie seeding and endpoint consistency
    status: pending
  - id: phase3-server-lifecycle
    content: Harden Playwright webServer/global-teardown lifecycle to prevent mid-run connection refusal
    status: pending
  - id: phase4-full-e2e
    content: Run and fix until full bun run test:ui passes
    status: pending
isProject: false
---

# Fix Failed Playwright Tests (Phased)

## Goal

- Make failing Playwright tests pass with real behavior alignment first, then harness stabilization.
- Completion target: phased progression with final successful `bun run test:ui`.

## Root Causes Found

- Admin authorization behavior mismatch:
  - Specs expect non-admin `/admin` -> `/dashboard`, but current wrapper redirects non-admin to `/sign-in`.
  - Relevant files:
    - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/admin.spec.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/admin.spec.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts/AdminLayoutWrapper.tsx](C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts/AdminLayoutWrapper.tsx)
- Auth fixture fragility:
  - Cookie-seeding endpoint path/availability and fallback UI sign-in can fail under load, causing broad unauthenticated cascades.
  - Relevant files:
    - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/fixtures/auth.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/fixtures/auth.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/utils/auth-fixtures.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/utils/auth-fixtures.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/**playwright**/set-cookie/route.ts](C:/Users/Alexa/Desktop/SandBox/Banking/app/__playwright__/set-cookie/route.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/app/api/**playwright**/set-cookie/route.ts](C:/Users/Alexa/Desktop/SandBox/Banking/app/api/__playwright__/set-cookie/route.ts)
- Server lifecycle instability in long runs:
  - Dev server startup/ownership and teardown behavior can cause mid-run `ERR_CONNECTION_REFUSED` cascades.
  - Relevant files:
    - [C:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts](C:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-setup.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-setup.ts)
    - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-teardown.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-teardown.ts)

## Phase Plan

### Phase 1: Fix Auth/Admin Behavior Mismatch (Primary)

- Update admin guard logic in [C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts/AdminLayoutWrapper.tsx](C:/Users/Alexa/Desktop/SandBox/Banking/components/layouts/AdminLayoutWrapper.tsx):
  - unauthenticated user -> `/sign-in`
  - authenticated non-admin -> `/dashboard`
- Keep behavior consistent with expectations in [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/admin.spec.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/admin.spec.ts).
- Run targeted checks:
  - `npx playwright test tests/e2e/admin.spec.ts --project=chromium`

### Phase 2: Make Test Authentication Deterministic

- Stabilize cookie seeding path and usage in:
  - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/utils/auth-fixtures.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/utils/auth-fixtures.ts)
  - [C:/Users/Alexa/Desktop/SandBox/Banking/tests/fixtures/auth.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/fixtures/auth.ts)
- Ensure fixture uses a reliable cookie application strategy (browser-context cookie add path as primary or robust server endpoint confirmation) and only falls back to UI sign-in when necessary.
- Verify test endpoint route consistency and remove duplicate ambiguity between:
  - [C:/Users/Alexa/Desktop/SandBox/Banking/app/**playwright**/set-cookie/route.ts](C:/Users/Alexa/Desktop/SandBox/Banking/app/__playwright__/set-cookie/route.ts)
  - [C:/Users/Alexa/Desktop/SandBox/Banking/app/api/**playwright**/set-cookie/route.ts](C:/Users/Alexa/Desktop/SandBox/Banking/app/api/__playwright__/set-cookie/route.ts)
- Run targeted suites after fix:
  - `npx playwright test tests/e2e/auth.spec.ts --project=chromium`
  - `npx playwright test tests/e2e/wallet-linking.spec.ts --project=chromium`

### Phase 3: Stabilize Playwright Server Lifecycle

- Ensure `webServer` startup/URL behavior is consistent and does not conflict with fixture base URL usage in [C:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts](C:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts).
- Harden teardown ownership logic in [C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-teardown.ts](C:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/global-teardown.ts) to avoid killing unrelated/existing servers.
- Validate with a multi-spec run:
  - `npx playwright test tests/e2e/admin.spec.ts tests/e2e/auth.spec.ts tests/e2e/wallet-linking.spec.ts --project=chromium`

### Phase 4: Full E2E Gate and Regression Validation

- Run full required command with precondition:
  - clear port 3000
  - `bun run test:ui`
- If failures remain, iterate by failure bucket (auth redirect, server availability, fixture login) until suite is green.

## Validation Sequence

- `bun run type-check`
- `bun run lint:strict`
- Phase-specific Playwright targeted specs
- Final: `bun run test:ui`

## Risk Controls

- Prefer behavior-correct fixes over changing assertions unless expectations are clearly wrong.
- Keep auth fixture changes backward-compatible and explicit in logs for diagnosis.
- Avoid broad config relaxations that mask genuine regressions.
