---
name: testing-skill
description: Testing patterns for Vitest (unit) and Playwright (E2E) used by the Banking app.
lastReviewed: 2026-04-24
applyTo: "tests/**"
---

# TestingSkill — Test Patterns

Overview

Repo uses Vitest for unit/integration and Playwright for E2E. `npm run test` runs E2E first (Playwright) then Vitest.

Key Points

- Free port 3000 before Playwright on Windows (AGENTS.md includes a PowerShell snippet).
- Run E2E (Playwright) first because it starts the dev server.
- Use single worker for Playwright as tests are stateful.

Examples

Vitest (single test): `npx vitest run tests/unit/auth.test.ts` Playwright single spec: `npx playwright test tests/e2e/auth.spec.ts`

Validation

- `npm run test` (E2E then unit)
