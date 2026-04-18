Title: process-env-replacements

Short description: Replace direct process.env usage in runtime test helpers with lib/env or app-config getters

Files targeted (initial batch, <=7 files):

- tests/e2e/helpers/db.ts
- tests/e2e/utils/auth-fixtures.ts
- tests/fixtures/auth.ts
- tests/e2e/global-setup.ts
- scripts/utils/get-connection-string.ts
- scripts/utils/io.ts

Rationale:

- scripts/ and tooling files intentionally use process.env in some places; avoid touching build-time configs (playwright.config.ts, drizzle.config.ts, next-sitemap.config.ts).
- Prioritize runtime helpers and E2E test utilities that should use the central lib/env or app-config.ts to ensure consistent validation and avoid direct process.env reads flagged by verify-rules.

Steps:

1. For each file in the batch, replace direct process.env reads with an import from lib/env (prefer env.getEnv() or env constants) or specific app-config exports if configuration requires validation.
2. Preserve behavior and fallbacks: when code intentionally falls back to process.env for local one-off runs, keep fallback but prefer lib/env first.
3. Add short comments in files left unchanged (tooling) explaining why process.env is acceptable there.
4. Run `npm run format` and `node scripts/verify-rules.ts` to regenerate rules-report.json and confirm no new critical findings.
5. Run lightweight targeted tests where possible (e.g., `npx vitest run <file>` for unit tests touching changed modules).
6. Commit each batch with a concise message and one-line provenance listing files read and why change was made.

Follow-ups / Next batches:

- After initial batch, re-run verify-rules and pick next flagged files (keep batches <=7 files).
- Update PR #9 body to include before/after verify-rules counts, list of changed files, and any remaining high-priority items.

Safety notes:

- Do not change files that are clearly build-time or CLI tooling where process.env usage is deliberate.
- If a replacement risks changing import-time semantics, leave a TODO and do not commit breaking changes without asking the owner.

Provenance: plan created after reading .opencode/reports/rules-report.json and lib/env.ts to identify high-signal targets.
