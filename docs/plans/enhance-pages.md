---
plan name: enhance-pages
plan description: Enhance pages, layouts, scripts, MCP
plan status: active
---

## Idea

Enhance Next.js pages, layouts, components, scripts, and MCP tooling

## Implementation

- 1. Finalize discovery & normalization: normalize routes to clean paths (e.g., '/sign-in'), produce canonical pages index from explorer output and save as .opencode/reports/pages-index.json.
- 2. Branch & provenance: create feature branch 'enhance/pages-layouts-mcp' and commit the pages index + provenance file; small commits thereafter.
- 3. Implement shared layout components: add ./components/layouts with generic wrappers (RootLayoutWrapper, AuthLayoutWrapper, AdminLayoutWrapper, PageShell). Implement TypeScript generics, accessibility, and server/client boundary comments. Add unit tests for these components.
- 4. (Auth) group pass: refactor sign-in and sign-up pages and their components to use new wrappers. Locate and fix associated components, DAL, actions, and stores. Standardize and reuse existing stores; add adapters if shape mismatch. Update tests to use seeded credentials (seed-admin@example.com / Password1!) and deterministic flows.
- 5. (Admin) group pass: refactor admin pages/components; ensure auth gating, reuse AdminLayoutWrapper, fix DAL/actions used by admin pages, and harden tests similarly.
- 6. (Root) group pass: sequentially refactor dashboard, my-wallets, payment-transfer, settings, transaction-history pages and their components/DAL/actions/stores. Replace duplicate UI logic with reusable components in ./components/layouts. Harden tests and E2E flows.
- 7. Root index: refactor app/page.tsx to use RootLayoutWrapper and shared components; ensure RootProviders are wired and stores are validated.
- 8. Tests & fixtures: update tests/helpers, fixtures, and docs/test-context.md. Remove skipped/non-deterministic tests, standardize assertions, replace flaky waits with deterministic checks, and ensure E2E uses seeded user and seeded DB fixtures. Document test run steps in docs/test-context.md.
- 9. Scripts modernization: migrate logic from bash/ps1/bat in ./scripts to TypeScript scripts (ts-node/Node), add ts-morph AST-safe transformations and --dry-run flag, make shell scripts thin orchestrators, update package.json script entries, and add unit tests for scripts where feasible.
- 10. MCP runner & tooling: implement @scripts/mcp-runner.ts with dry-run cataloging and helper functions for mcp-find, mcp-add, mcp-remove, mcp-exec, mcp-config-set, mcp-create-profile, mcp-activate-profile, code-mode, mcp-discover. Do not run docker (user chose dry-run). Prepare logic to remove specified MCP images (dry-run). Update .opencode/mcp_servers.json and .opencode.json in dry-run mode; add option to perform real run if user later approves.
- 11. init-enhanced.md: rewrite .opencode/commands/init-enhanced.md into a comprehensive reproducible checklist with automation commands, verification steps, and instructions to auto-create GitHub issues for maintainers; include remediation steps and rollback guidance.
- 12. Validation & QA: After all code modifications, run formatting, type-check, strict lint, verify-rules, then unit tests and Playwright E2E using seeded DB. Iterate fixes until green.
- 13. Commit & PR: Make small, atomic commits (<7 files where possible), include one-line provenance in each commit/PR body listing files read and purpose, push feature branch and open PR draft with verify:rules report and test summaries.
- 14. Handover: Add .opencode/reports/change-log.md summarizing changes, mark plan done, and create GH issues for any remaining tasks.

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
