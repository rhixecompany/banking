# Banking — Project Documentation

## Project Overview

Banking is a full-stack fintech web application built with Next.js 16 that provides users with a modern banking experience. It integrates with Plaid for bank account linking and transaction fetching, and Dwolla for peer-to-peer payments and fund transfers. The platform supports user authentication, account management, transaction history, admin dashboards, and real-time financial data visualization.

**Purpose**: To offer a seamless, secure digital banking interface that aggregates financial accounts and enables money movement between users.

**Target Users**: Individual consumers who want to view linked bank accounts, track spending, and send/receive money.

**Key Features**:
- Plaid-powered bank account linking (supports 12,000+ financial institutions)
- Dwolla payment processing for transfers between users
- Real-time transaction fetching and categorization
- Interactive dashboards with spending charts and analytics
- Admin panel for user and transaction management
- Role-based access control (user/admin)

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     Next.js 16 App                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ App Router│  │ Server   │  │ Client Components│  │
│  │ (RSC)    │  │ Actions  │  │ (React 19)      │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                 │            │
│  ┌────┴──────────────┴─────────────────┴─────────┐  │
│  │           Data Access Layer (DAL)              │  │
│  └────────────────────┬──────────────────────────┘  │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│         ┌─────────────┴─────────────┐               │
│         │       Drizzle ORM         │               │
│         └─────────────┬─────────────┘               │
│         ┌─────────────┴─────────────┐               │
│         │     PostgreSQL (Neon)     │               │
│         └───────────────────────────┘               │
│                                                     │
│  External Services:                                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │  Plaid   │  │  Dwolla  │  │ Upstash Redis  │  │
│  └──────────┘  └──────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js 16 App Router** | Server Components minimize client bundle, App Router provides file-based routing and API routes |
| **Drizzle ORM** | Type-safe SQL with full TypeScript inference, lighter than Prisma |
| **PostgreSQL (Neon)** | Serverless Postgres with branching, auto-scaling, and database cloning |
| **Plaid + Dwolla** | Industry-standard financial APIs; Plaid for read (account linking), Dwolla for write (transfers) |
| **NextAuth v4** | Flexible authentication with credential and OAuth provider support |
| **Server Actions** | Form handling and mutations without explicit API route definitions |

## Developer Guide

### Prerequisites

- Bun >= 1.3.14
- Node.js >= 18
- PostgreSQL (or Neon account)
- Plaid developer account
- Dwolla developer account

### Setup

```bash
# Clone and install
git clone <repo-url>
cd banking
bun install

# Environment setup
cp .env.example .env.local
# Fill in DATABASE_URL, PLAID_*, DWOLLA_*, NEXTAUTH_* values

# Database
bun run db:generate
bun run db:migrate
bun run db:seed

# Start development
bun run dev
```

### Development Workflow

```bash
# Code formatting
bun run format

# Type checking
bun run type-check

# Linting (strict with zero warnings)
bun run lint:strict

# Testing
bun run test:ui        # Playwright E2E tests
bun run test:browser   # Vitest component tests

# Database operations
bun run db:studio      # Drizzle Studio GUI
bun run db:push        # Push schema changes
bun run db:generate    # Generate migration files
```

### Project Scripts

The project has an extensive script system under `scripts/`:
- `scripts/ts/` — TypeScript scripts for CI, deploy, cleanup
- `scripts/seed/` — Database seeding scripts
- `scripts/utils/` — CI helper utilities
- `scripts/generate/` — Code generators for actions, components, features

## User Guide

### Authentication

Users can sign up with their name, email, and password, or log in with existing credentials. Password strength is validated using zxcvbn-ts.

### Linking Bank Accounts

1. Navigate to "My Wallets" or "Connect Bank"
2. Click "Connect Bank" to open Plaid Link
3. Search for your financial institution or use the sandbox credentials for testing
4. Authenticate and grant permissions
5. Your accounts will appear in the dashboard

### Making Transfers

1. Go to "Payment Transfer"
2. Select the source account and recipient
3. Enter the amount and description
4. Confirm the transfer
5. Track status in transaction history

### Viewing Transactions

The dashboard displays recent transactions with filtering by date range, category, and account. Charts visualize spending patterns across categories.

## Contributing Guide

1. Fork the repository
2. Create a feature branch (`feat/your-feature-name`)
3. Install dependencies with `bun install`
4. Make changes following existing code patterns
5. Run verification: `bun run format && bun run type-check && bun run lint:strict`
6. Write or update tests
7. Submit a pull request with `Fixes #issue` referencing related issues
8. Ensure CI passes before requesting review

### Code Standards

- TypeScript strict mode enabled
- Server Components by default, `use client` only when needed
- Zod schemas for all input validation
- DAL helpers for all database interactions
- Use `app-config.ts` for environment variables, not direct `process.env`
