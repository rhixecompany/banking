---
plan name: enhance-pages-complete
plan description: Pages & scripts overhaul
plan status: done
---

## Idea

Enhance and harden all Next.js pages and scripts

## Implementation

- Discovery: Inventory all Next.js pages under ./app. Use Glob to list files matching app/**/page.tsx, app/**/route.tsx, app/\*\*/layout.tsx. Produce a triaged map grouped by route layout (group keys: (auth), (admin), (root), app/page.tsx). Record for each page: path, layout chain, imported custom components, dal imports, actions imports, tests referencing it, and any store usage.
- Group Prioritization & Scoping: Using the agreed order (auth → admin → root → app/page.tsx), create a scoped worklist for each group. For each route in a group, list dependent assets (components, dal, actions, tests, stores). Create a feature branch name convention: feature/enhance/<group>-<short> (e.g., feature/enhance/auth-login).
- Design Reusable Layouts & Components: Design a set of reusable dynamic generic components for layouts (Header, Sidebar, ProtectedWrapper, AdminShell, PageContainer). Implement them under ./components/layouts as Server Components by default; place interactive widgets (menus, dropdowns, forms) as Client Components inside them. Define clear props and TypeScript generics so components are reusable across pages. Add small design doc in docs/components-layouts.md describing props, examples, and SSR/Client boundaries.
- DAL & Server Actions Hardening: For each page, inspect DAL/action usage. Refactor any direct DB access into dal/\* helpers (create or extend dal files when missing) and add optional tx parameter for transactional flows. Ensure every Server Action follows: "use server" directive, early auth() check when required, Zod validation (.safeParse) with descriptive .describe() messages, consistent return shape { ok: boolean; error?: string }, and revalidatePath/revalidateTag where needed.
- Tests: Deterministic Test Strategy & Seeding: Create a seeded-test strategy. Add a seeds script and a documented seeded user (in .env.example and tests/docs) and an Rake-like scripts/seed.ts with --dry-run support. Update Playwright and Vitest tests: remove skipped/flaky specs, standardize assertions, use role-based selectors, and make authenticated flows deterministic by programmatically creating or using seeded user and cleaning DB between runs. Add docs/tests-context.md describing how to run tests with seeded DB.
- Refactor Pages Sequentially: For each group in order (auth, admin, root, app/page.tsx), process pages sequentially: (a) replace custom ad-hoc layout/components with components/layouts equivalents, (b) ensure Suspense boundaries around async Server Components per suspense-skill, (c) refactor Server Actions & DAL as needed, (d) update or add tests to reflect deterministic flows. Mark progress in a per-group checklist file .opencode/commands/enhance-pages-complete/<group>.progress.md.
- Scripts Modernization: Consolidate scripts under ./scripts as TypeScript. For each existing shell/ps1/bat script, implement an equivalent TS script using ts-morph for AST-safe edits where scripts modify repo code. Add --dry-run and --yes flags to destructive scripts. Export thin shell wrappers that call node ./scripts/<name>.ts. Update package.json scripts to point to the new orchestrators. Add scripts/tests to validate behavior (dry-run unit tests).
- Validation & CI gating: Per your choice, avoid running global typecheck/lint/tests until all pages are enhanced. Instead, run local static verifications per-group (non-blocking): unit tests for modified modules, script dry-runs, and manual smoke checks. After all groups complete, run full pipeline: npm run format, npm run type-check, npm run lint:strict, npm run verify:rules, npm run test (Playwright then Vitest).
- PRs, Review & Merge Strategy: Create one feature branch per group. Each PR must include: (1) list of files changed, (2) proof of deterministic tests (Playwright traces or Vitest logs), (3) updated docs (docs/components-layouts.md, docs/tests-context.md, docs/scripts.md), (4) provenance line listing files read and reason. Merge only after at least one maintainer review and CI checks for that group (if you later allow per-group CI).
- Final Audit & Handover: After merging all groups, run full verification and produce a final report: files changed, tests updated, new seeds, scripts updated, and runbook for future contributors. Add an entry to .opencode/commands/enhance-pages-complete/summary.md and mark the plan done.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
<!-- SPECS_END -->
