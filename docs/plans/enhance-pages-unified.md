---
plan name: enhance-pages-unified
plan description: Unified Pages & Scripts Enhancement
plan status: active
---

## Idea

Consolidated plan combining: enhance-pages (layouts/MCP/scripts), enhance-pages-v2 (detailed specs), enhance-pages-complete (pages-only), enhanced-readme (docs alignment). Scope: All Next.js pages under app/, reusable layout components, server actions, DAL hardening, deterministic tests, TypeScript scripts with --dry-run support, MCP runner, and docs alignment.

See: docs/plans/2026-04-29-plugin-mcp-inventory.md

## Implementation

- 1. Discovery: List all app/**/page.tsx, app/**/route.tsx, app/\*\*/layout.tsx grouped by route layout ((auth), (admin), (root)); produce .opencode/reports/pages-index.json.
- 2. Branch: Create 'feature/enhance/pages-layouts-mcp' and commit discovery + provenance.
- 3. Layout Components: Create ./components/layouts with RootLayoutWrapper, AuthLayoutWrapper, AdminLayoutWrapper, PageShell; add unit tests.
- 4. (Auth) Group: Refactor sign-in/sign-up pages to use AuthLayoutWrapper; fix components, DAL, actions; ensure seeded test flows.
- 5. (Admin) Group: Refactor admin pages to use AdminLayoutWrapper; ensure auth gating; fix affected DAL/actions; harden tests.
- 6. (Root) Group: Refactor dashboard, my-wallets, payment-transfer, settings, transaction-history to use RootLayoutWrapper; deduplicate UI.
- 7. Server Actions: Add 'use server', auth() early, Zod validation, return { ok, error? } shape to all actions/\*\*.
- 8. DAL: Add {db} transaction overrides where missing; improve types; add unit tests.
- 9. Tests: Remove skipped/non-deterministic tests; use seeded user (seed-user@example.com); update docs/test-context.md.
- 10. Scripts: Migrate bash/ps1/bat to TypeScript with ts-morph and --dry-run; update package.json.
- 11. MCP Runner: Implement scripts/mcp-runner.ts with mcp-find, mcp-add, mcp-remove, mcp-exec, dry-run mode.
- 12. Documentation: Update docs/\*\* to match new reality; ensure no broken links.
- 13. Validation: Run format, type-check, lint:strict, verify:rules; then run vitest + playwright E2E on seeded DB.
- 14. PR: Small commits per batch (<=7 files); include provenance; push and open PR with verify-rules report.
- 15. Handoff: Create .opencode/reports/change-log.md; mark done; create GH issues for any remaining work.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
<!-- SPECS_END -->
