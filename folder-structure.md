# Folder Structure (observed)

This file describes the key folders and their responsibilities based on the codebase layout.

## Top-Level Folders

- **app/** — Next.js App Router pages and layouts. Keep `app/page.tsx` public and static.
- **actions/** — Server Actions (mutations). All writes and business flows should use these.
- **dal/** — Data Access Layer. Use for all DB queries and to prevent N+1 queries.
- **database/** — Drizzle schema and DB initialization files.
- **components/** — UI components. Prefer presentational components under `components/layouts/`.
- **lib/** — Shared libraries and helpers (auth, env, schemas, dwolla, plaid, logger).
- **scripts/** — Build, seed, verify and utility scripts (see scripts/seed/run.ts and scripts/verify-rules.ts).
- **tests/** — Unit and E2E tests. E2E helpers live under tests/e2e/helpers.
- **.opencode/** — Agent and plan artifacts (instructions, plans, reports).
- **types/** — Shared TypeScript type definitions.

## App Router Structure

```text
app/
├── (auth)/              # Auth routes (login, register)
│   ├── sign-in/
│   └── sign-up/
├── (root)/              # Protected routes
│   ├── dashboard/
│   ├── my-wallets/
│   ├── payment-transfer/
│   ├── settings/
│   └── transaction-history/
├── api/                 # API routes (minimal — prefer Server Actions)
│   └── auth/
├── page.tsx             # Landing page (must remain public)
└── layout.tsx           # Root layout
```

## Components Structure

```text
components/
├── ui/                  # shadcn/ui components
├── layouts/             # Reusable layout components
├── layouts/form/        # Form-specific layouts
└── [feature]/           # Feature-specific components
```

## Server Actions

```text
actions/
├── register.ts          # User registration
├── dwolla.actions.ts    # Dwolla ACH operations
└── wallet.actions.ts    # Wallet management
```

## Data Access Layer

```text
dal/
├── user.dal.ts          # User operations
├── wallet.dal.ts        # Wallet operations
├── transaction.dal.ts   # Transaction operations (with eager loading)
└── health.dal.ts        # Health checks
```

## Scripts

```text
scripts/
├── seed/run.ts          # DB seeding (intentionally loads .env)
├── verify-rules.ts     # AST-based policy enforcement
├── mcp-runner.ts        # MCP server runner
├── plan-ensure.ts       # Plan validation
└── ts/                  # TypeScript scripts
    ├── entrypoints/     # CLI entrypoints
    ├── docker/          # Docker helpers
    └── cleanup/         # Cleanup scripts
```

## Tests

```text
tests/
├── e2e/                 # Playwright E2E tests
│   ├── helpers/         # Test helpers (plaid.mock.ts)
│   └── *.spec.ts       # E2E specs
└── unit/                # Vitest unit tests
    ├── dal/             # DAL tests
    ├── actions/         # Action tests
    └── stores/          # Store tests
```

## .opencode Structure

```text
.opencode/
├── commands/           # Implementation plans
├── instructions/       # Agent instructions
├── skills/            # Agent skills
├── reports/           # CI reports (rules-report.json)
├── registry.json      # OpenCode registry
└── mcp/               # MCP configurations
```

## When Creating New Features

Follow existing folder conventions and add tests under tests/ accordingly.

## Provenance

Evidence sources:

- `package.json` — scripts reference folders
- `tsconfig.json` — path aliases (`@/*`, `@/lib/*`)
- `scripts/verify-rules.ts` — folder-based policy enforcement
- `next.config.ts` — Next.js 16 configuration

Last updated: 2026-04-24
