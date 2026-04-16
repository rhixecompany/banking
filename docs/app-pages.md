# App Pages — Enhancement Guide

This document summarizes the pages enhancement plan and per-page workflow used by engineers working on the Banking app.

Purpose

- Provide a minimal, repeatable workflow to audit, refactor, test, and harden each Next.js page under ./app.
- Ensure repo rules are preserved: Server Actions with Zod + auth(), DAL access via dal/\*, revalidation after mutations.

Priority Order

1. Home
2. My Wallets (Wallets)
3. Payment Transfer (Transfers)
4. Settings (Account)
5. Dashboard
6. Transaction History
7. Auth pages (Sign-in / Sign-up)
8. Admin
9. Any other pages discovered

Per-page Workflow (short)

1. Audit (read-only)
   - Open the page file and its server/client wrappers.
   - List custom components used (exclude ./components/ui).
   - Identify actions imported and DAL methods called.
   - Identify Zod schemas referenced and their locations.
   - Find tests referencing the page and any fixtures used.
   - Produce a small audit note recording files to change.

2. Plan small changes (1–3 items)
   - Move ad-hoc DB queries into dal/\* if present (if small and safe).
   - Ensure server actions validate inputs with Zod, call auth() when protected, and return { ok: boolean; error?: string }.
   - Extract presentational components into components/layouts and keep fetching in server-wrapper.
   - Keep changes minimal: aim for <10 files per PR/commit.

3. Implement
   - Make small edits and prepare unit tests for new presentational components and server action behavior.
   - Add revalidatePath() or revalidateTag() calls after mutations where applicable.

4. Tests & E2E
   - Update unit tests for modified units.
   - Update E2E tests to use seeded data or existing Plaid/Dwolla mocks/helpers.

Acceptance Criteria (page)

- Server actions validate inputs via Zod, call auth() when required, and return the stable { ok, error? } shape.
- DAL access occurs only through dal/\* with no new ad-hoc queries in components.
- Presentation separated from data fetching; presentational pieces live under components/layouts.
- Unit tests added/updated for any modified presentation or action code.
- E2E readiness: tests use seeded data or mocks; external API calls are short-circuited.

Cross-cutting Rules

- Do not read process.env directly in application code; use app-config.ts or lib/env.ts.
- Follow Server Actions contract: Zod-validate inputs, authenticate, return stable shape, catch/log errors, revalidate caches.
- Use dal/\* for DB access and avoid N+1 by moving joins into DAL.
- Use scripts/seed/run.ts for deterministic E2E data; prefer --dry-run when validating plans.

Static Home Constraint (important):

- The Home landing page (app/page.tsx and its wrappers) must remain static and publicly accessible. Do NOT add auth(), server actions that require authentication, or DAL/database queries to Home. If you need to show balance/account examples on Home, use presentational components with static/mock props only and move real user-data wiring to the Dashboard.

Notes

-- This guide is intentionally concise. Follow .opencode/commands/pages_enhancement.plan.md for the persisted plan and more context.

Note: Historically some docs pointed to `.opencode/plans/` or `.cursor/plans/` for plan artifacts. The canonical location for user-facing plan files is now `.opencode/commands/`. Existing plan artifacts under `.opencode/plans/` and `.cursor/plans/` remain as historical artifacts and should not be moved or deleted; update references only in documentation when creating new plans.
