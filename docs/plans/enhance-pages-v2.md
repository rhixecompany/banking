---
plan name: enhance-pages-v2
plan description: Enhance pages & scripts
plan status: active
---

## Idea

Enhance Next.js app pages and scripts

## Implementation

- 1. Confirm scope & constraints (this step): Use only App Router page files named page.tsx / page.ts under ./app as pages. Treat route groups literally: app/(auth), app/(admin), app/(root). Use shadcn/ui + Tailwind for new reusable layout components. Reuse existing store library/patterns in the repo. DAL changes are permitted. Tests, fixtures and db:seed modifications are permitted to make deterministic tests. Do not run full type-check/lint/tests until all pages are enhanced; lightweight diagnostics (lsp_diagnostics, file-level checks) are allowed.
- 2. Discovery (delegate to @explorer): Produce a machine-readable discovery report at .opencode/reports/enhance-pages/discovery.json and a concise human summary. For each page (page.tsx/page.ts) record: route path, file path, layout group (app/(auth), app/(admin), app/(root), top-level app/page.tsx), list of imported local components (components/), imported DAL files (dal/), server actions (actions/ and app/api/), tests referencing the page (tests/\*_ or _.spec.ts[x]), and stores/state modules used. Flag: direct process.env reads in app/, direct DB imports in app/, server-actions missing 'use server' or auth/Zod patterns, and any skipped/non-deterministic tests. Do not modify files. Include counts and candidate components to consolidate into ./components/layouts.
- 3. Plan per-group (orchestrator): From discovery output create an ordered, batched workplan for groups in priority order: (auth) → (admin) → (root) → app/page.tsx. For each group produce: file list, estimated files to change, propose reusable components to add under ./components/layouts, affected DAL/actions/tests/stores, and PR batch boundaries (<=7 files per batch). Produce branch names: enhance-pages/<group>/<batch-id>.
- 4. Implement reusable layouts & components (@fixer): Create generic, accessible, dynamic components in ./components/layouts using shadcn/ui + Tailwind. Components must be well-typed, documented, and have unit tests. Prefer small focused primitives (Header, AuthLayout, AdminLayout, PageShell, Container, Nav, Breadcrumbs, LayoutSlot) and export type-safe props for composition. Validate each component with vitest unit tests and Storybook-like examples (if repo has story infra).
- 5. Page refactor & server-action hardening (@fixer): Refactor each page to use the new layout components. For server actions ensure rules: add 'use server' where required, call auth() early for protected actions, validate inputs with Zod (shared schemas), and return { ok: boolean, error?: string }. Avoid importing DB directly from app/ by using DAL methods and pass transaction overrides when composing multi-table operations.
- 6. DAL & actions improvements (@fixer + dal-skill): Where discovery shows DAL gaps, make focused, typed improvements: add {db} transaction overrides, improve typings, centralize encryption helpers, and add safe-decrypt wrappers. Keep changes small and well-tested. Update DAL unit tests as needed.
- 7. Stores & state standardization (@fixer): Detect existing store patterns and standardize them. Refactor inconsistent stores to a single pattern (reuse existing implementation). Ensure stores are tested and that SSR/Client boundaries are respected (use client components where stores are used on client).
- 8. Tests & E2E hardening (@fixer + testing-skill): Make tests deterministic: remove skipped/non-deterministic tests or fix them; standardize assertions; add deterministic Playwright authentication using db:seed default seed-user@example.com; update Playwright fixtures to login via seeded session or auth token; update docs/test-context.md with exact environment and seed instructions. Record all test changes and reasons.
- 9. Scripts modernization (@fixer): Audit ./scripts. Migrate heavy logic into TypeScript CLIs using ts-morph for AST-safe edit operations. Provide --dry-run and --apply flags. Convert bash/ps1/bat scripts to lightweight orchestrators that call the TS CLIs. Add unit tests for script behaviors where possible. Update package.json scripts and CI workflow entries to use the TS CLIs. Remove dead scripts after validation.
- 10. Batch PRs, provenance & CI (orchestrator): Create small PRs per batch (<=7 files). Each commit/PR must include one-line provenance listing files read and reason. Run verify-rules and include .opencode/reports/rules-report.json in PR. After all groups finish, run full validation pipeline and fix issues: npm run format && npm run type-check && npm run lint:strict && npm run validate (includes verify-rules, build, tests).
- 11. Validation & final pass (orchestrator + testing-skill): After all pages are enhanced run full unit and Playwright E2E tests on seeded DB and correct env vars (ENCRYPTION_KEY, NEXTAUTH_SECRET). Triage and fix failures iteratively. Produce final report with passing tests, list of modified files, and upgrade notes.
- 12. Deliverables & acceptance criteria: .opencode/reports/enhance-pages/discovery.json (discovery), per-group branches & PRs, new reusable components in ./components/layouts with unit tests, updated DAL/actions/tests/stores, updated docs/test-context.md, TS scripts with dry-run support, package.json and CI updates, and full validation passing. Include detailed changelog and provenance for each PR.
- 13. Timeline & estimates (initial): Discovery: 1–2 hours. Per-group enhancements: 4–12 hours each (auth/admin/root/app-page). Scripts modernization: 6–12 hours. Final validation & fixes: 4–8 hours. Total estimate: 2–5 engineering days (refine after discovery).
- 14. Rules & safety: Obey AGENTS.md rules: no secrets committed, keep edits small & reversible, prefer app-config.ts/lib/env.ts for env access in app/ code, and ensure server-actions follow enforced patterns. If any change touches >7 files or is cross-cutting create a plan file under .opencode/commands/ and pause for approval.
- 15. Next step: I'll start discovery now (delegate to @explorer) unless you instruct otherwise. You previously answered clarifying questions; I'll use those choices in execution: page.tsx/page.ts only; literal groups app/(auth), app/(admin), app/(root); shadcn/ui + Tailwind for components; reuse existing stores; DAL modifications allowed; tests/fixtures/seed DB allowed; run lightweight diagnostics allowed; create commits/PRs allowed; add ts-morph and update package.json & CI; staged per-group PRs; auto-launch @fixer for each group after discovery; use seed-user@example.com for deterministic tests.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-feature
<!-- SPECS_END -->
