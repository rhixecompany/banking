# Refactor Frontend ui

## tasks

1: Read and understand `.opencode/commands/init-enhanced.md` then Update it to include all personas, recommendations and suggestions you may have format with markdownlint.

2: Change mode to Build and Execute command `/init-enhanced.md` .

3: As reviewer personas Read and understand all markdown files in the codebase, in `./docs`.

4: Audit `database/schema.ts` to identify any missing database table and fields.

5: Enhance `database/schema.ts` with any missing database table and fields,

6: Audit all Actions, Zod schemas, Dals for compliance.

7: Enhance all Actions, Zod schemas, Dals using best practices and dry.

8: List all pages in `./app` save the list to `docs/app-pages.md` format with markdownlint then triage.

9: List all test its helpers and configurations in the codebase save the list to `docs/test-context.md` format with markdownlint then triage.

10: Read and understand `docs/app-pages.md` and `docs/test-context.md` then Update all pages,test,helpers and configurations in `docs/app-pages.md` and `docs/test-context.md`

11: List all custom components in `./components` skip all components in `./components/ui` save the list to `docs/custom-components.md` format with markdownlint then triage, then identify any custom components that can be split up into smaller dynamic generic reusable components.

12: Read and understand `docs/custom-components.md` then Update all custom components in `docs/custom-components.md` ensure to create and use any reusable dynamic generic custom components and saved to `./components/layouts` ensure to verify and valid all reusable dynamic generic custom components in `./components/layouts`.

13: Update all custom typescript scripts in `./scripts` to be AST-safe and enhanced with re-run in dry-run functionality.

Full Complete Plan (execution-ready)

1. Overview

- Objective: Complete tasks 1–13 as you specified: update init-enhanced.md, audit docs, audit & enhance database schema, audit & improve Actions/Zod/DALs, generate docs for app pages/tests/components, refactor UI components to reusable layouts, make scripts AST-safe with dry-run, and validate everything with tests.
- Constraints: Plan Mode active — no file edits now. When executing: no CI workflows edits, no secrets committed, keep changes additive, follow repository rules (.cursor/plans for >3 files, Server Actions for mutations, no any etc.).
- Branching: Single local feature branch (you'll review commits locally).
- Acceptance criteria: Playwright + Vitest pass, migrations applied and verified, key UI pages load with no runtime errors.

1. Preparatory Steps (read-only)

- Scan repository structure: app/, components/, lib/actions/, dal/ or lib/dal/, database/schema.ts, .opencode, docs/, scripts/, tests/.
- Produce inventories:
  - docs audit (docs/docs-audit.md)
  - app pages list (docs/app-pages.md)
  - test list & context (docs/test-context.md)
  - custom components (docs/custom-components.md)
  - actions/dal/schema audit (actions-audit.md, database/schema-audit.md)
- Confirm local dev prerequisites: Node, npm, Drizzle CLI, Playwright, dev DB.

1. Detailed Work Plan by Task Task 1 — Update .opencode/commands/init-enhanced.md

- Read the original.
- Add personas: Developer, Reviewer, QA, Product Manager, Designer, DevOps.
- Add preflight checks, port guard for Playwright, Drizzle migration guidance.
- Add flags and dry-run guidance, examples for PowerShell/Bash.
- Ensure markdownlint compliance (headings, code fences, indentation).
- Commit message: docs: enhance init-enhanced.md with personas and best practices. Task 2 — Change mode to Build & execute /init-enhanced.md
- Clarify command semantics before execution: confirm whether this is a script or documentation file only.
- If executable, run after docs update; capture output. Task 3 — Read & understand docs/
- Produce docs/docs-audit.md:
  - For each docs file: summary, outdated status, contradictions, suggested edits.
  - Priority tags: Critical/High/Medium/Low. Task 4 — Audit database/schema.ts
- Cross-reference code usage to identify missing columns/tables.
- Look for fields in code not in schema: fundingSourceUrl, sharableId, isAdmin, isActive, etc.
- Produce database/schema-audit.md with proposed schema diffs. Task 5 — Enhance database/schema.ts (additive)
- Add missing columns and small supporting tables (webhook_events, transfer_metadata) as needed.
- Ensure indexes for lookup fields.
- Run Drizzle migration generation: npm run db:generate; inspect migration; apply via npm run db:push.
- Validate with db:check and unit tests. Task 6 — Audit Actions, Zod schemas, DALs
- Check every Server Action for:
  - Zod validation with .describe and validator messages.
  - auth() presence on protected mutations.
  - proper return shape Promise<{ok:boolean; error?:string}>.
  - No process.env direct usage.
- Check DALs for:
  - No queries in loops; use JOINs or IN.
  - Use eq(table.col, value) pattern.
  - Use db.transaction for multi-step writes.
- Produce actions-audit.md with per-file issues. Task 7 — Enhance Actions, Zod schemas, DALs
- Zod:
  - Add .describe to each field.
  - Add explicit messages on validators.
  - Use z.coerce or preprocess where forms pass strings.
- Actions:
  - Add auth checks and consistent return values.
  - Add revalidation calls where needed.
  - Wrap multi-step writes in db.transaction and use .returning() to get inserted ids.
- DALs:
  - Add methods that return joined objects and avoid N+1.
  - Ensure correct Drizzle predicates and types.
- Add/update unit tests accordingly. Task 8 — List app pages (docs/app-pages.md)
- Enumerate app routes and meta: protected/unprotected, server/client, data sources, cache usage, priority.
- Triaging notes for each page. Task 9 — List tests & helpers (docs/test-context.md)
- Enumerate all tests, configs, msw mocks, and test setup scripts.
- Document run order, port guard, env requirements, and known issues. Task 10 — Update docs/app-pages.md & docs/test-context.md
- Add recommendations: which pages to convert to Server Actions, where to add Suspense, test coverage gaps, and how to run/update tests locally. Task 11 — List custom components (docs/custom-components.md)
- Enumerate components excluding components/ui.
- For each: path, props signature, client/server, usage count, complexity.
- Identify split/candidates for dynamic generic components. Task 12 — Create reusable components and refactor
- Extract small, generic components into components/layouts: PageShell, ContentContainer, AccountBadge, BankInfoCard, CurrencyAmount, AsyncSelect, Skeletons.
- Migrate pages one-by-one to ensure stability.
- Add unit tests for new components. Task 13 — Update scripts to be AST-safe and support dry-run
- Replace file-editing shell scripts with Node tools (ts-morph or recast).
- Add CLI options --dry-run, --apply, --verbose.
- Add PowerShell/bat wrappers, if necessary, to maintain cross-platform usage.
- Update scripts/README.md.

1. Commit Strategy (single local branch)

- Create branch: feature/refactor-ui-audit-YYYYMMDD-xxxx (local only).
- Commit sequence (small focused commits described previously).
- For changes touching >3 files create .cursor/plans/<task>\_<8char>.plan.md.

1. Validation Steps (local)

- Format & Lint
  - npm run format:check
  - npm run type-check
  - npm run lint:strict
- Tests
  - Free port 3000 (PowerShell snippet in AGENTS.md)
  - npm run dev or start server as required
  - npm run test:ui (Playwright) — E2E
  - npm run test:browser (Vitest) — unit tests

1. Post-Implementation

- Prepare report with:
  - Files changed and rationale (commit summary).
  - DB migration notes and backfill steps (if needed).
  - New docs and dev instructions.
  - Test results and any known residual risks.

1. Rollback & Recovery

- Fix failing tests in subsequent commits as per your preference.
- Migrations: Provide down scripts or revert migrations if necessary; test on fresh DB.

1. Time estimates

- Full implementation estimated 2–4 days; DB & Actions prioritized first.

1. Ready-to-execute checklist

- Confirm you want me to start Build Mode now ("Proceed").
- Confirm any additional constraints (files/dirs to avoid beyond CI).
- Confirm priority pages/components if different from defaults. If you confirm "Proceed", I will switch to Build Mode and begin executing the plan, making local commits and reporting progress after each commit.
