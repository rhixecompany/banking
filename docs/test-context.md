# Test Context & Seed Instructions

This file documents the required environment and steps to run deterministic unit and E2E tests for the Banking app.

## Route Mapping

| Route Group | Layout File | Routes | Auth Required |
| --- | --- | --- | --- |
| `(auth)` | `(auth)\layout.tsx` | `/sign-in`, `/sign-up` | No |
| `(admin)` | `(admin)\layout.tsx` | `/admin` | Yes (Admin) |
| `(root)` | `(root)\layout.tsx` | `/dashboard`, `/my-wallets`, `/payment-transfer`, `/settings`, `/transaction-history` | Yes |
| Root | `app\page.tsx` | `/` | No |

## Environment Variables

Important environment variables (ensure present in `.env.local`):

- DATABASE_URL
- ENCRYPTION_KEY
- NEXTAUTH_SECRET

Seed DB (creates default seeded users used by Playwright E2E):

1. npm run db:seed

Notes for deterministic runs:

- Use `npm run db:seed -- --dry-run` to preview changes without mutating the database.
- For CI (Playwright E2E), set PLAYWRIGHT_PREPARE_DB=true and ensure CI provides DATABASE_URL, ENCRYPTION_KEY, and NEXTAUTH_SECRET via the CI secret store.
- The seeder supports `--reset` to truncate tables; CI destructive operations require RUN_DESTRUCTIVE=true and --yes. Local developers should avoid --reset unless necessary.

Playwright notes:

- Free port 3000 before running Playwright.
- Use `PLAYWRIGHT_PREPARE_DB=true` when running `npm run test:ui` to ensure DB seeding in CI.

Auth seed credentials (example) — confirm after running `npm run db:seed`:

- Seed user email: seed-user@example.com
- Seed user password: Password123!

Update this file if seeding details change. When adding or changing seeded credentials:

- Commit only non-secret seed fixtures (e.g., tests/fixtures/seed-user.json). Do NOT commit any real secrets.
- Update this document with the visible seed-user email and password only for test accounts.

Playwright & CI notes:

- Free port 3000 before running Playwright locally.
- CI should run Playwright in a dedicated test job that sets PLAYWRIGHT_PREPARE_DB=true to seed the database before starting the app server.
- Use the test helper that creates an authenticated session token for seeded users instead of UI login to avoid flaky flows.
