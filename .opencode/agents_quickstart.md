Quick Start — Banking (commands you will actually run)

1. Start dev server

- npm run dev

2. Typecheck and lint (recommended pre-PR)

- npm run type-check
- npm run lint:strict

3. Run unit tests quickly

- All unit tests (Vitest): npm run test:browser
- Single file: npx vitest -c vitest.config.ts run path/to/test/file

4. Run full test (includes Playwright E2E) — expensive

- npm run test # runs test:ui (Playwright) then test:browser (Vitest)

5. Seed DB (careful)

- npm run db:seed # this script loads .env.local first and must be executed via the npm script
- Preview: npm run db:seed -- --dry-run

6. Drizzle migrations

- Generate SQL: npm run db:generate (inspect database/migrations before applying)
- Apply: npm run db:migrate

Quick safety & gotchas

- Home is intentionally static/public — do not add auth() or DAL/db queries to app/page.tsx or Home server wrappers.
- The seed runner loads .env.local before importing app modules; do NOT run seed by directly invoking tsx on the script unless you replicate the env loading sequence.
- npm run test runs Playwright UI tests first; only use it when you have a DB prepared for E2E.
