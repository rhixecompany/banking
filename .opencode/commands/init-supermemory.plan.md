# init-supermemory.plan.md

## Summary

Create local draft memory files that capture high-value, project-scoped insights for persistent agent memory initialization. These files are drafts and will live under .opencode/memory/ for review before any automated Supermemory writes.

## Why

The environment cannot call the Supermemory API (SUPERMEMORY_API_KEY missing). Creating local memory drafts preserves research output in the repository so it can be reviewed and later imported into Supermemory when credentials are available.

## Batches (<=7 files each)

Batch 1 (5 files)

- .opencode/memory/project-config.md
- .opencode/memory/build-and-scripts.md
- .opencode/memory/architecture.md
- .opencode/memory/auth-patterns.md
- .opencode/memory/dal-patterns.md

Batch 2 (4 files)

- .opencode/memory/testing-gotchas.md
- .opencode/memory/contributors.md
- .opencode/memory/verify-rules-report.md
- .opencode/memory/agent-guidance.md

## Verification steps

1. Run `npm run format` to format files.
2. Run `node scripts/verify-rules.ts` to regenerate rules-report and ensure no repo policy violations.
3. Review .opencode/memory/\*.md files and confirm accuracy.

## Provenance (files read to create these drafts)

- package.json, package-lock.json
- README.md, AGENTS.md, .github/copilot-instructions.md
- .opencode/opencode.json, .opencode/oh-my-opencode-slim.json
- scripts/verify-rules.ts, .opencode/reports/rules-report.json
- database/schema.ts, database/db.ts
- dal/\*.ts (user.dal.ts, wallet.dal.ts, dwolla.dal.ts, transaction.dal.ts)
- lib/auth-options.ts, app/api/auth/[...nextauth]/route.ts
- app-config.ts, lib/env.ts

## Notes

- These are draft memory files created at user request. Do not push to main; follow branch workflow if committing.
- If you want the memories written to Supermemory later, provide SUPERMEMORY_API_KEY and I will run the import.
