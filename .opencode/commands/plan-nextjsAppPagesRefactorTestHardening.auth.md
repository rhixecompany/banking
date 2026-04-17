---
title: Auth Group Refactor Plan
summary: Atomic plan to refactor auth pages, modularize components, harden tests, and ensure deterministic seeded auth flows.
owner: Platform Engineering Team
status: planned
date_created: 2026-04-17
version: 1.0
tags:
  - feature
  - refactor
  - test
  - nextjs
  - auth
---

# Auth Group Implementation Plan (atomic)

This document is the plan artifact produced by OpenCode. It includes the read-only discovery provenance and the atomic steps required to implement changes for the auth group (app/(auth)).

Provenance: files read to produce this plan

- app/(auth)/layout.tsx — detect layout and children
- app/(auth)/sign-in/page.tsx — sign-in page wrapper
- app/(auth)/sign-up/page.tsx — sign-up page wrapper
- components/sign-in/sign-in-server-wrapper.tsx — server wrapper usage
- components/auth-form/auth-form.tsx — canonical AuthForm implementation
- components/layouts/auth-form/index.tsx — re-export wrapper
- tests/fixtures/seed-user.json — seed user fixture
- tests/fixtures/seed-admin.json — seed admin fixture
- tests/e2e/helpers/auth.ts — Playwright sign-in helper
- tests/e2e/utils/auth-fixtures.ts — JWT/JWE helper for deterministic sessions
- scripts/seed/seed-data.ts — seed runner & planned data

Planned tasks (atomic):

1. Audit imports and ensure no direct DB client usage in pages/components (use dal/\*)
2. Ensure AuthForm exported under components/layouts/auth-form is the canonical presentational component
3. Consolidate client wrappers (create sign-in client wrapper if needed)
4. Ensure server wrappers call auth() early and redirect correct
5. Harden tests: prefer JWT-driven sessions in Playwright, fallback to seeded UI flow
6. Validate seed-data vs fixtures (unify passwords & IDs)
7. Update scripts to include ts-morph helpers for AST edits and keep dry-run default behavior
8. Rewrite docs/test-context.md (auth section) to reflect changes

Verification commands (local):

- npm run type-check
- npm run lint:strict
- npm run test:browser
- PLAYWRIGHT_PREPARE_DB=true npm run test:ui
- npm run db:seed -- --dry-run

Accept criteria (auth group):

- Type-check and lint succeed
- Auth pages compile and use canonical AuthForm
- Playwright auth tests pass deterministically with seeded users

Next action: Implementation started — applying non-destructive changes for the auth group.

Changes applied in this session:

- Added scripts/utils/ast/ts-morph-utils.ts (ts-morph helper for AST-safe edits)
- Added .opencode/commands/plan-nextjsAppPagesRefactorTestHardening.auth.md (this plan file)
- Updated tests/e2e/helpers/auth.ts (no-op modernization of flow)
- Normalized tests/fixtures/seed-user.json password to match seed-data.ts

Remaining steps (manual approval required before any destructive DB seed reset):

- Extract/refactor AuthForm exports if needed
- Add/adjust client wrappers
- Re-run full test suite and further minor fixes
