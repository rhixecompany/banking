# Project Organization Guidelines

Top-level layout (high level)

- `app/` — Next.js App Router routes and Server Components
- `actions/` — Next.js Server Actions (mutations & side effects)
- `dal/` — Data Access Layer (Drizzle queries, typed results)
- `components/` — Feature components (both client and server wrappers)
  - `components/ui/` — shadcn / reusable UI primitives
- `database/` — `schema.ts` and generated migrations
- `lib/` — utility libraries and integration clients (plaid, dwolla, auth helpers, env)
- `scripts/` — code generation, seed runner, and developer scripts
- `tests/`
  - `tests/unit/` — unit tests (Vitest)
  - `tests/e2e/` — end-to-end tests (Playwright)
  - `tests/fixtures/` — test helper pages & fixtures
- `types/` — global or shared type declarations
- `.opencode/` — agent docs, plans, and operational metadata
- `docs/` — long-form docs, runbooks, deployment guides
- `components.json` — shadcn component registry (if present)
- `package.json` — scripts & dependency matrix

Where to put new code

- New feature with DB:
  - data shape and schema changes -> `database/schema.ts` (then `db:generate` -> review migration)
  - DAL methods for new entity -> `dal/<entity>.dal.ts`
  - Server mutations -> `actions/<feature>.actions.ts`
  - Server wrapper route -> `app/<route>/page.tsx` or `components/<feature>-server-wrapper.tsx`
  - Client UI -> `components/<feature>/<feature>-client-wrapper.tsx` and `components/ui/` for primitives
  - Tests -> `tests/unit/` for unit-level; `tests/e2e/` for end-to-end flows (use seed runner & Playwright helpers)

Component wrappers (recommended pattern)

- `<feature>-server-wrapper.tsx`
  - Fetches server data, imports server actions, passes actions & data as props to client wrapper.
- `<feature>-client-wrapper.tsx`
  - Declares `"use client"`, accepts server actions as props, uses `startTransition/useTransition` for calling server actions from the UI.

DAL Conventions

- `dal/<entity>.dal.ts` exports a small set of functions:
  - `findById()`, `findAllForUser()`, `create()`, `update()`, `delete()` etc.
- All SQL must be typed (Drizzle). Avoid per-row DB calls in loops — prefer bulk queries or joins.

Tests Organization

- Unit tests named as `*.test.ts` inside `tests/unit/`.
- E2E specs inside `tests/e2e/` and use playwright fixtures and helpers.
- Keep test helpers inside `tests/e2e/helpers/` or `tests/fixtures/`.

Scripts & Tooling

- `scripts/seed/` — seed runner (`scripts/seed/run.ts`) for deterministic seeds used by Playwright global-setup.
- `scripts/generate/*` — generators for actions, components, DAL, etc.

Naming hints & extensions

- Server action files: `<feature>.actions.ts`
- DAL files: `<plural-entity>.dal.ts` (e.g., `wallets.dal.ts` or `wallet.dal.ts` — pick repo-preferred pluralization consistently)
- UI primitives: `components/ui/<name>.tsx`
- Feature components: `components/<feature>/{<feature>-server-wrapper.tsx, <feature>-client-wrapper.tsx, ...}`

Examples (where things live in the repo)

- `app-config.ts` — centralized config parsing & validation
- `actions/plaid.actions.ts` — Plaid short-circuit and token exchange
- `actions/dwolla.actions.ts` — Dwolla integration & short-circuit
- `tests/e2e/helpers/plaid.mock.ts` — Playwright Plaid shim for deterministic tests
