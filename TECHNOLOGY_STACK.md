# Banking - Technology Stack Documentation

**Project Path:** `projects/Banking`
**Generated:** 2026-07-28
**Status:** Active (Fintech Application)

---

## Technology Stack Overview

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Bun | 1.3.14 | Primary runtime & package manager |
| **Framework** | Next.js | 16.2.4 | App Router, React 19, Server Components |
| **Language** | TypeScript | 6.0.3 | Strict mode, full type safety |
| **UI Library** | React | 19.2.5 | Server/Client Components, Hooks |
| **Styling** | Tailwind CSS | 4.2.4 | Utility-first, CSS-first config (v4) |
| **UI Components** | Radix UI + shadcn/ui | Latest | Accessible, unstyled primitives |
| **State Management** | Zustand | ^5.0.12 | Lightweight global state |
| **Server State** | TanStack React Table | ^8.21.3 | Data tables with sorting/filtering |
| **Forms** | React Hook Form + zod | ^7.75.0 / ^4.4.3 | Validation + form handling |
| **ORM** | Drizzle ORM | ^0.45.2 | Type-safe SQL, PostgreSQL |
| **Database** | PostgreSQL | Latest | Primary relational database |
| **Auth** | NextAuth.js | ^4.24.14 | Authentication (Credentials, OAuth) |
| **Payments/Banking** | Plaid + Dwolla | ^42.2 / ^3.4 | Account linking, ACH transfers |
| **Charts** | Chart.js + Recharts | ^4.5 / 3.8 | Financial visualizations |
| **Email** | nodemailer | ^8.0.7 | Transactional emails |
| **Rate Limiting** | Upstash Redis + Ratelimit | ^1.37 / ^2.0 | Serverless Redis + token bucket |
| **Real-time** | Upstash QStash | ^2.0 | Webhook delivery, scheduling |
| **DnD** | dnd-kit | ^6.3 / ^10.0 | Drag & drop interactions |
| **Icons** | lucide-react | ^1.14.0 | Icon library |
| **Testing** | Vitest + Playwright | ^4.1 / ^1.59 | Unit + E2E testing |
| **Linting** | ESLint 10 + Prettier 3 | ^10.3 / ^3.8 | Code quality, zero-warnings gate |
| **Type Check** | tsc --noEmit | 6.0.3 | Strict TypeScript compilation |
| **Deploy** | Docker + Vercel | - | Container + edge deployment |

---

## Dependencies Analysis

### Production Dependencies (80 packages)

| Category | Packages | Count |
|----------|----------|-------|
| **Core Framework** | next, react, react-dom | 3 |
| **UI Components** | @radix-ui/* (18 packages), class-variance-authority, clsx, tailwind-merge, vaul | 23 |
| **Forms & Validation** | react-hook-form, @hookform/resolvers, zod | 3 |
| **State & Data** | zustand, @tanstack/react-table, @tanstack/react-query, date-fns | 4 |
| **Database** | drizzle-orm, pg, postgres, drizzle-zod | 4 |
| **Auth** | next-auth, bcrypt, bcryptjs, jsonwebtoken, @types/jsonwebtoken | 5 |
| **Payments** | plaid, dwolla-v2, react-plaid-link | 3 |
| **Charts** | chart.js, react-chartjs-2, recharts, react-countup | 4 |
| **Email** | nodemailer, @types/nodemailer | 2 |
| **Redis/Queue** | @upstash/redis, @upstash/ratelimit, @upstash/qstash, @upstash/workflow, ioredis | 5 |
| **Utilities** | lucide-react, sonner, cmdk, input-otp, embla-carousel-react, embla-carousel-autoplay, date-fns, query-string, js-yaml, glob, vfile, vfile-matter, tailwindcss-animate, tw-animate-css, cross-env, dotenv, dotenv-safe | 20 |
| **Security** | @zxcvbn-ts/*, bcrypt, ajv, ajv-formats | 6 |

### Development Dependencies (60 packages)

| Category | Packages |
|----------|----------|
| **TypeScript** | typescript, @types/*, tsx, ts-morph, ts-stub, dts-gen, vite-tsconfig-paths |
| **Testing** | vitest, @vitest/browser-playwright, @vitest/browser-preview, @vitest/coverage-v8, happy-dom, jsdom, @testing-library/*, msw, web-vitals |
| **E2E** | @playwright/test, playwright |
| **Linting** | eslint, @eslint/*, @typescript-eslint/*, eslint-plugin-*, eslint-config-next, eslint-config-prettier, eslint-formatter-compact |
| **Formatting** | prettier, prettier-plugin-*, pretty-quick |
| **Build/Dev** | cross-env, rimraf, commander, inquirer, globby, ts-node, jscodeshift, fast-xml-parser |
| **Database** | drizzle-kit, @auth/drizzle-adapter |
| **Markdown** | markdownlint, markdownlint-cli, markdownlint-cli2 |
| **Spell Check** | cspell |
| **Git Hooks** | husky, lint-staged |
| **CI/Deploy** | vercel, npm-check-updates, next-sitemap, update-browserslist-db |
| **MCP** | @tarquinen/opencode-smart-title |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, Bun config |
| `tsconfig.json` | TypeScript strict config (extends root) |
| `drizzle.config.ts` | Drizzle ORM configuration |
| `eslint.config.mts` | ESLint flat config |
| `.prettierrc.ts` | Prettier configuration |
| `.markdownlintrc.json` | Markdown linting rules |
| `vitest.config.ts` | Vitest configuration |
| `playwright.config.ts` | Playwright E2E config |
| `next-sitemap.config.ts` | Sitemap generation |
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS (v4 CSS-first) |
| `bun.lock` | Lockfile (Bun-managed) |
| `.env.local` | Local environment (gitignored) |

---

## Coding Conventions

### TypeScript
- **Strict mode**: All strict flags enabled
- **No `any`**: Use `unknown` with type guards
- **Modules**: ESM only (`"type": "module"`)
- **Path aliases**: `@/` → `src/`
- **Validation**: Zod schemas for all API inputs

### React/Next.js
- **Components**: Function components only (no classes)
- **Server Components**: Default in App Router
- **Client Components**: Only when needed (`'use client'`)
- **State**: Zustand (global), React Hook Form + Zod (forms)
- **Styling**: `cn()` utility + CVA for variants

### Database
- **Schema**: `src/db/schema.ts` (Drizzle)
- **Migrations**: `drizzle-kit generate/migrate` (not `db:push`)
- **Studio**: `drizzle-kit studio` for inspection

### Testing
- **Unit**: Vitest (`src/**/*.test.ts`)
- **E2E**: Playwright (`tests/`, Chromium project)
- **Database**: Playwright prepares test DB

---

## Usage Patterns

### API Routes
```
src/app/api/
├── auth/[...nextauth]/      # NextAuth.js
├── plaid/                   # Plaid webhooks & tokens
├── dwolla/                  # Dwolla webhooks & transfers
├── accounts/                # Account CRUD
├── transactions/            # Transaction queries
└── webhooks/                # Generic webhook handler
```

### Database Schema
```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  plaidAccountId: text('plaid_account_id').unique(),
  // ...fields
});
```

### Authentication Flow
1. NextAuth.js with credentials + Plaid OAuth
2. JWT strategy with secure cookies
3. Middleware protection for `/dashboard/*`
4. Server-side session via `getServerSession`

### Payment Flow (Plaid + Dwolla)
1. User links bank via Plaid Link (client-side)
2. Plaid public_token exchanged for access_token (server)
3. Access_token stored encrypted
4. Dwolla customer created + funding source attached
5. Transfers initiated via Dwolla API

---

## Key Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `lint` | `eslint --config eslint.config.mts .` | Lint (zero warnings) |
| `lint:fix` | `eslint --fix` | Auto-fix lint issues |
| `format` | `prettier --write .` | Format code |
| `type-check` | `tsc --noEmit` | Type check |
| `test` | `vitest run + playwright test` | Full test suite |
| `db:generate` | `drizzle-kit generate` | Generate migrations |
| `db:push` | `drizzle-kit push` | Push schema (dev) |
| `db:studio` | `drizzle-kit studio` | Database UI |
| `db:seed` | `tsx scripts/seed/run.ts` | Seed database |
| `validate` | Full quality gate | Pre-deployment check |

---

## License Summary

| License | Packages |
|---------|----------|
| MIT | ~120 |
| Apache 2.0 | ~15 |
| ISC | ~5 |
| BSD | ~5 |
| Other | ~5 |

---

## CI/CD Pipeline

**Workflow:** `.github/workflows/banking-ci.yml`

1. **Install** → `bun install --frozen-lockfile`
2. **Type Check** → `bun run type-check`
3. **Lint** → `bun run lint:strict`
4. **Format Check** → `bun run format:check`
5. **Test** → `bun run test`
6. **Build** → `bun run build`
7. **Deploy** → Vercel (on merge to `staged`)

---

*Generated by Hermes Agent Technology Stack Blueprint Generator*