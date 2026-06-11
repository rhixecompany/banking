# Banking Architecture

## Overview

Full-stack fintech banking application with Next.js 16, PostgreSQL, and integrations with Plaid (bank linking) and Dwolla (ACH transfers). Supports user authentication, wallet management, transaction history, and payment transfers.

## Tech Stack

| Category         | Technology                         |
| ---------------- | ---------------------------------- |
| Framework        | Next.js 16 (App Router)            |
| Database         | PostgreSQL                         |
| ORM              | Drizzle                            |
| Auth             | NextAuth v4 (credentials provider) |
| Bank Integration | Plaid                              |
| ACH Transfers    | Dwolla                             |
| Validation       | Zod                                |
| State            | Zustand                            |
| Language         | TypeScript                         |

## Directory Structure

```
src/
├── actions/           # Server actions (mutations)
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Sign-in, sign-up
│   ├── (root)/      # Dashboard, banks, transactions
│   ├── (admin)/     # Admin panel
│   └── api/         # API routes
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── constants/        # App constants
├── dal/              # Data Access Layer
├── database/        # Schema & migrations
├── hooks/            # Custom React hooks
├── lib/              # Utilities (auth, plaid, dwolla, utils)
├── stores/          # Zustand stores
├── types/           # TypeScript types
└── assets/          # Static assets
```

## Core Components

### Data Layer

**Database Schema** (`src/database/schema.ts`): 12 tables

- `users` - User accounts with soft-delete
- `user_profiles` - Extended user data
- `banks` - Connected bank accounts (Plaid + Dwolla)
- `transactions` - Money transfers
- `recipients` - Saved payment recipients
- enums: `user_role`, `transaction_status`, `transaction_type`, `transaction_channel`

**DAL Files** (`src/dal/`): Database query layer

- `user.dal.ts` - User CRUD
- `wallet.dal.ts` - Wallet operations
- `transaction.dal.ts` - Transaction queries
- `recipient.dal.ts` - Recipient management
- `dwolla.dal.ts` - Dwolla customer data
- `admin.dal.ts` - Admin queries

### API Layer

**API Routes** (`src/app/api/`): | Endpoint | Purpose | |----------|----------| | `/api/auth/[...nextauth]` | Session management | | `/api/auth/local-create` | User registration | | `/api/auth/local-validate` | Credentials validation | | `/api/dwolla/webhook` | ACH transfer events | | `/api/health` | Health check |

**Server Actions** (`src/actions/`): | File | Functions | |------|-----------| | `auth.signin.ts` | `signin(credentials)` | | `register.ts` | `registerUser(data)` | | `plaid.actions.ts` | `createPlaidLinkToken`, `getAccounts`, `exchangeToken` | | `dwolla.actions.ts` | `createDwollaCustomer`, `initiateTransfer`, `verifyMicroDeposit` | | `wallet.actions.ts` | `connectWallet`, `disconnectWallet` | | `transaction.actions.ts` | `getRecentTransactions`, `transferMoney` | | `recipient.actions.ts` | `getRecipients`, `addRecipient` |

### External Integrations

**Plaid Flow**:

1. `createPlaidLinkToken` → returns link token
2. User authenticates with bank → receives `public_token`
3. `exchangeToken` → exchanges for `access_token` (stored encrypted)
4. `getAccounts` → retrieves linked bank accounts

**Dwolla Flow**:

1. `createDwollaCustomer` → creates customer in Dwolla
2. `addFundingSource` → links bank account
3. `verifyMicroDeposit` → verifies ownership via small deposits
4. `initiateTransfer` → sends money via ACH

## Data Flow

### User Authentication

```
Login Page → /api/auth/local-validate → signin action → bcrypt verify → NextAuth session
```

### Connect Bank Account

```
Wallets Page → Plaid Link UI → exchangeToken action → encrypt + store access_token
```

### Transfer Money

```
Payment Form → transferMoney action → validate → idempotency key → Dwolla API → webhook updates status
```

## Configuration

**Environment Variables** (`.envs/`):

- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Session encryption
- `PLAID_CLIENT_ID`, `PLAID_SECRET` - Plaid API
- `DWOLLA_KEY`, `DWOLLA_SECRET` - Dwolla API

**Config Files**:

- `next.config.ts` - Next.js config
- `drizzle.config.ts` - Drizzle CLI config
- `lib/auth-options.ts` - NextAuth configuration

## Security

- **Soft Delete**: All user data uses `deletedAt` timestamp — never hard delete
- **Encryption**: Plaid `access_token` and Dwolla tokens stored encrypted via `lib/utils.ts`
- **Session**: NextAuth JWT with `httpOnly` cookies, `secure` in production
- **Validation**: All server action inputs validated with Zod schemas
- **Idempotency**: Financial operations use crypto-generated keys to prevent duplicates

## State Management

**Zustand Stores** (`src/stores/`):

| Store             | Purpose                            |
| ----------------- | ---------------------------------- |
| `useUIStore.ts`   | UI state (sidebar, modals, themes) |
| `useBankStore.ts` | Bank account data caching          |

```typescript
// Usage in components
import { useUIStore } from "@/stores";

const { sidebarOpen, toggleSidebar } = useUIStore();
```

## Related Documentation

- **Code Patterns**: See [CODE_STYLE.md](./CODE_STYLE.md) for naming conventions and implementation patterns
- **Agent Guidance**: See [AGENTS.md](./AGENTS.md) for authoritative development rules
- **Consolidated Guides**: See `/docs/` for Drizzle, Plaid, Dwolla, and Docker documentation

## Build & Deploy

```bash
# Development
bun run dev

# Build
bun run build

# Database
bun run db:push    # Push schema
bun run db:migrate # Run migrations

# Docker
docker-compose up -d   # PostgreSQL + Redis
```
