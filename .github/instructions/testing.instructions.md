---
description: Testing guidelines for the Banking project
applyTo: "tests/**/*"
priority: medium
canonicalSource: AGENTS.md
lastReviewed: 2026-04-23
---

# Testing Guidelines

- Unit tests: Vitest. Keep tests fast and deterministic. Mock external services.
- E2E: Playwright. Run against a seeded test DB and a dev server on port 3000.
- Write tests for public surface area and critical flows (auth, payments, reconciliation).
- Aim for small, focused test files; prefer table-driven tests where helpful.
- CI: run `npm run test` and ensure port 3000 is free before Playwright runs.
