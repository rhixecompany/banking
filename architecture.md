# System Architecture Guidelines

Purpose

- Describe the high-level architecture and the design decisions the codebase follows.
- Give maintainers and contributors a concise reference that:
  - Explains boundaries between client/server and external systems
  - Lists architectural invariants and safe shortcuts for tests
  - Points to canonical files and patterns in the repo

Principles

- Single source of truth for configuration: use `app-config.ts` and `lib/env.ts` for environment access; do not read `process.env` ad-hoc.
- Clear separation of concerns:
  - UI & client-only logic: components marked with `"use client"`.
  - Server logic & side effects: server components, Server Actions (files in `actions/`), and DAL (files in `dal/`).
- All database access must go through `dal/*`. Avoid ad-hoc SQL in components or server actions.
- Deterministic tests: external integrations (Plaid, Dwolla) are short-circuited in test/seed modes using canonical mock tokens (prefix `MOCK_`) and Playwright client stubs.
- Small server actions: prefer small, testable server actions with explicit input validation and a consistent return shape.

Key Components & Responsibilities

- Next.js App Router (`app/`)
  - Server components live in `app/` routes and should fetch data on the server.
  - Use server wrapper → client wrapper pattern for components that need server actions.
- Server Actions (`actions/`)
  - Mutations and side effects (create, update, delete).
  - Validate inputs with Zod.
  - Return: `{ ok: boolean; error?: string }` for consistent client handling.
  - After successful mutations, call `revalidatePath()` or `revalidateTag()` as required.
- Data Access Layer (`dal/`)
  - All DB queries go here. Use Drizzle ORM for typed queries and to avoid N+1 queries by writing explicit joins.
  - DAL functions should return typed results and avoid side effects (persisting ledger + metadata is allowed when required but should be explicit).
- Database and Migrations
  - Schema lives in `database/schema.ts`.
  - Migration workflow:
    1. `npm run db:generate` -> review SQL migrations under `database/migrations`
    2. `npm run db:migrate` to apply
    - Use `db:push` only for local/dev/test flows (Playwright global-setup and Docker rely on `push` in some CI fallback flows).
- External Integrations
  - Plaid: `actions/plaid.actions.ts` and `lib/plaid.ts`. Use `isMockAccessToken()` to detect mock tokens and short-circuit calls on the server.
  - Dwolla: `actions/dwolla.actions.ts` and `lib/dwolla.ts`. If processor tokens or fundingSource URLs are mock, short-circuit external calls and return deterministic mock URLs; still persist app metadata (dwolla_transfers, transactions) when a `createLedger` payload is provided.
- E2E & Test Strategy
  - Playwright E2E (`tests/e2e/`). Global-setup seeds DB when `PLAYWRIGHT_PREPARE_DB=true` (`tests/e2e/global-setup.ts`).
  - Client-side Plaid is stubbed using `tests/e2e/helpers/plaid.mock.ts` (`page.addInitScript` to inject a `Plaid.create` shim).
  - Unit tests use Vitest and should mock `auth()` and DAL calls when DB persistence isn't required.
- Observability & Safety
  - Use `validateRequiredConfig()` (`app-config.ts`) to ensure required secrets (`ENCRYPTION_KEY`, `NEXTAUTH_SECRET`) exist in production.
  - DO NOT commit secrets. Keep them in CI secrets / env store.
  - Add logs for important server actions (server-side errors are expected to be logged, see `eslint.config.mts` server-actions rules).

Common Flows (Data Flow Summaries)

- Plaid Link -> `exchangePublicToken` -> processorToken -> Dwolla funding source -> create bank account in DB
- Payment transfer:
  - Client: Payment form (client component)
  - Server action: `actions/dwolla.actions.createTransfer` (calls Dwolla or short-circuits in test mode)
  - Persist: transactions + dwolla_transfers
  - Post-mutation: `revalidatePath('/transactions')` or specific cache tags

Where to Look First (source of truth)

- `app-config.ts` — env & feature checks
- `package.json` — scripts and tooling
- `eslint.config.mts` — linting rules and project conventions
- `.prettierrc.ts` — formatting conventions
- `database/schema.ts` — canonical DB schema
- `dal/` & `actions/` — data & mutation patterns
- `tests/e2e/global-setup.ts` — Playwright seeding and test setup

Operational guidance

- Running E2E locally: ensure `DATABASE_URL`, `ENCRYPTION_KEY`, `NEXTAUTH_SECRET` are present and run:
  - `PLAYWRIGHT_PREPARE_DB=true npm run test:ui`
- Seeding: `npm run db:seed` (`scripts/seed/run.ts`). Destructive operations require `RUN_DESTRUCTIVE` & flags.
- Migrations: always review generated SQL before applying.

Appendix (short-circuit test policy)

- In tests/dev mode, detect mock tokens (`isMockAccessToken()`) and:
  - Avoid external network calls
  - Return deterministic shapes (empty arrays, fixed ids, mock URLs)
  - Persist application metadata where necessary for downstream assertions (so tests can assert DB state)
