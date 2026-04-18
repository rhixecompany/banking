Title: process-env-replacements

Short description: Replace direct process.env usage in runtime code

Goal: Centralize runtime environment access by replacing direct process.env reads with imports from lib/env or app-config.getDatabaseUrl() where appropriate. Keep edits small and batched (<=7 files per batch) and re-run verify-rules after each batch.

Scope and constraints:

- Only edit runtime code and test helpers that run inside Node at runtime. Avoid build-time configuration files that intentionally use process.env (playwright.config.ts, next-sitemap.config.ts, drizzle.config.ts) unless necessary and documented.
- Keep batches to 7 files or fewer. For batches that exceed 7 files, create a new plan file or expand this plan with explicit justification.
- Do not commit secrets or .env files.
- After each batch: run `npm run format`, run verify-rules (`npm run verify:rules` or the local script), inspect `.opencode/reports/rules-report.json`, and commit with a one-line provenance description.

Batch 1 (safe, recommended - apply first):

1. scripts/utils/get-connection-string.ts
2. scripts/utils/io.ts
3. tests/e2e/global-setup.ts
4. tests/e2e/helpers/auth.ts
5. tests/helpers/test-db.ts
6. lib/db-client.ts
7. scripts/seed/seed-test-data.ts

Batch 2 (next):

1. app/api/some-runtime-handler.ts
2. lib/some-service.ts
3. tests/unit/some-service.spec.ts
4. scripts/utils/email.ts
5. actions/some.server-action.ts
6. tests/e2e/helpers/wallets.ts
7. scripts/utils/cache.ts

Batch 3 (audit-only — review before edits):

- files intentionally reading process.env (playwright.config.ts, next-sitemap.config.ts, drizzle.config.ts). Review and add small wrappers only if safe.

Verification steps per batch:

1. Run `npm run format` to normalize formatting.
2. Run `node scripts/verify-rules.ts` (or `npm run verify:rules`) to regenerate `.opencode/reports/rules-report.json`.
3. Confirm no new critical issues introduced. Address warnings as needed.
4. Commit changes with a provenance line: "provenance: read files X, changed process.env -> lib/env for Y".

Rollout plan:

- Create this plan file (done).
- Wait for approval to apply Batch 1. When approved, apply batch edits, run verify-rules, commit, push to chore/triage/env-fix, update PR #9.

Notes / rationale:

- The recommended first batch favors test helpers and script utilities which are low-risk and easier to validate.
- Centralizing env access will reduce verify-rules warnings and make runtime configuration consistent across environments.
