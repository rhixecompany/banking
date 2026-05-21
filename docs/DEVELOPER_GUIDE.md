# Developer Guide

## Overview

This guide covers development setup, coding standards, and contribution workflows for the Banking application.

## Prerequisites

- **Runtime**: Node.js 18+ (LTS recommended)
- **Package Manager**: Bun (required for all commands)
- **Database**: PostgreSQL 14+ (local or Docker)
- **Accounts**: Plaid Sandbox, Dwolla Sandbox (free tier works)

## Quick Start

```bash
# Clone and install
git clone https://github.com/rhixecompany/banking.git
cd banking
bun install

# Set up environment
cp .env.example .env.local

# Start services (PostgreSQL)
docker-compose up -d

# Push database schema
bun run db:push

# Start development
bun run dev
```

## Project Structure

```
src/
├── actions/           # Server Actions (dot.camelCase naming)
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth routes (signin, signup)
│   ├── (root)/       # Main app (dashboard, wallets, transactions)
│   ├── (admin)/      # Admin panel
│   └── api/          # API routes
├── components/       # React components (PascalCase)
│   └── ui/          # shadcn/ui components
├── dal/              # Data Access Layer
├── database/         # Drizzle schema
├── hooks/            # Custom React hooks
├── lib/              # Utilities (auth, plaid, dwolla, utils)
├── stores/           # Zustand state
├── types/            # TypeScript types
└── assets/           # Static assets
```

## Environment Setup

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/banking

# Auth
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Plaid (Sandbox)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox

# Dwolla (Sandbox)
DWOLLA_KEY=your-dwolla-key
DWOLLA_SECRET=your-dwolla-secret
DWOLLA_ENV=sandbox
```

### Getting API Keys

1. **Plaid**: Sign up at https://dashboard.plaid.com (Sandbox is free)
2. **Dwolla**: Sign up at https://dashboard.dwolla.com (Sandbox is free)

## Database Commands

```bash
# Push schema (recommended for dev)
bun run db:push

# Generate migration
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio (visual DB editor)
bun run db:studio

# Reset database (dev only)
bun run db:reset
```

## Running the App

```bash
# Development (hot reload)
bun run dev

# Production build
bun run build

# Start production server
bun run start
```

## Code Quality

### Required Before Every PR

```bash
# Format code
bun run format

# TypeScript validation
bun run type-check

# Strict linting
bun run lint:strict
```

### Optional Testing

```bash
# All tests
bun run test

# Unit tests only
bun run test:unit

# E2E tests (Playwright)
bun run test:e2e
```

## Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Server Actions | `dot.camelCase` | `auth.signin.ts`, `plaid.actions.ts` |
| Components | `PascalCase` | `BankInfo.tsx`, `Pagination.tsx` |
| Utils/Hooks | `camelCase` | `formUrlQuery.ts`, `useMediaQuery.ts` |
| Database Tables | `snake_case` | `users`, `user_profiles` |
| DAL Files | `dot.camelCase` | `user.dal.ts`, `transaction.dal.ts` |

## Adding New Features

### 1. Server Action

Create in `src/actions/`:

```typescript
// actions/example.action.ts
"use server";

import { z } from "zod";
import { db } from "@/database/db";
import { exampleTable } from "@/database/schema";

const ExampleSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive()
});

export async function createExample(input: unknown) {
  const parsed = ExampleSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message, ok: false };
  }

  try {
    const [result] = await db
      .insert(exampleTable)
      .values(parsed.data)
      .returning();
    return { ok: true, data: result };
  } catch (error) {
    return { error: "Operation failed", ok: false };
  }
}
```

### 2. Database Table

1. Add schema to `src/database/schema.ts`
2. Run `bun run db:generate`
3. Run `bun run db:migrate`
4. Create DAL class in `src/dal/`

### 3. Component

1. Create in `src/components/` with PascalCase
2. Use shadcn/ui components when possible
3. Follow existing component patterns

## Common Tasks

### Connect a New Bank Integration

1. Add config to `.env`
2. Add helper functions to `src/lib/`
3. Create server actions in `src/actions/`
4. Add UI components in `src/components/`

### Add a New API Endpoint

1. Create route in `src/app/api/`
2. Use existing DAL classes for data access
3. Validate inputs with Zod
4. Return consistent response format

## Troubleshooting

### Common Issues

**"Dependencies lock file not found"**

```bash
bun install
```

**"TypeScript errors"**

```bash
bun run type-check
```

**"Database connection failed"**

- Verify `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running: `docker-compose ps`

**"Plaid/Dwolla errors"**

- Verify you're using Sandbox credentials
- Check `.env` variable names match documentation

## External Integrations

### Plaid (Bank Connections)

1. `createPlaidLinkToken` → returns link token
2. User authenticates with bank → receives `public_token`
3. `exchangeToken` → exchanges for `access_token` (stored encrypted)
4. `getAccounts` → retrieves linked bank accounts

### Dwolla (ACH Transfers)

1. `createDwollaCustomer` → creates customer in Dwolla
2. `addFundingSource` → links bank account
3. `verifyMicroDeposit` → verifies ownership
4. `initiateTransfer` → sends money via ACH

## Security Guidelines

1. **NEVER commit secrets** - Use `.env.local`
2. **Encrypt sensitive data** - Use `lib/utils` encryption functions
3. **Validate all inputs** - Use Zod at every action entry point
4. **Use soft-delete** - Never hard delete user data
5. **Idempotency** - Implement for all financial transactions

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [CODE_STYLE.md](../CODE_STYLE.md) - Coding standards
- [AGENTS.md](../AGENTS.md) - Agent commands and patterns
- [docs/](../) - All documentation
