# enhance-pages: first root batch

## Summary

This plan describes a small, safe first batch to improve and standardize several root pages and their layout wrapper. The batch edits are intentionally limited to 7 files so they can be reviewed and reverted easily.

## Files to edit (first batch)

- app/(root)/dashboard/page.tsx
- app/(root)/my-wallets/page.tsx
- app/(root)/payment-transfer/page.tsx
- app/(root)/settings/page.tsx
- app/(root)/transaction-history/page.tsx
- app/(root)/layout.tsx
- components/layouts/RootLayoutWrapper.tsx

## Why

These pages share layout and navigation patterns. This batch will harmonize their layout, ensure consistent metadata and accessibility, and prepare them for MCP/server-driven enhancements.

## Steps

1. Create a focused branch from main (or the current working branch).
2. Update components/layouts/RootLayoutWrapper.tsx to provide consistent header/nav and slot structure.
3. Ensure app/(root)/layout.tsx uses the RootLayoutWrapper and exports expected metadata.
4. Update each page in app/(root) to use shared components, add appropriate titles, and remove duplicated layout code.
5. Run format, type-check, and lint; fix any straightforward issues discovered by type-check or lint.
6. Open a small PR with a descriptive summary and link to this plan.

## Verification

Run these commands locally before opening a PR:

- npm run format && npm run type-check && npm run lint:strict

Additionally, ensure Server Actions in these pages (if any) follow server-action-skill rules:

- include "use server" at the top
- call auth() early for protected actions
- validate inputs with Zod/shared schemas
- return { ok: boolean, error?: string } shapes

## Commit message template

Subject: chore(enhance-pages): <short summary>

Body:

<longer explanation of changes>

Provenance: read app/(root)/dashboard/page.tsx, components/layouts/RootLayoutWrapper.tsx, AGENTS.md — to identify layout & routing responsibilities
