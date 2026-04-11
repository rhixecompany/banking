# feat/dwolla-dal-refactor

Goals

- Add DAL APIs that accept transaction-scoped DB instances via opts object.
- Refactor actions/dwolla.actions.ts to use DAL helpers inside existing db.transaction.
- Add unit + integration tests for errors.dal.ts.
- Run Zod codemod (dry-run → apply) — not executed here.

Scope

- Files: dal/transaction.dal.ts, dal/dwolla.dal.ts, actions/dwolla.actions.ts, tests/_, .opencode/plans/_

Risks

- Transactional semantics — mitigated by keeping db.transaction in the action and passing tx into DAL helpers.
- Codemod changes — run dry-run and review before apply.
- Integration tests require local Neon DB and migrations; do not push migrations without approval.

Validation

- Local type-check, lint, unit tests, and integration tests against Neon DB: npm run format NODE_OPTIONS=--max-old-space-size=4096 npm run type-check npm run lint:strict npx vitest run tests/unit/dal/errors.dal.test.ts npx vitest run tests/integration/dal/errors.dal.integration.test.ts

Rollback

- Revert the single combined commit if behavior regresses: git revert <sha>

(End plan)
