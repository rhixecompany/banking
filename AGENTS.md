# AGENTS.md - Agentic Contributor Guide

Once A session start execute whoami && git config list, any other needed command,skills,hooks for context on agent commands

> **Important**: This is the canonical source-of-truth for automated agents and contributors. All agent commands, rules, and patterns should reference this file.

## Overview

This is a Next.js 16 fintech banking application with PostgreSQL, Drizzle ORM, and Plaid/Dwolla integrations. This guide provides patterns and conventions for AI agents and human contributors.

## Quick Reference

| Command               | Purpose                  |
| --------------------- | ------------------------ |
| `bun run dev`         | Start development server |
| `bun run build`       | Production build         |
| `bun run db:studio`   | Open Drizzle Studio      |
| `bun run format`      | Format code              |
| `bun run lint:strict` | Strict linting           |
| `bun run type-check`  | TypeScript validation    |

---

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
│   └── ui/           # shadcn/ui components
├── dal/              # Data Access Layer
├── database/         # Drizzle schema
├── lib/              # Utilities (auth, plaid, dwolla, utils)
├── stores/           # Zustand state
└── types/            # TypeScript types
```

---

## Naming Conventions

| Type | Convention | Example |
| --- | --- | --- |
| Server Actions | `dot.camelCase` | `auth.signin.ts`, `plaid.actions.ts` |
| Components | `PascalCase` | `BankInfo.tsx`, `Pagination.tsx` |
| Utils/Hooks | `camelCase` | `formUrlQuery.ts`, `useMediaQuery.ts` |
| Database Tables | `snake_case` | `users`, `user_profiles` |
| DAL Files | `dot.camelCase` | `user.dal.ts`, `transaction.dal.ts` |

---

## Code Patterns

### Server Actions

All mutations use Next.js Server Actions with Zod validation:

```tsx
// actions/register.ts
"use server";

import { z } from "zod";
import { db } from "@/database/db";
import { users } from "@/database/schema";

const RegisterSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim(),
  password: z.string().trim().min(8)
});

export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message, ok: false };
  }

  try {
    const [user] = await db
      .insert(users)
      .values(parsed.data)
      .returning();
    return { ok: true, user };
  } catch {
    return { error: "Registration failed", ok: false };
  }
}
```

### DAL Pattern

Use constructor-based DAL classes for type-safe queries:

```tsx
// dal/user.dal.ts
import { db } from "@/database/db";
import { users } from "@/database/schema";

export class UserDAL {
  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async findById(id: number) {
    return db.select().from(users).where(eq(users.id, id)).limit(1);
  }
}

export const userDal = new UserDAL();
```

### Zod Validation

Validate all action inputs with Zod at entry points:

```tsx
const ActionSchema = z.object({
  id: z.string().min(1),
  amount: z.string().transform(Number).pipe(z.number().positive())
});
```

---

## Environment Variables

Required variables in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

# Dwolla
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_ENV=sandbox
```

---

## Database

### Commands

```bash
# Push schema to database
bun run db:push

# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

### Schema Tables

| Table           | Purpose                         |
| --------------- | ------------------------------- |
| `users`         | Core user data with soft-delete |
| `user_profiles` | Extended user data              |
| `banks`         | Connected bank accounts         |
| `transactions`  | All transactions                |
| `recipients`    | Saved transfer recipients       |

---

## Testing

### Quick Validate (Required before PR)

```bash
bun run format        # Format code
bun run type-check    # TypeScript validation
bun run lint:strict   # Strict linting
```

### Optional Tests

```bash
bun run test          # Run all tests (slow)
bun run test:unit     # Unit tests only
bun run test:e2e      # E2E tests (Playwright)
```

---

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

---

## Security Rules

1. **NEVER commit secrets** - Use `.env.local` and access via `lib/env.ts`
2. **Encrypt sensitive data** - Use `lib/utils` encryption functions
3. **Validate all inputs** - Use Zod at every action entry point
4. **Use soft-delete** - Never hard delete user data
5. **Idempotency** - Implement for all financial transactions

---

## Common Tasks

### Adding a New Server Action

1. Create file in `src/actions/` with `dot.camelCase` naming
2. Add Zod validation schema
3. Implement action with proper error handling
4. Add to appropriate component

### Adding a New Database Table

1. Add schema to `src/database/schema.ts`
2. Run `bun run db:generate`
3. Run `bun run db:migrate`
4. Create DAL class in `src/dal/`

### Adding a New Component

1. Create in `src/components/` with PascalCase
2. Use shadcn/ui components when possible
3. Follow existing component patterns

---

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
- Ensure PostgreSQL is running

---

## Code Documentation Standards

### Quick Routing

**MANDATORY** - Use language-specific guides:

| Language | File Extension | Load This Guide |
| --- | --- | --- |
| **Python** | `.py` | `references/python_google_style.md` |
| **Go** | `.go` | `references/go_google_style.md` |
| **Terraform** | `.tf` | `references/terraform_style.md` |

### Decision Frameworks

#### 1. The Over-Documentation Paradox

**NEVER document every obvious one-liner** — it creates noise:

- Type hints + IDE tooltips show signatures; redundant descriptions waste tokens
- Docstrings drift from code → worse than no docs when outdated

**WHEN to document obvious code anyway**:

- Public API boundary (first-time users need anchoring)
- Team composition: Will junior developers maintain this?
- Open-source or vendor API: Users can't read implementation

#### 2. Audience-Driven Documentation

| Audience                | Documentation Approach               |
| ----------------------- | ------------------------------------ |
| **Library maintainers** | Minimal: API contract, edge cases    |
| **New team members**    | Detailed: Explain WHY, not just WHAT |
| **Open-source users**   | Comprehensive: Assume nothing        |
| **Internal-only code**  | Inline comments sufficient           |

#### 3. Lifecycle-Driven Investment

| Stability | Documentation Level |
| --- | --- |
| **Stable API** (6+ months) | Invest heavily: comprehensive docs + examples |
| **Experimental** | Lightweight: focus on intent |
| **Internal helper** | Minimal: inline comments on WHY |
| **Deprecated** | Document migration path + alternative |

#### 4. Type Hints vs. Docstring Parameters (TypeScript/Python)

```typescript
// ❌ WRONG: Args section repeats type info already in signature
function processData(
  records: Record<string, unknown>[],
  timeout: number
): boolean {
  /** Process data records.
   * @param records - A list of dictionaries containing records.  // redundant!
   * @param timeout - The timeout in seconds.                    // redundant!
   */
}

// ✅ RIGHT: Args section explains WHY, not WHAT type
function processData(
  records: Record<string, unknown>[],
  timeout: number
): boolean {
  /** Process data records with automatic retry.
   * @param records - Customer transaction records; must have 'id' and 'amount' keys.
   * @param timeout - Abort after this many seconds to prevent cascading API timeouts.
   */
}
```

#### 5. When to Deviate from Google Style

Google Style is a **foundation, not dogma**. Deviate when:

- **Team standard differs**: Follow your team's convention
- **Language evolution**: Modern versions allow more concise docs
- **Context requires it**: Internal API doesn't need public library rigor
- **Readability suffers**: If Google Style makes docs harder to scan, adapt

**Never deviate** on:

- One-line summary (always first)
- Parameter/return/error documentation
- Format consistency within a file

### Quality Standards

Before finalizing documentation:

- ✅ One-line summary is concise & action-oriented
- ✅ Grammar and punctuation are correct
- ✅ Language-specific formatting is consistent
- ✅ Complex functions include usage examples
- ✅ Parameters, returns, and errors are documented
- ✅ Documentation can be maintained (won't quickly drift)

### What NOT to Do

- ❌ Generic placeholders ("This function does stuff")
- ❌ Redundant descriptions mirroring code
- ❌ Mixed formatting styles in the same file
- ❌ Outdated documentation (comment says X, code does Y)
- ❌ Over-documenting trivial getters/setters

---

## References

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [CODE_STYLE.md](CODE_STYLE.md) - Coding standards
- [README.md](README.md) - Project overview
- [.opencode/instructions/](.opencode/instructions/) - Agent commands
