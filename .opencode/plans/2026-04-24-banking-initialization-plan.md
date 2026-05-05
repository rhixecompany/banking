# Banking Application Initialization Plan

**Goal:** Provide a structured onboarding guide for understanding and working on the Banking application effectively.

**Created:** 2026-04-24

---

## 1. Current Project State

### 1.1 Overview

The Banking application is a **Fintech SaaS platform** built with Next.js 16.2.2 that connects to multiple bank accounts via Plaid, displays real-time transactions, and enables fund transfers between users via Dwolla ACH.

### 1.2 Repository Statistics

- **Location:** `C:\Users\Alexa\Desktop\SandBox\Banking`
- **Package Manager:** npm
- **Last Updated:** 2026-04-24
- **Git Remote:** https://github.com/rhixecompany/banking

### 1.3 Tech Stack Confirmed

| Component    | Version | Status       |
| ------------ | ------- | ------------ |
| Next.js      | 16.2.2  | ✅ Confirmed |
| React        | 19      | ✅ Confirmed |
| TypeScript   | 6.0.2   | ✅ Confirmed |
| Drizzle ORM  | 0.45.2  | ✅ Confirmed |
| NextAuth     | 4.24.13 | ✅ Confirmed |
| Plaid        | 41.4.0  | ✅ Confirmed |
| Dwolla       | 3.4.0   | ✅ Confirmed |
| Zod          | 4.3.6   | ✅ Confirmed |
| Playwright   | 1.59.1  | ✅ Confirmed |
| Vitest       | 4.1.2   | ✅ Confirmed |
| Tailwind CSS | v4      | ✅ Confirmed |

### 1.4 Project Files Structure

```
Banking/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login, register)
│   ├── (root)/            # Protected routes (dashboard, settings, banks)
│   └── api/              # API routes
├── actions/               # 13 Server Actions files
├── dal/                   # 10 DAL files
├── database/              # Drizzle schema
├── components/            # UI components + shadcn/ui
├── lib/                   # Shared utilities, auth, env
├── scripts/               # Build, seed, verify scripts
├── tests/                 # Unit + E2E tests (36 test files)
├── .opencode/            # Agent artifacts and plans
└── docs/                 # Deployment guides
```

---

## 2. Key Conventions to Maintain

### 2.1 Environment Access

```
❌ BAD:  const secret = process.env.DATABASE_URL;
✅ GOOD: import { db } from "@/app-config";
         const secret = db.DATABASE_URL;
```

- Use `app-config.ts` (preferred) or `lib/env.ts` for all env access
- Only exceptions: `scripts/seed/run.ts` and `proxy.ts`

### 2.2 Server Actions Pattern

All mutations MUST use Server Actions with this pattern:

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal";

const CreateSchema = z.object({
  email: z.string().email().describe("User email")
});

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const parsed = CreateSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };

  try {
    await userDal.create(parsed.data);
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create user" };
  }
}
```

### 2.3 Database Access (DAL Pattern)

```
❌ BAD:  const user = await db.select().from(users).where(eq(users.id, id));
✅ GOOD: import { userDal } from "@/dal";
         const user = await userDal.findById(id);
```

- All DB access via `dal/*` helpers
- Avoid N+1 queries using eager loading

### 2.4 Validation Requirements

- Use Zod with `.describe()` for all fields
- Schema validation before any DB/external API calls
- Return shape: `{ ok: boolean; error?: string }`

### 2.5 TypeScript Standards

- **Strict mode enabled** - never use `any`
- Use `unknown` with type guards
- Explicit return types for exported functions

---

## 3. Actionable Steps for Working on the Project

### Phase 1: Initial Setup (Day 1)

#### Step 1.1: Install Dependencies

```bash
npm install
```

#### Step 1.2: Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Add required values:
# - NEXTAUTH_SECRET (openssl rand -base64 32)
# - ENCRYPTION_KEY (openssl rand -hex 32)
# - DATABASE_URL (PostgreSQL connection string)
# - PLAID_CLIENT_ID / PLAID_SECRET
# - DWOLLA_KEY / DWOLLA_SECRET
```

#### Step 1.3: Set Up Database

```bash
npm run db:push      # Push schema to DB
npm run db:seed      # Seed test data (if available)
npm run db:studio    # Optional: Visual DB editor
```

#### Step 1.4: Run Development Server

```bash
npm run dev          # Starts on http://localhost:3000
```

### Phase 2: Understanding Architecture (Day 1-2)

#### Step 2.1: Read Core Documentation (in order)

1. `AGENTS.md` - Master instruction set (this file is derived from it)
2. `architecture.md` - System architecture overview
3. `tech-stack.md` - Exact version requirements
4. `coding-standards.md` - Enforceable code style rules
5. `exemplars.md` - Code pattern examples

#### Step 2.2: Study Key Files

| File | Purpose | Read Priority |
| --- | --- | --- |
| `app-config.ts` | Typed env configuration | HIGH |
| `lib/auth.ts` | Session helper | HIGH |
| `lib/auth-options.ts` | NextAuth config | HIGH |
| `dal/user.dal.ts` | User DB operations | HIGH |
| `dal/transaction.dal.ts` | Transaction DB ops | MEDIUM |
| `actions/register.ts` | Server action example | HIGH |
| `database/schema.ts` | DB schema definition | MEDIUM |
| `scripts/verify-rules.ts` | Policy enforcement | MEDIUM |

#### Step 2.3: Understand Data Flow

```
User Action → Server Action (actions/) → DAL (dal/) → Drizzle → PostgreSQL
                                          ↓
                                    External APIs (Plaid/Dwolla)
```

### Phase 3: Development Workflow (Ongoing)

#### Step 3.1: Before Making Changes

1. Read relevant exemplar files from `exemplars.md`
2. Check existing patterns in similar features
3. Create plan if changes affect >7 files

#### Step 3.2: During Development

1. Follow Server Actions pattern for mutations
2. Use DAL helpers for all DB operations
3. Add Zod validation with descriptions
4. Use TypeScript strict typing

#### Step 3.3: Pre-PR Validation Checklist

```bash
npm run format        # Format code with Prettier
npm run type-check    # TypeScript validation
npm run lint:strict   # ESLint (zero warnings)
npm run verify:rules  # Repository policy checks
```

#### Step 3.4: Testing (if applicable)

```bash
npm run test:browser  # Vitest unit tests (fast)
npm run test:ui        # Playwright E2E tests (slower)
```

---

## 4. Verification & Checklist Items

### 4.1 Environment Setup Verification

- [ ] `.env.local` exists with all required variables
- [ ] Database connection is working (`npm run db:check`)
- [ ] NextAuth secret is configured

### 4.2 Development Environment Verification

- [ ] `npm run dev` starts without errors on port 3000
- [ ] Home page loads (public route)
- [ ] Login/Register pages accessible
- [ ] Protected routes redirect to login when unauthenticated

### 4.3 Code Quality Verification

- [ ] `npm run format` passes
- [ ] `npm run type-check` shows no errors
- [ ] `npm run lint:strict` shows zero warnings
- [ ] `npm run verify:rules` shows no policy violations

### 4.4 Testing Verification

- [ ] Unit tests run successfully: `npm run test:browser`
- [ ] Port 3000 is free before running tests

### 4.5 Project Understanding Verification

- [ ] Can explain Server Actions pattern
- [ ] Can explain DAL pattern and when to use it
- [ ] Can explain environment variable access rules
- [ ] Can explain Zod validation patterns
- [ ] Knows where to add new environment variables (`app-config.ts`)

---

## 5. Quick Reference Commands

### Installation & Dev

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
```

### Pre-PR Checklist (Run ALL before opening PR)

```bash
npm run format
npm run type-check
npm run lint:strict
npm run verify:rules
```

### Database Commands

```bash
npm run db:generate       # Generate migrations
npm run db:push          # Apply schema to DB
npm run db:migrate        # Run migrations
npm run db:seed          # Seed test data
npm run db:studio        # Visual DB editor
```

### Testing

```bash
npm run test             # All tests (E2E then unit)
npm run test:browser     # Vitest unit tests only
npm run test:ui          # Playwright E2E tests only
```

---

## 6. Key File Locations

### Authentication

- `lib/auth.ts` - `auth()` server-side session helper
- `lib/auth-options.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth API route

### Data Access

- `dal/user.dal.ts` - User CRUD operations
- `dal/transaction.dal.ts` - Transaction operations
- `dal/wallet.dal.ts` - Wallet/bank account operations

### Server Actions

- `actions/register.ts` - User registration
- `actions/transaction.actions.ts` - Transaction CRUD
- `actions/wallet.actions.ts` - Bank account management
- `actions/dwolla.actions.ts` - ACH transfer operations

### Configuration

- `app-config.ts` - Typed environment configuration
- `lib/env.ts` - Environment helpers (backward compat)
- `database/schema.ts` - Drizzle ORM schema

### Validation & Policies

- `scripts/verify-rules.ts` - Repository policy enforcement
- `eslint.config.mts` - ESLint configuration
- `.prettierrc.ts` - Prettier formatting rules

---

## 7. Skills Available

The following specialized skills provide detailed workflows:

| Skill | Purpose | When to Load |
| --- | --- | --- |
| `server-action-skill` | Server Action patterns | Implementing mutations |
| `dal-skill` | Drizzle ORM & DAL patterns | DB operations |
| `auth-skill` | NextAuth v4 patterns | Auth implementation |
| `plaid-skill` | Plaid API integration | Bank linking |
| `dwolla-skill` | Dwolla ACH integration | Fund transfers |
| `testing-skill` | Vitest & Playwright patterns | Writing tests |
| `ui-skill` | shadcn/ui components | Building UI |
| `validation-skill` | Zod schema patterns | Input validation |
| `security-skill` | Encryption & secrets | Security-sensitive code |

---

## 8. Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Windows PowerShell
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

**TypeScript errors after pull:**

```bash
npm run type-check    # Find the errors
```

**ESLint warnings:**

```bash
npm run lint:strict   # See all warnings
npm run lint:fix      # Auto-fix safe issues
```

**Database connection issues:**

```bash
npm run db:check      # Verify DB connection
```

**Test failures:**

```bash
npm run test:browser  # Run unit tests first
npm run test:ui       # Run E2E tests (requires DB)
```

---

## 9. Next Steps After Initialization

1. **Explore the codebase** - Navigate through `app/`, `actions/`, `dal/` directories
2. **Run the app** - Start dev server and explore features
3. **Read existing tests** - Understand testing patterns in `tests/unit/`
4. **Make a small change** - Practice the Server Actions pattern
5. **Run validation** - Ensure `npm run format && npm run type-check && npm run lint:strict` pass

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-04-24  
**Source:** Derived from AGENTS.md, architecture.md, tech-stack.md, and codebase analysis
