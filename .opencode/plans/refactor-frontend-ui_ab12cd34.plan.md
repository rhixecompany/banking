# Refactor Frontend UI

## Goals

- Audit and modernize frontend UI, Server Actions, Zod schemas, DALs, and scripts.
- Produce canonical docs (app-pages.md, custom-components.md, test-context.md).
- Fix Plaid duplicate embed by centralizing Plaid Link initialization.
- Make scripts AST-safe and add a --dry-run mode.
- Validate changes with type-check, strict lint, unit and E2E tests, and a local DB migration run.

## Scope

- database/schema.ts
- lib/actions/\*\*
- lib/dal/\*\*
- Zod schemas across repo
- app/\*\* (all pages/layouts/routes)
- components/** (exclude components/ui/**)
- components/layouts/\*\* (new reusable components)
- tests/\*\* and test helpers/configs
- scripts/\*\* (Node/TS + shell/ps1/bat)
- docs/app-pages.md, docs/custom-components.md, docs/test-context.md

## Target Files (patterns)

- database/schema.ts
- lib/dal/\*_/_.ts
- lib/actions/\*_/_.ts
- **/_schema_.ts, **/_zod_.ts, \*_/_.schema.ts
- app/\*_/{page,layout,template,route,loading}.tsx_
- components/** (except components/ui/**)
- scripts/\*_/_.{ts,js,sh,ps1,bat}

## Risks

- TypeScript or ESLint regressions; follow small commits and run type-check/lint frequently.
- DB migration errors — use local dev DB and run migrations on a copy first.
- Visual/hydration regressions — validate with Playwright E2E checks.
- Plaid/Dwolla require env vars; missing envs cause runtime failures — do not log secrets.

## Planned Changes (phases & steps)

Phase 0 — Prepare

1. Create feature branch: feat/refactor-frontend-ui_ab12cd34
2. Create plan file .opencode/plans/refactor-frontend-ui_ab12cd34.plan.md with this content.
3. Generate initial docs (read-only audit outputs): docs/app-pages.md, docs/custom-components.md, docs/test-context.md.

Phase 1 — Inventory (read-only audits) 4. List all pages in app/, detect page types (server/client), collect server actions used → write docs/app-pages.md. 5. List custom components in components/ (skip components/ui) → docs/custom-components.md with: path, isClient, props type (if available), complexity, extraction candidates. 6. List tests, helpers, configs → docs/test-context.md.

Phase 2 — DB audit & non-destructive proposals 7. Cross-reference database/schema.ts with DALs and actions to find missing fields/tables. 8. Propose schema changes and migration steps (drizzle migration plan). If approved, generate migrations and run against local dev DB.

Phase 2b — DB audit: implementation steps (detailed)

9. Read the canonical schema file: database/schema.ts and build an index of tables and columns.
10. Grep all DAL files under lib/dal/** and actions under lib/actions/** and app/\*\* for referenced columns, table names, and fields used in code.
11. Produce a diff-style report mapping: { table -> [used columns], missing columns -> [usages], unused columns -> [locations] }.
12. For each missing column or table usage, propose one of: (a) add column with type/default, (b) backfill via migration script, (c) change DAL/action to stop referencing the field (with code pointer and rationale).
13. Create a Drizzle migration plan file in .opencode/plans/migrations/ describing SQL/Drizzle steps for each proposed change (up/down), including rollback and estimated downtime/risk.
14. Validate the proposed migrations locally in a disposable dev DB (Docker or Neon clone) by running: npm run db:generate && npm run db:push (dry-run first). Do NOT apply to prod.
15. If migrations pass validation, generate concrete migrations using drizzle-kit (npm run db:generate) and run them against the disposable dev DB (npm run db:migrate or db:push depending on setup).
16. Update the plan with the final migration files, DB check results, and any needed code changes mapped to migration steps.

Notes and safeguards

- Every proposed migration must include an up and a down step and should avoid destructive column drops without an explicit, signed-off rollback plan.
- For schema changes that impact runtime (NOT NULL columns), plan a two-step migration (1. Add nullable column with default/backfill; 2. Populate; 3. Make non-nullable).
- If a change touches >3 files in code, create a short plan in .opencode/plans/ specifically for that change before implementing.

Phase 3 — Actions, Zod schemas, DALs 9. Ensure Server Actions use auth() where required, validate inputs with Zod, and return { ok, error? }. 10. Ensure every Zod field has .describe(...) and validators include messages. Replace any usage of any with unknown + guards. 11. Refactor DALs to avoid N+1 queries; add join-based helpers and consolidate duplicated queries. 12. Add/update unit tests for critical changes where practical.

Phase 4 — Components & UI refactor 13. Extract reusable, dynamic generic components into components/layouts/. 14. Split large custom components into container + presentational parts; keep imports consistent. 15. Ensure proper client/server boundaries ("use client" only where needed). 16. Run visual checks and Playwright tests for pages touched.

Phase 5 — Plaid Link centralization 17. Search for Plaid embed duplicates and replace them with a single PlaidLinkProvider:

- Create a client-side PlaidLinkProvider that loads the CDN script once and exposes a hook to create/open Link instances.
- Replace direct <script> embeds and inline initialization with calls to the provider/hook.

18. Verify the duplicate embed warning is gone and Plaid flows work in sandbox mode.

Phase 6 — Scripts (AST-safe + dry-run) 19. For Node/TS scripts:

- Use ts-morph or jscodeshift to safely refactor scripts when necessary.
- Add --dry-run flag to show changes; no destructive defaults.

20. For bash/ps1/bat:

- Add a dry-run mode that prints actions instead of executing them.
- Add safety checks (confirm directories, no destructive operations without explicit flag).

21. Add small tests/usage examples for modified scripts.

Phase 7 — Validation & release 22. Iteratively run:

- npm run type-check
- npm run lint:strict
- npm run test:browser (Vitest as needed)
- npm run test:ui (Playwright — for UI changes)

23. Create small focused commits for each subtask and push branch.
24. Draft PR with summary, changes, test results, and migration steps (if any).

## Validation (per change)

- Docs: markdownlint pass
- Type-safety: npm run type-check pass
- Lint: npm run lint:strict pass (zero warnings)
- Tests: vitest & Playwright relevant tests pass
- DB: generate & run drizzle migrations on local dev DB; db:check
- Plaid: no "embedded more than once" warning; E2E Plaid flow works in sandbox

## Rollback / Mitigation

- Use small commits; revert a single commit with git revert if needed.
- For DB migrations: create reverse migration or restore DB from backup snapshot; test migrations against a disposable dev DB (Docker/Neon copy).
- Feature toggle Plaid provider if uncertain; keep previous behavior behind a branch until validated.

## Deliverables

- .opencode/plans/refactor-frontend-ui_ab12cd34.plan.md (this plan)
- docs/app-pages.md
- docs/custom-components.md
- docs/test-context.md
- Small commits grouped by phase (branch feat/refactor-frontend-ui_ab12cd34)
- PR with verification and migration instructions
