# Spec: enhance-pages-feature

Scope: feature

Feature spec for enhance-pages-v2

Purpose: Detailed feature-level spec for implementing per-group page enhancements, reusable layout components, DAL fixes, tests hardening, and scripts modernization.

Acceptance criteria:

- All App Router pages (page.tsx/page.ts) under app/ have been refactored to use new reusable layout components in components/layouts.
- Server actions conform to server-action rules (use server, auth call, Zod validations, return shape).
- DAL updates are focused and tested; no behavioral regressions.
- Tests (Vitest + Playwright) are deterministic: flaky/skipped tests removed or fixed; Playwright uses seeded user (seed-user@example.com) for authenticated flows.
- Scripts under ./scripts migrated to TypeScript CLIs with ts-morph and have --dry-run support; shell scripts act as orchestrators; package.json updated.
- PRs created per group and per batch (<=7 files). All PRs include provenance and pass CI.

Detailed steps:

1. Discovery: explorer scan for pages; produce discovery.json. (Artifacts: .opencode/reports/enhance-pages/discovery.json)
2. Group plan: for each group produce batched file lists and branch names (enhance-pages/<group>/<batch-id>).
3. Implement components/layouts: create types, unit tests, and documentation. Prefer small primitives and composition.
4. Refactor pages & server actions: replace UI with components/layouts, fix server action patterns, add Zod schemas.
5. DAL improvements: small typed fixes; add {db} optional param where missing. Run unit tests.
6. Store consolidation: standardize existing store patterns; avoid introducing new store libs unless necessary.
7. Tests: fix flaky tests, seed DB, update docs/test-context.md, and make Playwright fixtures deterministic.
8. Scripts: migrate heavy logic to TS CLIs (ts-morph), add dry-run, update package.json, and adjust CI.
9. PRs: create small PRs per batch, include provenance and rules report.
10. Final validation: run full pipeline and fix issues.

Files to include in feature:

- New: components/layouts/\*\*
- Updated: app/**/page.tsx, app/**/layout.tsx (if present), actions/**, dal/**, tests/**, scripts/**, package.json, .github/workflows/\*\*

Timing and risk:

- Discovery: 1–2 hours
- Per-group: 4–12 hours each
- Scripts: 6–12 hours
- Final validation: 4–8 hours
- Total: 2–5 days

Notes: Follow AGENTS.md rules and create .opencode/commands/enhance-pages.plan.md if a change will touch >7 files across the repo in a single batch.
