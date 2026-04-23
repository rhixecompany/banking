---

title: Env Fix And Triage created-by: OpenCode agent summary: |- Triage verify-rules findings for environment variable usage and 'any' TypeScript warnings. Create a minimal plan for replacing direct process.env reads with the central app-config/lib/env helpers, apply a small safe fix for database/db.ts, and list follow-up tasks to remediate other top warnings.

tasks:

- id: triage-1 title: Prioritise process.env replacements description: |- Replace direct process.env usage in critical runtime code (database, lib) first. Defer script/tooling replacements to a secondary pass. Files to consider (top-ranked by occurrence):
  - database/db.ts
  - lib/env.ts (audit for deprecated direct process.env uses)
  - scripts/\* (seed, utils, generate) priority: high

- id: fix-db-1 title: Replace process.env usage in database/db.ts description: |- Use app-config.getDatabaseUrl() to resolve DATABASE_URL with NEON_DATABASE_URL fallback instead of reading process.env directly. This is a small, low-risk change that reduces verify-rules warnings. priority: high

- id: plan-for-large-changes title: Create plan for bulk changes description: |- Many warnings (no-any) are in UI components and tests. If we plan to touch >7 files, create a follow-up plan listing the exact files to modify. This plan should be added to .opencode/commands so verify-rules recognizes it. priority: medium

- id: followup-1 title: Triage 'no-any' warnings description: |- Review the top components with 'any' usage and either add proper types or justify/skips via allowlist. priority: low

notes: | Created automatically by the agent as part of requested triage. This plan file references the change that will be applied immediately to database/db.ts. Create additional plans for any multi-file changes.
