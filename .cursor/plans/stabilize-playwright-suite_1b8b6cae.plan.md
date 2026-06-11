---
name: stabilize-playwright-suite
overview: Harden all Playwright E2E specs by removing skipped/non-deterministic tests, standardizing assertions, and making authenticated scenarios deterministic with a seeded user.
todos:
  - id: audit-spec-behavior
    content: Classify each Playwright spec as deterministic, flaky, placeholder, or redundant and map required fixes.
    status: completed
  - id: refactor-test-patterns
    content: "Apply suite-wide reliability improvements: strict assertions, remove conditional pass-throughs, unify auth setup with seeded user."
    status: in_progress
  - id: remove-skip-and-placeholder
    content: Replace skipped tests with deterministic coverage and remove external example spec from E2E run.
    status: pending
  - id: verify-full-suite
    content: Run Playwright suite and confirm no skipped tests and no failures.
    status: pending
isProject: false
---

# Playwright Suite Hardening Plan

## Goals

- Remove skipped or placeholder tests and ensure every spec has meaningful assertions.
- Eliminate flaky patterns (soft assertions for critical checks, conditional checks that can silently pass).
- Make authenticated tests deterministic using a seeded account.

## Target Files

- [c:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts](c:/Users/Alexa/Desktop/SandBox/Banking/playwright.config.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/pages.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/pages.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/auth.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/auth.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/auth-flow.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/auth-flow.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/protected-pages.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/protected-pages.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/forms.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/forms.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/my-banks.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/my-banks.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/bank-linking.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/bank-linking.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/payment-transfer.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/payment-transfer.spec.ts)
- [c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/example.spec.ts](c:/Users/Alexa/Desktop/SandBox/Banking/tests/e2e/example.spec.ts)

## Planned Changes

- Replace `test.skip()` in `pages.spec.ts` with a real authenticated assertion path using the seeded user flow.
- Remove or quarantine `example.spec.ts` (external `playwright.dev` smoke tests) so app E2E is isolated and deterministic.
- Convert critical `expect.soft(...)` to strict `expect(...)` for URL redirects and required UI elements.
- Remove conditional assertions like `if (await locator.isVisible())` / `if (await locator.isHidden())` that currently allow false positives; assert required elements directly.
- Deduplicate repeated sign-in setup by introducing shared auth helper(s) or fixture pattern in `tests/e2e` for seeded credentials.
- Strengthen selectors to role/label-based selectors where possible to reduce brittleness.
- Tighten config defaults for reliability (`forbidOnly`, retries/workers already present) and keep suite focused on local app routes only.

## Validation

- Run full Playwright suite via `npm run test:ui`.
- Confirm zero skipped tests and zero failing tests.
- Verify no `.only`, `.skip`, or `fixme` remains in `tests/e2e` unless explicitly documented as intentional.
