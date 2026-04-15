# Technology Stack & Version Matrix

This repository's primary technologies and guidance for supported versions.

Core

- Next.js: 16.2.2 — App Router + Server Actions + Server Components
- React: 19 — uses React Compiler patterns (project configured for React 19)
- TypeScript: ^6.0.2 — `strict` mode is enabled in `tsconfig.json`

Node & Runtime

- Recommended Node version: >= 18 (Node 18 or Node 20 LTS recommended). Next.js 16 & many tools require Node 18+.
- Target JS: ES2017 (`tsconfig.json`)

Database / ORM

- PostgreSQL (Neon commonly used in demos)
- Drizzle ORM: 0.45.2 (drizzle-kit used for migrations)
- DB workflow:
  - `npm run db:generate`
  - `npm run db:migrate`
  - `npm run db:push` (dev/test convenience only)

Authentication / Security

- NextAuth v4: used with JWT strategy (see `lib/auth-options.ts` and `lib/auth.ts`)
- Required secrets:
  - `ENCRYPTION_KEY` (AES-256-GCM)
  - `NEXTAUTH_SECRET`
- `app-config.ts` centralizes validation & presence checks

Integrations

- Plaid (plaid package ^41)
- Dwolla (dwolla-v2 ^3.x)
- Both integrations include test short-circuit patterns and Playwright client stubs.

Frontend / UI

- Tailwind CSS v4 (project uses tailwind plugin & tailwind-plugin-prettier)
- shadcn/ui — component primitives used in `components/ui/`
- @radix-ui/\* primitives
- React Hook Form + Zod (validation glue)

Testing & QA

- Playwright: @playwright/test ^1.59.1 (E2E)
- Vitest: ^4.1.2 (unit & integration)
- Playwright test runner config: `playwright.config.ts`
- Playwright global-setup seeds DB when `PLAYWRIGHT_PREPARE_DB=true`
- Playwright helpers: `tests/e2e/helpers/plaid.mock.ts` for Plaid injection

Build & Tooling

- ESLint (`eslint.config.mts`) + many plugins (see file for rules)
- Prettier 3.8.1 (`.prettierrc.ts`)
- tsx & ts-morph for scripts
- drizzle-kit for DB migration generation
- dev scripts:
  - `npm run dev`
  - `npm run type-check`
  - `npm run lint:strict`
  - `npm run format`

CI / Deployment

- Vercel / Railway / self-hosting possible. See README and docs/ for deployment guides.
- CI validations: `npm run validate` (build + lint + tests)
- DO NOT commit secrets; use GitHub Actions secrets or your deployment provider’s secrets.

Recommended version policy

- Keep Next.js and major libraries up-to-date within major versions to avoid breaking App Router behaviors.
- Update dependencies with `npm-check-updates` and run full test+lint pipeline before merging.
