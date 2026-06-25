# Banking — Fintech Application

> **Stack:** Next.js 16 + Drizzle ORM | **Type:** Full-Stack Fintech | **Status:** Active

A full-stack fintech application built with Next.js 16, featuring bank account integration via Plaid and Dwolla, real-time transaction management, and comprehensive authentication.

---

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.2.4 (App Router) |
| **Language** | TypeScript ^6.0.3 (strict) |
| **UI** | React 19, Radix UI, shadcn/ui, Tailwind CSS 4.x |
| **State Management** | Zustand 5.x |
| **Data Display** | TanStack React Table, Recharts, Chart.js |
| **Database** | PostgreSQL via Drizzle ORM 0.45.x |
| **Authentication** | NextAuth.js v4, bcryptjs |
| **Payments/Fintech** | Plaid 42.x, Dwolla v2 |
| **Caching** | Upstash Redis |
| **Testing** | Vitest, Playwright |
| **Deployment** | Vercel, Docker |

## Architecture

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

## Project Structure

```
Banking/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Auth routes
│   │   ├── (root)/          # Main app routes
│   │   └── api/             # API route handlers
│   ├── components/          # React components
│   ├── actions/             # Server actions
│   ├── db/                  # Database schema & queries
│   │   └── schema.ts        # Drizzle schema
│   ├── lib/                 # Utility functions
│   └── hooks/               # React hooks
├── database/drizzle/        # Drizzle migrations
├── scripts/                 # Seed, transform, validate
├── tests/                   # Test files
├── compose/                 # Docker Compose profiles
└── docs/                    # Documentation
```

## Getting Started

```bash
# Prerequisites: Node.js >=18, Bun 1.3.14+, PostgreSQL

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Plaid, Dwolla, and database credentials

# Database setup
bun run db:generate
bun run db:push
bun run db:studio  # Optional: Drizzle Studio

# Start development
bun run dev

# Run tests
bun run test

# Lint and type-check
bun run lint:strict
bun run type-check
```

## Key Features

- **Account Management** — View balances, transaction history, and account details
- **Bank Linking** — Connect bank accounts via Plaid (sandbox for development)
- **Money Transfers** — ACH transfers via Dwolla
- **Authentication** — Secure login with NextAuth.js
- **Dashboard** — Interactive charts and financial overview
- **Rate Limiting** — Upstash Redis-based rate limiting

## Development Workflow

```bash
bun run dev              # Development server
bun run build            # Production build with prebuild checks
bun run validate         # Full validation suite
bun run format           # Prettier formatting
bun run lint:strict      # ESLint zero-warnings check
bun run type-check       # TypeScript type checking
bun run test             # Vitest + Playwright
```

## Coding Standards

- **TypeScript strict**: Full strict mode
- **App Router**: Server Components by default
- **Server Actions**: `"use server"` for mutations
- **Zod validation**: Schema validation for forms and APIs
- **`cn()` utility**: Tailwind class merging via `clsx` + `tailwind-merge`
- **Naming**: PascalCase components, camelCase hooks/utils, kebab-case pages
- **Database**: Drizzle ORM with `snake_case` tables
- **Security**: No secrets in VCS, encrypt sensitive data, soft-delete pattern

## Environment Variables

Key variables required:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — Auth configuration
- `PLAID_CLIENT_ID` / `PLAID_SECRET` — Plaid API credentials
- `DWOLLA_KEY` / `DWOLLA_SECRET` — Dwolla API credentials

## License

Private (no license specified)
