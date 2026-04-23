---
title: home-refactor
---

# Home Refactor Plan

## Goals

- Keep the Home page static/public — no auth() or DB access in app/page.tsx or HomeServerWrapper.
- Extract presentational components (TotalBalance) into components/layouts/total-balance and add unit tests.
- Ensure no ad-hoc DB queries or Server Actions with side-effects are imported into Home wrappers.
- Document changes in docs/app-pages.md and docs/custom-components.md.

## Scope

- Target files: components/home/_, components/layouts/total-balance/_, components/shared/wallets-overview.tsx, dal/wallets.ts (if needed), docs/app-pages.md, docs/custom-components.md, tests/unit/\* (related)

## Target Files

- app/page.tsx (audit reference only — no edits)
- components/home/home-server-wrapper.tsx
- components/home/home-client-wrapper.tsx
- components/layouts/total-balance/index.tsx
- components/total-balance-box/\*
- components/shared/wallets-overview.tsx
- dal/wallets.ts
- docs/app-pages.md
- docs/custom-components.md
- tests/unit/total-balance.test.tsx

## Risks

- Introducing new imports or auth() into Home will violate the static-home constraint. Avoid adding any user-data wiring.
- Deferred global checks increase chance of type/lint regressions; mitigate by small local tests for changed units.

## Planned Changes

1. Add plan file (this file).
2. Extract presentational wrapper (components/layouts/total-balance/index.tsx) — ensure props-only and add a unit test.
3. Scan components/shared/wallets-overview.tsx for ad-hoc DB calls; if found, move logic to dal/wallets.ts and import the dal in appropriate server-only places (not in Home). If heavy, document and defer.
4. Update docs/app-pages.md and docs/custom-components.md with Home entries.

## Validation

- Run unit tests for the added total-balance test locally (Vitest). (Global validate deferred per user choice.)
- Manual review: ensure no auth() or dal calls in HomeServerWrapper or app/page.tsx.

## Rollback / Mitigation

- Revert changes in the big branch if violations of home static policy are detected.
