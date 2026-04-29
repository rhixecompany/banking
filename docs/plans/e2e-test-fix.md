---
status: in-progress
phase: 1
updated: 2026-04-29
---

# E2E Test Fix (Start With Link-and-Transfer)

## Title

E2E Test Fix - Link-and-Transfer First

## Description

Fix E2E test failures by starting with the integration flow test `tests/e2e/integration/link-and-transfer.spec.ts`, then expanding to other failing E2E specs. Prioritize systematic root-cause investigation, deterministic mocks, and eliminating all Plaid-related console warnings.

## Personas

| Persona     | Role                                |
| ----------- | ----------------------------------- |
| IMPLEMENTER | Identifies root cause and fixes test failure |
| REVIEWER    | Reviews fixes for correctness        |
| QA_ENGINEER | Runs targeted E2E test to verify fix |

## Goal

1. Make `tests/e2e/integration/link-and-transfer.spec.ts` pass reliably (local + CI).
2. Eliminate Plaid duplicate-script issues and **any Plaid-related console warnings**.
3. After link-and-transfer is stable, work through remaining failing E2E specs with evidence-driven fixes.

## Context & Decisions

| Decision | Rationale | Source |
| -------- | --------- | ------ |
| Start with the integration spec under `tests/e2e/integration/` | This is the intended link + transfer end-to-end flow and includes DB assertions | `tests/e2e/integration/link-and-transfer.spec.ts` |
| Run targeted specs first | Faster iteration and higher-quality evidence than running the entire suite | User requirement |
| “No Plaid-related console warnings at all” is a hard requirement | Prevents hiding regressions behind non-fatal warnings | User instruction (2026-04-29) |
| Use Playwright `globalSetup` / `webServer` as the DB/app strategy | Keeps local + CI consistent; avoids ad-hoc DB setup | `playwright.config.ts`, `tests/e2e/global-setup.ts` |

## Phase 1: Root Cause Investigation [IN PROGRESS]

- [ ] **1.1 Confirm correct target spec path** ← CURRENT
  - Target spec: `tests/e2e/integration/link-and-transfer.spec.ts`

- [ ] 1.2 Run the target spec with full artifacts (trace enabled)
  - Run:
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --trace=on --retries=0`
  - Capture from output:
    - First failing assertion / stack trace (file + line)
    - Any ECONNRESET / server disconnect messages
    - Any Plaid-related console warnings

- [ ] 1.3 Re-run immediately to detect flake
  - Run:
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --trace=on --retries=0`
  - If the outcome changes between runs, treat as flake and gather more evidence before changing app code.

- [ ] 1.4 Run Plaid script duplication spec in isolation
  - Run:
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/specs/plaid-script.spec.ts --project=chromium --trace=on --retries=0`
  - Record whether the DOM contains multiple Plaid scripts and whether any Plaid-related console warnings are emitted.

- [ ] 1.5 Locate all Plaid script injection paths in the codebase
  - Run:
    - `bunx rg "plaid\\.com/link|link-initialize\\.js|react-plaid-link|usePlaidLink|PlaidProvider|plaid-link-script" -n`
  - Output should be a short list of exact files/lines that can inject or trigger Plaid Link script loading.

## Phase 2: Fix Implementation (After Root Cause) [PENDING]

- [ ] 2.1 Fix Plaid duplicate script injection at the source
  - Target outcome:
    - Only one `https://cdn.plaid.com/link/v2/stable/link-initialize.js` script element is ever present.
    - No Plaid-related console warnings (including duplicate-script warnings).

- [ ] 2.2 Fix ECONNRESET / disconnects (if reproduced)
  - Identify which boundary is failing:
    - Next dev server crash/restart
    - Playwright runner/browser transport
    - Upstream network call that should have been mocked

- [ ] 2.3 Fix link-and-transfer spec failure (assertion, timing, seed data, or app behavior)
  - Requirement:
    - The test must be deterministic with the existing Playwright global setup strategy.

## Phase 3: Verification [PENDING]

- [ ] 3.1 Verify Plaid duplication and console warning requirements
  - Run:
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/specs/plaid-script.spec.ts --project=chromium --retries=0`
  - Expected:
    - PASS
    - No Plaid-related console warnings

- [ ] 3.2 Verify link-and-transfer passes twice in a row
  - Run:
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --retries=0 --trace=on`
    - `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --retries=0 --trace=on`
  - Expected:
    - PASS both runs
    - No Plaid-related console warnings

- [ ] 3.3 Only after the canary is stable: run full E2E to get remaining failing set
  - Run:
    - `bun run test:ui`
  - Use the same root-cause-first approach for each newly discovered failure.

## Verification

- [ ] `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/specs/plaid-script.spec.ts --project=chromium --retries=0` passes
- [ ] `PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --retries=0` passes twice in a row
- [ ] No ECONNRESET errors in output (or root cause documented + fixed)
- [ ] **No Plaid-related console warnings at all** (warnings or errors containing `plaid` / `Plaid` / `link-initialize`)

## Notes

- 2026-04-29: Target spec path correction: `tests/e2e/integration/link-and-transfer.spec.ts` (not `tests/e2e/link-and-transfer.spec.ts`).
- 2026-04-29: User explicitly requested targeted spec runs first; full suite only after the canary is stable.
- 2026-04-29: Hard requirement: no Plaid-related console warnings at all.
- 2026-04-29: Use `--project=chromium` for consistent test execution
