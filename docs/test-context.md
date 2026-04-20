# Test Context & Seed Instructions

This file documents the required environment and steps to run deterministic unit and E2E tests for the Banking app.

Important environment variables (ensure present in `.env.local`):

- DATABASE_URL
- ENCRYPTION_KEY
- NEXTAUTH_SECRET

Seed DB (creates default seeded users used by Playwright E2E):

1. npm run db:seed

Playwright notes:

- Free port 3000 before running Playwright.
- Use `PLAYWRIGHT_PREPARE_DB=true` when running `npm run test:ui` to ensure DB seeding in CI.

Auth seed credentials (example) — confirm after running `npm run db:seed`:

- Seed user email: seed-user@example.com
- Seed user password: Password123!

Update this file if seeding details change.
