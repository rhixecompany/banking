# Technology Stack Blueprint

## Project: Banking — Fintech App

> **Generated:** 2026-06-25  
> **Generator:** technology-stack-blueprint-generator  
> **Analysis Depth:** Comprehensive

---

## Overview

A full-stack fintech application built with Next.js 16, featuring bank account integration via Plaid and Dwolla, real-time transaction management, and comprehensive authentication.

**Project Type:** Full-Stack Web Application (Fintech)  
**Stack Type:** Next.js

---

## Technology Stack

### Languages & Runtimes

| Technology | Version | Usage |
|---|---|---|
| TypeScript | ^6.0.3 | Primary language (strict mode) |
| React | ^19.2.5 | UI framework |
| Next.js | 16.2.4 | Full-stack framework (App Router) |
| Node.js | >=18 | JavaScript runtime |
| Bun | 1.3.14 | Package manager & runtime |

### Package Manager

| Tool | Version |
|---|---|
| bun | 1.3.14 |

### Core Dependencies

| Category | Dependencies |
|---|---|
| **UI Framework** | next, react, react-dom |
| **UI Components** | @radix-ui/* (15+ packages), @base-ui/react, shadcn/ui via radix-ui, cmdk, vaul, sonner, embla-carousel-react |
| **Styling** | tailwindcss ^4.2.4, @tailwindcss/postcss, tailwind-merge, tailwindcss-animate, tw-animate-css, class-variance-authority, clsx |
| **Icons** | lucide-react, @tabler/icons-react |
| **State Management** | zustand ^5.0.12 |
| **Forms & Validation** | react-hook-form ^7.75.0, @hookform/resolvers ^5.2.2, zod ^4.4.3, input-otp |
| **Data Display** | @tanstack/react-table ^8.21.3, recharts 3.8.1, chart.js ^4.5.1, react-chartjs-2 |
| **Drag & Drop** | @dnd-kit/* (core, modifiers, sortable, utilities) |
| **Database** | drizzle-orm ^0.45.2, drizzle-kit ^0.31.10, pg ^8.20.0, postgres ^3.4.9 |
| **Authentication** | next-auth ^4.24.14, @auth/drizzle-adapter ^1.11.2, bcryptjs ^3.0.3 |
| **Payments/Fintech** | plaid ^42.2.0, dwolla-v2 ^3.4.0, react-plaid-link ^4.1.1 |
| **Caching/Rate Limiting** | @upstash/ratelimit ^2.0.8, @upstash/redis ^1.37.0 |
| **Email** | nodemailer ^8.0.7, resend |
| **Utilities** | date-fns ^4.1.0, query-string ^9.3.1, clsx, tailwind-merge, sharp ^0.34.5 |

### Dev Dependencies

| Category | Dependencies |
|---|---|
| **Testing** | @playwright/test ^1.59.1, vitest ^4.1.5, @testing-library/react, @testing-library/jest-dom, msw ^2.14.2 |
| **Linting** | eslint ^10.3.0, eslint-config-next 16.2.4, typescript-eslint ^8.59.1, eslint-plugin-* (15+ plugins) |
| **Formatting** | prettier ^3.8.3, prettier-plugin-* (4 plugins) |
| **Database Tools** | drizzle-kit ^0.31.10 |
| **Deployment** | vercel ^53.1.0 |
| **Utilities** | husky ^9.1.7, lint-staged, tsx ^4.21.0, rimraf, npm-check-updates |

---

## Licensing

| Component | License |
|---|---|
| Banking app | Private (no license specified) |

---

## Database Schema

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via `pg` & `postgres` drivers)
- **Schema**: `src/db/schema.ts`
- **Migrations**: Managed via `drizzle-kit`
- **Studio**: Drizzle Kit Studio for visual DB management

---

## Authentication & Authorization

- **Framework**: NextAuth.js v4
- **Adapter**: @auth/drizzle-adapter
- **Password Hashing**: bcryptjs
- **Password Strength**: @zxcvbn-ts/core + language packs

---

## External Integrations

| Service | Package | Purpose |
|---|---|---|
| Plaid | plaid, react-plaid-link | Bank account linking |
| Dwolla | dwolla-v2 | ACH transfers & payments |
| Upstash Redis | @upstash/redis, @upstash/ratelimit | Caching & rate limiting |
| Upstash QStash | @upstash/qstash-cli | Scheduled tasks |

---

## Scripts

| Script | Description |
|---|---|
| `dev` | Start development server |
| `build` | Production build with prebuild checks |
| `db:*` | Database operations (generate, push, migrate, studio, seed) |
| `test` | Run Playwright + Vitest tests |
| `lint` / `lint:strict` | ESLint with zero-warnings check |
| `format` | Prettier formatting |
| `type-check` | TypeScript type checking |
| `validate` | Full validation suite |

---

## Coding Conventions

- **TypeScript strict**: Full strict mode enabled
- **App Router**: Next.js App Router with Server Components by default
- **PascalCase components**: React components in PascalCase
- **camelCase hooks/utils**: Custom hooks and utilities in camelCase
- **kebab-case pages**: File names in kebab-case
- **Zod validation**: Schema validation for forms and API
- **`cn()` utility**: Tailwind class merging via `clsx` + `tailwind-merge`
- **shadcn/ui components**: Radix-based composable components

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                   Banking (Next.js 16)                     │
├──────────────────────────────────────────────────────────┤
│  App Router Pages                                         │
│  ├── /dashboard          Account overview                  │
│  ├── /transactions       Transaction history               │
│  ├── /transfer           Money transfers                   │
│  ├── /connect-bank       Plaid/Dwolla integration           │
│  └── /settings           User preferences                  │
├──────────────────────────────────────────────────────────┤
│  API Routes (App Router)                                  │
│  ├── /api/auth/*         NextAuth authentication           │
│  ├── /api/plaid/*        Plaid endpoints                   │
│  ├── /api/dwolla/*       Dwolla endpoints                  │
│  └── /api/transactions/* Financial operations              │
├──────────────────────────────────────────────────────────┤
│  Database Layer                                           │
│  └── Drizzle ORM → PostgreSQL (Neon/RDS)                  │
├──────────────────────────────────────────────────────────┤
│  External Services                                        │
│  ├── Plaid (bank accounts)                                │
│  ├── Dwolla (ACH transfers)                               │
│  └── Upstash Redis (caching)                              │
└──────────────────────────────────────────────────────────┘
```

---

## Deployment

| Platform | Configuration |
|---|---|
| Vercel | Primary deployment target |
| Docker | Docker Compose for local/self-hosted |
| Railway | `Railway.toml` configured |

---

## Environment Requirements

- Node.js >=18
- Bun 1.3.14
- PostgreSQL database
- Plaid API keys (sandbox for development)
- Dwolla API keys
- Upstash Redis URL
