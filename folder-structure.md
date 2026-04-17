# Folder Structure (observed)

This file describes the key folders and their responsibilities based on the codebase layout.

- app/ — Next.js App Router pages and layouts. Keep `app/page.tsx` public and static.
- actions/ — Server Actions (mutations). All writes and business flows should use these.
- dal/ — Data Access Layer. Use for all DB queries and to prevent N+1 queries.
- database/ — Drizzle schema and DB initialization files.
- components/ — UI components. Prefer presentational components under `components/layouts/`.
- lib/ — Shared libraries and helpers (auth, env, schemas, dwolla, plaid, logger).
- scripts/ — Build, seed, verify and utility scripts (see scripts/seed/run.ts and scripts/verify-rules.ts).
- tests/ — Unit and E2E tests. E2E helpers live under tests/e2e/helpers.
- .opencode/ — Agent and plan artifacts (instructions, plans, reports).

When creating new features, follow existing folder conventions and add tests under tests/ accordingly.
