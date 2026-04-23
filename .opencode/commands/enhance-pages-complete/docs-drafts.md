# Draft docs - components, tests context, scripts

## docs/components-layouts.md (draft)

This document describes the new reusable layout components saved under `./components/layouts`.

Components to provide:

- RootLayoutWrapper (Server Component) - provides global providers, theme, and top-level layout hooks.
- AuthLayoutWrapper (Server Component) - wraps auth pages and handles public-only routing.
- AdminLayoutWrapper (Server Component) - admin gating and admin UI shell.
- AdminSidebar, MobileNav (Client Components inside layouts) - interactive widgets.
- Shared cards: WalletCard, TotalBalance, TransactionList (Server Components with client micro-widgets if interactivity required).

API guidelines:

- Server Components by default; place interactivity in `"use client"` child components.
- Use explicit TypeScript generics for list components (e.g., TransactionList<T>).
- Keep props minimal and serializable.

Examples and patterns will be included in the implementation PRs.

## docs/tests-context.md (draft)

Seed strategy:

- scripts/seed.ts will create deterministic seeded users:
  - TEST_SEED_EMAIL=test+seed@example.com
  - TEST_SEED_PASSWORD=Test1234!
  - TEST_ADMIN_EMAIL=admin+seed@example.com
  - TEST_ADMIN_PASSWORD=Admin1234!
- The seed script targets DATABASE_URL from `.env.local` and writes credentials to `.env.local` only (not committed).

Playwright auth flow:

- Use seed to create user and programmatic login to obtain auth cookie.
- Add a playwright fixture `tests/e2e/setup/seed-and-login.ts` that ensures seed is applied before tests.

Vitest:

- Unit tests should mock auth() and DAL using MSW or jest-like mocks.

## docs/scripts.md (draft)

Scripts consolidation plan:

- Convert shell scripts that mutate files into TypeScript under `scripts/ts` using ts-morph utilities.
- Add `--dry-run` and `--yes` for destructive scripts.
- Keep shell/ps1/bat scripts as thin wrappers that call the TypeScript entrypoints via `node` or `tsx`.
- Add `scripts/ts/utils/tsmorph-runner.ts` to provide shared TS editing helpers.

Validation:

- For each converted script, provide unit tests under `tests/scripts` exercising dry-run mode.
