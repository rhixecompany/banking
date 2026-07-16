# Project Folder Structure Blueprint

## Project: Banking — Next.js Fintech Application

**Generated:** 2026-06-25  
**Project Type:** Next.js (App Router) + TypeScript + Drizzle ORM + Playwright + Docker  
**Auto-detected:** Yes (Next.js — `next.config.ts`, `src/app/`, `package.json`, `playwright.config.ts`, `docker-compose.yml`)

---

## Directory Tree

```
Banking/
├── .claude/skills/           # Claude AI skill definitions (17 skills)
├── .cursor/                  # Cursor IDE config (agents, rules, plans, hooks)
├── .dockerignore
├── .editorconfig
├── .env / .env.example / .env.local
├── .envs/
│   ├── local/
│   └── production/
├── .eslintignore
├── .github/
│   └── workflows/            # CI/CD workflows (build, deploy, playright, etc.)
├── .husky/                   # Git hooks
├── .lintstagedrc.ts
├── .logs/
├── .markdownlintrc.json
├── .npmrc
├── .prettierignore
├── .prettierrc.ts
├── .vercel/
├── .vscode/
├── AGENTS.md
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CODE_STYLE.md
├── CONTRIBUTING.md
├── DATABASE_SCHEMA.md
├── DEPLOYMENT_GUIDE.md
├── DEVELOPMENT_GUIDE.md
├── LICENSE
├── Makefile
├── README.md
├── Railway.toml
├── SECURITY.md
├── SETUP_GUIDE.md
├── SUPPORT.md
├── SYSTEM.md
├── TESTING_GUIDE.md
├── app-config.ts
├── bin/
│   ├── cleanup/
│   ├── deploy/
│   ├── docker/
│   ├── lib/
│   ├── server/
│   └── utils/
├── bun.lock
├── bunfig.toml
├── code-exemplars.md
├── components.json           # shadcn/ui components
├── compose/
│   ├── dev/
│   │   └── node/
│   ├── prod/
│   │   ├── grafana/
│   │   └── prometheus/
│   └── traefik/
│       ├── auth/
│       └── dynamic/
├── copilot-instructions.md
├── cross-linking-report.md
├── database/
│   └── drizzle/              # Drizzle ORM migrations
│       └── meta/
├── debug-pw.ts
├── docker-compose.yml
├── docs/
│   ├── Project_Architecture/
│   ├── mcp/
│   ├── nextjs/
│   ├── patterns/
│   ├── plaid/
│   ├── plans/
│   ├── sections/
│   ├── services/
│   ├── specs/
│   └── superpowers/
├── drizzle.config.ts
├── eslint.config.mts
├── execution-summary.md
├── folder-structure.md
├── init-env.ts
├── install-agents.sh
├── install.sh
├── my-plugin.ts
├── next-env.d.ts
├── next-sitemap.config.ts
├── next.config.ts
├── node_modules/
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── project-workflow.md
├── proxy.ts
├── public/
├── railway.json
├── requirements.txt
├── run-tasks.txt / run-tasks.txt.backup
├── scripts/
│   ├── codemod/
│   ├── db/
│   ├── generate/
│   ├── maintenance/
│   ├── provenance/
│   ├── seed/
│   ├── transform/
│   ├── ts/                  # TypeScript-based scripts
│   ├── types/
│   └── validate/
├── setup-tests.ts
├── src/
│   ├── actions/              # Server actions
│   ├── app/                  # Next.js App Router
│   │   ├── (admin)/          # Admin routes
│   │   │   └── admin/
│   │   ├── (auth)/           # Auth routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (root)/           # Main app routes
│   │   │   ├── dashboard/
│   │   │   ├── my-wallets/
│   │   │   ├── payment-transfer/
│   │   │   ├── settings/
│   │   │   └── transaction-history/
│   │   ├── __playwright__/   # Playwright test utilities
│   │   └── api/              # API routes
│   │       ├── auth/
│   │       ├── dwolla/
│   │       └── health/
│   ├── assets/
│   │   └── svg/
│   ├── components/           # React components by domain
│   │   ├── admin/
│   │   ├── animated-counter/
│   │   ├── auth-form/
│   │   ├── chart-area-interactive/
│   │   ├── dashboard/
│   │   ├── doughnut-chart/
│   │   ├── footer/
│   │   ├── global-error/
│   │   ├── header-box/
│   │   ├── home/
│   │   ├── layouts/
│   │   └── ui/               # Shared UI primitives
│   └── lib/                  # Utilities, configs
├── technology-stack.md
├── temp-check.ts / temp-check2.ts / temp-reset.ts
├── templates/
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── validation-report.md
├── vercel.json
└── vitest.config.ts
```

---

## Naming Conventions

| Convention | Pattern | Examples |
| --- | --- | --- |
| **React components** | kebab-case | `auth-form/`, `doughnut-chart/`, `animated-counter/` |
| **Route groups** | `(group-name)` | `(auth)`, `(root)`, `(admin)` |
| **Config files** | dotted-prefix | `.env.example`, `.lintstagedrc.ts` |
| **Scripts** | kebab-case | `init-env.ts`, `debug-pw.ts`, `temp-reset.ts` |
| **Docker compose** | docker-compose.yml | Standard Docker Compose |

---

## File Placement Patterns

- **App routes**: `src/app/(group)/route-name/` (Next.js App Router convention)
- **Server actions**: `src/actions/`
- **UI components**: `src/components/<component-name>/` (each in own directory)
- **API routes**: `src/app/api/<resource>/`
- **Database**: `database/drizzle/` with Drizzle ORM
- **Docker**: `compose/dev/`, `compose/prod/`, `compose/traefik/`
- **Docs**: `docs/` organized by topic (mcp, nextjs, patterns, plaid, etc.)
- **Scripts**: `scripts/` organized by purpose (db, seed, transform, ts, etc.)
- **Environment**: `.envs/local/`, `.envs/production/`

---

## Project Type Indicators

| Indicator | Value |
| --- | --- |
| Has `next.config.ts` | ✅ Next.js |
| App Router `src/app/` | ✅ Next.js App Router |
| Has `playwright.config.ts` | ✅ Playwright E2E tests |
| Has `drizzle.config.ts` | ✅ Drizzle ORM |
| Has `docker-compose.yml` | ✅ Docker Compose |
| Has `components.json` | ✅ shadcn/ui component library |
| Multiple `.env` files | ✅ Environment-specific configs |
| Has `src/actions/` | ✅ Next.js Server Actions |

---

## Key Architecture Decisions

1. **Next.js App Router** with route groups for auth, admin, and main app.
2. **Drizzle ORM** for database with migrations in `database/drizzle/`.
3. **shadcn/ui** component library with `components.json`.
4. **Playwright** for E2E testing.
5. **Docker Compose** with development and production profiles, Traefik reverse proxy, Grafana/Prometheus monitoring.
6. **Server Actions** in `src/actions/` for data mutations.
7. **Plaid/Dwolla** integration for fintech features (banking transfers).
