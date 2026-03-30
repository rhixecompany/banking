# Banking Agent Standards

<!-- markdownlint-disable MD013 -->

> **Tech Stack:** Next.js 16 (App Router), TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth v4, shadcn/UI, Tailwind CSS v4, Zod, Vitest + Playwright
>
> **React Compiler:** Enabled in next.config.ts (`reactCompiler: true`) **Last Updated:** 2026-03-30

<!-- markdownlint-enable MD013 -->

---

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack Overview](#tech-stack-overview)
3. [Critical PR-Blocking Rules](#critical-pr-blocking-rules)
4. [Command Reference](#command-reference)
5. [Code Style Guidelines](#code-style-guidelines)
6. [Project Structure](#project-structure)
7. [Server Actions Pattern](#server-actions-pattern)
8. [DAL Pattern](#dal-pattern)
9. [Environment Validation](#environment-validation)
10. [Component Patterns](#component-patterns)
11. [Cursor Rules Summary](#cursor-rules-summary)
12. [Opencode Skills Summary](#opencode-skills-summary)
13. [Testing Guidelines](#testing-guidelines)
14. [Security Best Practices](#security-best-practices)
15. [Troubleshooting](#troubleshooting)
16. [External References](#external-references)

---

## Introduction

This file serves as the canonical reference for all AI agents (GitHub Copilot, Cursor, Opencode, and others) contributing to the Banking project. It contains:

- **Critical rules** that must be followed (PR-blocking)
- **Commands** for development, testing, and validation
- **Code patterns** for consistent implementation
- **Agent-specific rules** from Cursor and Opencode configurations

### Purpose

The Banking project requires strict adherence to type safety, query efficiency, and architectural patterns. This document ensures all agents understand:

1. What rules are non-negotiable (PR-blocking)
2. How to execute common tasks (commands)
3. How to implement features correctly (patterns)
4. What tools and configurations are available (agent rules)

### How to Use This Document

This document is designed to be a comprehensive reference for AI agents working on the Banking project. Here's how different agents should use it:

#### For GitHub Copilot

- Reference the **Critical PR-Blocking Rules** section before making any code changes
- Use the **Command Reference** for running validation checks
- Follow **Code Style Guidelines** when generating code
- Check **Server Actions Pattern** and **DAL Pattern** for database operations

#### For Cursor

- All rules are automatically applied via `.cursor/rules/` configuration
- Use this document for understanding the underlying patterns
- Reference **Cursor Rules Summary** for agent-specific configurations

#### For Opencode

- Skills are loaded from `.opencode/` directory
- Use **Opencode Skills Summary** for pattern references
- Check **Server Actions Pattern** for mutation workflows

### Document Organization

The document is organized from foundational concepts to advanced patterns:

1. **Foundation** (Sections 1-4): Rules, commands, and style that apply to all code
2. **Architecture** (Sections 5-7): Project structure and core patterns
3. **Implementation** (Sections 8-10): Specific implementation guides
4. **Agent Integration** (Sections 11-12): Agent-specific configurations
5. **Quality Assurance** (Sections 13-16): Testing, security, and troubleshooting

### Contributing to This Document

When adding new patterns or updating existing ones:

1. Include GOOD/BAD code examples
2. Explain the "why" behind each rule
3. Provide external references for deeper learning
4. Keep examples practical and production-ready
5. Update the Table of Contents if adding new sections

### Who Should Read This

- **GitHub Copilot** - For code generation and completion
- **Cursor** - For AI-assisted editing with project rules
- **Opencode** - For interactive CLI tasks
- **Developers** - For understanding project conventions

---

## Tech Stack Overview

| Layer       | Technology   | Version           |
| ----------- | ------------ | ----------------- |
| Framework   | Next.js      | 16.x (App Router) |
| Language    | TypeScript   | strict mode       |
| ORM         | Drizzle      | latest            |
| Database    | PostgreSQL   | latest            |
| Auth        | NextAuth     | v4                |
| UI          | shadcn/UI    | latest            |
| Styling     | Tailwind CSS | v4                |
| Validation  | Zod          | latest            |
| Testing     | Vitest       | latest            |
| E2E Testing | Playwright   | latest            |
| Encryption  | AES-256-GCM  | -                 |

### Key Characteristics

- **Server Components by default** - Use `'use client'` only when needed
- **DAL Pattern** - All database access through `lib/dal/`
- **Server Actions** - All mutations via Server Actions, never API routes
- **React Compiler enabled** - `reactCompiler: true` in next.config.ts
- **Cache Components** - Next.js 16 caching features enabled

---

## Critical PR-Blocking Rules

> ⚠️ **These rules MUST pass before any PR can be merged.**

The following rules are enforced automatically and will block PRs if violated:

| # | Rule | Requirement | Enforcement |
| --- | --- | --- | --- |
| 1 | No `any` types | Use `unknown` + type guards | TypeScript strict |
| 2 | No N+1 queries | Always eager load / JOIN | Code review |
| 3 | No raw `process.env` | Use `lib/env.ts` | ESLint + TypeScript |
| 4 | Mutations via Server Actions | Never API routes for mutations | Code review |
| 5 | Zero TypeScript errors | Pass `npm run type-check` | CI check |
| 6 | Zero lint warnings | Pass `npm run lint:strict` | CI check |
| 7 | All tests pass | Pass `npm run test` | CI check |

### Rule 1: No `any` Types

**Why:** The `any` type defeats TypeScript's type safety, leading to runtime errors.

```typescript
// ❌ BAD - Using any
function parseInput(input: any) {
  return input.value; // No type safety!
}

// ✅ GOOD - Using unknown with type guard
type HasValue = { value: string };

function hasValue(input: unknown): input is HasValue {
  return (
    typeof input === "object" &&
    input !== null &&
    "value" in input &&
    typeof (input as HasValue).value === "string"
  );
}

export function parseInput(input: unknown): string {
  if (!hasValue(input)) return "";
  return input.value;
}
```

**External Reference:** [TypeScript strict mode](https://www.typescriptlang.org/tsconfig#strict)

### Rule 2: No N+1 Queries

**Why:** N+1 queries cause severe performance degradation as data grows.

```typescript
// ❌ BAD - N+1 pattern
const users = await userDal.findAll();
for (const user of users) {
  user.accounts = await accountDal.findByUserId(user.id);
}

// ✅ GOOD - Eager loading with JOIN
const usersWithAccounts = await userDal.findAllWithAccounts();
```

**External Reference:** [Drizzle Relations](https://orm.drizzle.team/docs/rrelations)

### Rule 3: No Raw `process.env`

**Why:** Raw environment access bypasses validation and type safety.

```typescript
// ❌ BAD - Raw process.env
const apiKey = process.env.API_KEY; // No validation!

// ✅ GOOD - Using lib/env.ts
import { env } from "@/lib/env";
const apiKey = env.API_KEY; // Zod validated at startup!
```

**See Also:** [Environment Validation](#environment-validation)

### Rule 4: Mutations via Server Actions

**Why:** Server Actions provide type safety, automatic revalidation, and simpler code.

```typescript
// ❌ BAD - Mutation in API route
export async function POST(req: Request) {
  // mutation logic
}

// ✅ GOOD - Server Action
("use server");

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = UserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  await userDal.create(parsed.data);
  revalidatePath("/users");
  return { ok: true };
}
```

**See Also:** [Server Actions Pattern](#server-actions-pattern)

### Rules 5-7: Validation Commands

These are enforced via CI:

```bash
# Must pass all before PR can merge
npm run type-check   # Zero TypeScript errors
npm run lint:strict # Zero lint warnings
npm run test        # All tests pass
```

---

## Command Reference

### Development Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build           # Production build
npm run start           # Start production server
npm run clean           # Clean build artifacts
```

### Validation Commands (Required Before Commit)

```bash
npm run validate        # Run all checks (format + type-check + lint + test)
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without fixing
npm run lint           # ESLint with compact output
npm run lint:fix       # ESLint with auto-fix
npm run lint:strict    # Strict ESLint (blocks PR at 0 warnings)
npm run type-check     # TypeScript type checking
```

### Database Commands

```bash
npm run db:studio      # Drizzle Studio (GUI)
npm run db:push        # Push schema changes to DB
npm run db:migrate     # Run migrations
npm run db:generate   # Generate migrations
npm run db:check      # Drizzle migration/schema check
npm run db:seed       # Seed database with test data
npm run db:reset      # Drop, generate, push (full reset)
```

### Testing Commands

```bash
npm run test           # All tests (Vitest + Playwright)
npm run test:browser   # Vitest unit/integration tests only
npm run test:ui        # Playwright E2E tests only
```

### Single Test Execution

```bash
# Vitest (unit/integration tests)
npm run vitest run tests/unit/register.test.ts --config=vitest.config.ts

# Or use npx directly
npx vitest run tests/unit/auth.test.ts

# Playwright (E2E tests)
npm run playwright test tests/e2e/sign-in.spec.ts

# Or with options
npx playwright test tests/e2e/auth.spec.ts --project=chromium
```

### Generation & Validation Scripts

```bash
# Banking validation scripts
npm run banking:validate    # Run all validation checks
npm run banking:generate   # Generate documentation

# Code generation
npm run generate:dal       # Generate DAL files
npm run generate:action    # Generate Server Action files
npm run generate:component # Generate React components
npm run generate:feature  # Generate feature scaffolding

# Data export
npm run export:data       # Export banking data
```

### Registry Commands

```bash
npm run registry:generate   # Generate registry
npm run registry:validate   # Validate registry
npm run registry:build      # Build registry (generate + export)
```

### Cleanup Commands

```bash
npm run clean           # Clean .next, build, dist, coverage
npm run clean:all       # Clean everything including node_modules
npm run clean:cache    # Clean caches only
```

---

## Code Style Guidelines

### Import Order

Imports must be organized in the following order (use `import-x/order` or manual grouping):

```typescript
// 1. React/core
import * as React from "react";

// 2. Next.js
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// 3. Third-party
import { z } from "zod";
import { clsx } from "clsx";
import { eq } from "drizzle-orm";

// 4. Internal - DAL
import { userDal } from "@/lib/dal";
import { db } from "@/database/db";

// 5. Internal - Actions
import { createUser } from "@/lib/actions/user.actions";

// 6. Internal - Components
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/user-card";
```

**Rationale:** This order ensures dependencies are loaded in the correct sequence and makes imports scannable.

### Naming Conventions

| Type             | Convention             | Example          |
| ---------------- | ---------------------- | ---------------- |
| Files            | kebab-case             | `user-dal.ts`    |
| Classes          | PascalCase             | `UserDal`        |
| Functions        | camelCase              | `findById`       |
| Variables        | camelCase              | `currentUser`    |
| Constants        | UPPER_SNAKE            | `MAX_RETRY`      |
| Types/Interfaces | PascalCase             | `UserProfile`    |
| DAL instances    | camelCase              | `userDal`        |
| Server Actions   | camelCase              | `disconnectBank` |
| Components       | PascalCase             | `UserCard`       |
| Hooks            | camelCase (use prefix) | `useUser`        |

### TypeScript Strict Rules

The project uses strict TypeScript configuration. Key rules:

```typescript
// ❌ NEVER use any
const value: any = getData();

// ✅ Use unknown with narrowing
const value: unknown = getData();
if (typeof value === "string") {
  // value is narrowed to string here
}

// ✅ Use type guards for objects
interface User {
  id: string;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj
  );
}

// ✅ Explicit return types for exported functions
export function getUser(id: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}
```

### ESLint Rules Summary

Key ESLint rules enforced in `eslint.config.mts`:

```typescript
// Must pass
"no-console": "warn",           // Console.log allowed
"prefer-const": "error",        // Use const when not reassigned
"security/detect-non-literal-fs-filename": "error", // FS security
"@typescript-eslint/no-explicit-any": "off", // Project handles differently

// Scripts folder has relaxed rules
// See: eslint.config.mts "scripts/**/*.ts" override
```

### Prettier Formatting

```bash
# Format all files
npm run format

# Check without fixing
npm run format:check
```

Key Prettier settings (from `.prettierrc.ts`):

- Semi-colons: Yes
- Single quotes: Yes
- Tab width: 2
- Trailing commas: All

---

## Project Structure

```
banking/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth routes (sign-in, sign-up)
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                # Protected routes
│   │   ├── dashboard/
│   │   ├── settings/
│   │   └── transaction-history/
│   ├── api/                   # API routes (minimal use)
│   │   └── auth/[...nextauth]/
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
│
├── components/               # React components
│   ├── ui/                   # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── forms/                # Form components
│   └── shared/               # Shared components
│
├── lib/                      # Core utilities
│   ├── actions/              # Server Actions
│   │   ├── bank.actions.ts
│   │   ├── user.actions.ts
│   │   └── ...
│   ├── dal/                  # Data Access Layer
│   │   ├── user.dal.ts
│   │   ├── bank.dal.ts
│   │   ├── base.dal.ts
│   │   └── index.ts
│   ├── auth.ts               # auth() helper
│   ├── env.ts                # Zod env validation
│   ├── encryption.ts         # AES-256-GCM
│   └── utils.ts              # General utilities
│
├── database/                 # Database configuration
│   ├── db.ts                 # DB connection
│   └── schema.ts             # Drizzle schema
│
├── tests/                    # Test files
│   ├── unit/                 # Vitest tests
│   │   └── ...
│   ├── e2e/                  # Playwright tests
│   │   ├── auth.spec.ts
│   │   ├── bank-linking.spec.ts
│   │   └── ...
│   └── fixtures/             # Test fixtures
│       └── auth.ts
│
├── scripts/                  # Build/utility scripts
│   ├── generate/             # Code generators
│   │   ├── dal.ts
│   │   ├── action.ts
│   │   ├── component.ts
│   │   └── feature.ts
│   ├── validate/             # Validators
│   │   ├── schema.ts
│   │   ├── env.ts
│   │   ├── types.ts
│   │   └── actions.ts
│   ├── seed/                 # Database seeding
│   └── utils/               # Script utilities
│
├── public/                   # Static assets
│   └── icons/
│
├── .cursor/                  # Cursor rules
│   └── rules/
│       ├── banking-coding-standards.mdc
│       ├── no-n-plus-one-queries.mdc
│       └── ...
│
├── .opencode/                # Opencode skills
│   ├── skills/
│   │   ├── server-action-skill/
│   │   ├── dal-skill/
│   │   └── ...
│   └── SKILL.md
│
├── package.json
├── tsconfig.json
├── eslint.config.mts
├── drizzle.config.ts
├── next.config.ts
└── AGENTS.md
```

### Directory Purposes

| Directory        | Purpose                              |
| ---------------- | ------------------------------------ |
| `app/`           | Next.js App Router pages and layouts |
| `components/ui/` | shadcn/UI component library          |
| `lib/actions/`   | Server Actions for mutations         |
| `lib/dal/`       | Data Access Layer - all DB queries   |
| `lib/auth.ts`    | NextAuth session helper              |
| `lib/env.ts`     | Zod-validated environment variables  |
| `database/`      | Drizzle configuration and schema     |
| `tests/unit/`    | Vitest unit/integration tests        |
| `tests/e2e/`     | Playwright E2E tests                 |
| `scripts/`       | Build and utility scripts            |

---

## Server Actions Pattern

Server Actions are the primary way to handle mutations in this project. All database writes must go through Server Actions.

### Basic Structure

```typescript
// lib/actions/user.actions.ts
"use server";

import { z } from "zod";
import { userDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// 1. Define input schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

// 2. Export action with typed input
export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  // 3. Auth check
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // 4. Input validation
  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // 5. Mutation
  try {
    await userDal.create(parsed.data);
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Failed to create user" };
  }
}
```

### Error Handling

Always return a consistent shape:

```typescript
type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

// ✅ Consistent return shape
export async function action(input: unknown): Promise<ActionResult> {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  try {
    const result = await doSomething(parsed.data);
    return { ok: true, data: result };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error"
    };
  }
}
```

### Revalidation Strategies

```typescript
import { revalidatePath, revalidateTag } from "next/cache";

// Revalidate a specific path
revalidatePath("/dashboard");
revalidatePath("/users/[id]", "page");

// Revalidate by tag (if using unstable_cache)
revalidateTag("users");
```

### Using in Components

```typescript
// ✅ Client component calling Server Action
"use client";

import { createUser } from "@/lib/actions/user.actions";
import { useTransition } from "react";

export function CreateUserForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createUser(Object.fromEntries(formData));
      if (!result.ok) {
        alert(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

### Zod Validation Patterns

```typescript
// String validations
z.string().min(1); // Required
z.string().max(100); // Max length
z.string().email(); // Email format
z.string().url(); // URL format
z.enum(["a", "b", "c"]); // Enum

// Number validations
z.number().min(0); // Min value
z.number().max(100); // Max value
z.number().int(); // Integer only

// Object validations
z.object({
  name: z.string().min(1),
  email: z.string().email()
});

// Optional fields
z.object({
  name: z.string().optional()
});

// With default
z.object({
  role: z.string().default("user")
});

// Arrays
z.array(z.string()).min(1); // Non-empty array

// Complex validations
z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
  roles: z.array(z.enum(["user", "admin"])).min(1),
  metadata: z.record(z.string(), z.unknown()).optional()
});

// Transform input
z.string().transform(val => val.trim());

// Coerce types
z.coerce.string(); // Convert to string
z.coerce.number(); // Convert to number
z.coerce.boolean(); // Convert to boolean
z.coerce.date(); // Convert to Date
```

### Advanced Server Action Patterns

#### With Optimistic Updates

```typescript
"use server";

import { revalidatePath } from "next/cache";

const UpdateNameSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100)
});

export async function updateUserName(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = UpdateNameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    await userDal.update(parsed.data.id, { name: parsed.data.name });
    revalidatePath(`/users/${parsed.data.id}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Failed to update user name" };
  }
}
```

#### With Transaction

```typescript
"use server";

import { db } from "@/database/db";
import { users, accounts } from "@/database/schema";
import { eq, asc } from "drizzle-orm";

const CreateAccountSchema = z.object({
  userId: z.string().uuid(),
  accountName: z.string().min(1).max(100),
  initialBalance: z.number().min(0)
});

export async function createUserWithAccount(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const parsed = CreateAccountSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    const result = await db.transaction(async tx => {
      const [user] = await tx
        .insert(users)
        .values({
          id: parsed.data.userId,
          name: parsed.data.accountName
        })
        .returning();

      await tx.insert(accounts).values({
        userId: user.id,
        balance: parsed.data.initialBalance,
        name: parsed.data.accountName
      });

      return user;
    });

    revalidatePath("/dashboard");
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: "Failed to create account" };
  }
}
```

#### With Authorization Checks

```typescript
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";

const DeleteUserSchema = z.object({
  userId: z.string().uuid()
});

export async function deleteUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // Only admins can delete users
  if (session.user.role !== "admin") {
    return { ok: false, error: "Forbidden: Admin access required" };
  }

  const parsed = DeleteUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // Cannot delete yourself
  if (parsed.data.userId === session.user.id) {
    return { ok: false, error: "Cannot delete your own account" };
  }

  try {
    await userDal.delete(parsed.data.userId);
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Failed to delete user" };
  }
}
```

**External Reference:** [Zod Documentation](https://zod.dev/)

---

## DAL Pattern

All database access must go through the Data Access Layer (DAL) in `lib/dal/`.

### File Structure

```typescript
// lib/dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { BaseDal } from "./base.dal";

export class UserDal extends BaseDal<typeof users> {
  constructor() {
    super(users);
  }

  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async findWithAccounts(userId: string) {
    // Use JOIN to avoid N+1
    return db
      .select()
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(eq(users.id, userId));
  }
}

export const userDal = new UserDal();
```

### Base DAL

```typescript
// lib/dal/base.dal.ts
import { PgTable } from "drizzle-orm/pg-core";

export class BaseDal<TTable extends PgTable> {
  constructor(protected table: TTable) {}

  async findAll() {
    return db.select().from(this.table);
  }

  async findById(id: string) {
    return db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);
  }

  async create(data: unknown) {
    return db
      .insert(this.table)
      .values(data as any)
      .returning();
  }

  async update(id: string, data: unknown) {
    return db
      .update(this.table)
      .set(data as any)
      .where(eq(this.table.id, id))
      .returning();
  }

  async delete(id: string) {
    return db.delete(this.table).where(eq(this.table.id, id));
  }
}
```

### N+1 Prevention

**The most critical DAL rule: NEVER query inside loops.**

```typescript
// ❌ BAD - N+1 query pattern
const users = await userDal.findAll();
for (const user of users) {
  const accounts = await accountDal.findByUserId(user.id);
  user.accounts = accounts;
}

// ✅ GOOD - Single query with JOIN
const usersWithAccounts = await db
  .select({
    user: users,
    account: accounts
  })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));

// ✅ GOOD - Eager loading method
const usersWithAccounts = await userDal.findAllWithAccounts();
```

### Relationships and JOINs

```typescript
// One-to-Many with leftJoin
const usersWithAccounts = await db
  .select({
    id: users.id,
    email: users.email,
    accounts: accounts
  })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));

// Many-to-Many through junction table
const usersWithRoles = await db
  .select({
    user: users,
    role: roles
  })
  .from(users)
  .leftJoin(userRoles, eq(users.id, userRoles.userId))
  .leftJoin(roles, eq(userRoles.roleId, roles.id));
```

### Transactions

```typescript
import { db } from "@/database/db";

await db.transaction(async (tx) => {
  await tx.insert(users).values({ ... });
  await tx.insert(accounts).values({ ... });
});
```

**External Reference:** [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

## Environment Validation

All environment variables must be accessed through `lib/env.ts`, not directly via `process.env`.

### Why lib/env.ts?

1. **Validation at startup** - Invalid env vars cause immediate, clear failures
2. **Type safety** - Full TypeScript support
3. **Documentation** - Self-documenting config
4. **No runtime errors** - Fail fast, not slowly

### Usage

```typescript
// lib/env.ts (DO NOT access directly)
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  PLAID_CLIENT_ID: z.string().min(1),
  PLAID_SECRET: z.string().min(1)
});

// Validates at import time
export const env = envSchema.parse(process.env);
```

```typescript
// ❌ BAD - Direct process.env access
const secret = process.env.NEXTAUTH_SECRET;

// ✅ GOOD - Through lib/env.ts
import { env } from "@/lib/env";
const secret = env.NEXTAUTH_SECRET;
```

### Required Environment Variables

See `lib/env.ts` for the complete list. Key variables:

```bash
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Plaid (Bank Linking)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox

# Dwolla (Payments)
DWOLLA_KEY=...
DWOLLA_SECRET=...
DWOLLA_ENV=sandbox
```

---

## Component Patterns

### Server vs Client Components

**Server Components (default):**

- Run on the server
- Can directly access databases
- Cannot use hooks or browser APIs
- Use `'use client'` only when needed

```typescript
// ✅ Server Component (default)
import { userDal } from "@/lib/dal";

export default async function Dashboard() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user.name}</div>;
}
```

**Client Components:**

- Use `'use client'` at the top
- Can use hooks (useState, useEffect, etc.)
- Can use browser APIs
- Communicate with Server Actions

```typescript
// ✅ Client Component
"use client";

import { useState } from "react";
import { createUser } from "@/lib/actions/user.actions";

export function UserForm() {
  const [loading, setLoading] = useState(false);

  return <form>...</form>;
}
```

### When to Use Client Components

Use a Client Component when you need:

- `useState`, `useEffect`, or other hooks
- `onClick`, `onChange` event handlers
- Browser-only APIs (window, document)
- Third-party components using hooks

### Suspense Boundaries

Wrap async content in Suspense to prevent blocking:

```typescript
import { Suspense } from "react";
import { UserListSkeleton } from "./skeletons";

export default function Page() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserList />
    </Suspense>
  );
}
```

### Using Server Actions in Client Components

```typescript
"use client";

import { createUser } from "@/lib/actions/user.actions";
import { useTransition } from "react";

export function CreateButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await createUser({ name: "John" });
      if (!result.ok) {
        console.error(result.error);
      }
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Saving..." : "Create"}
    </button>
  );
}
```

---

## Cursor Rules Summary

The `.cursor/rules/` directory contains 12 rule files that Cursor uses:

| File                               | Purpose                     |
| ---------------------------------- | --------------------------- |
| `banking-coding-standards.mdc`     | Core coding standards       |
| `no-n-plus-one-queries.mdc`        | Query efficiency rules      |
| `mutations-via-server-actions.mdc` | Server Action patterns      |
| `env-access-via-lib-env.mdc`       | Environment variable access |
| `typescript-no-any.mdc`            | TypeScript strict typing    |
| `project-documentation-style.mdc`  | Documentation standards     |
| `project-testing-validation.mdc`   | Testing requirements        |
| `project-workflow-process.mdc`     | Workflow guidelines         |
| `project-coding-standards.mdc`     | General coding standards    |
| `plan-file-standards.mdc`          | Planning documentation      |
| `workflow-and-steps.mdc`           | Step-based workflows        |
| `kill-port-3000-before-tests.mdc`  | Test setup                  |

### Key Cursor Rule: banking-coding-standards.mdc

```markdown
- Never use `any`; use `unknown` with narrowing or type guards.
- Never read `process.env` directly in app code; use `lib/env.ts`.
- Implement all data mutations through Server Actions, not API routes.
- Avoid N+1 queries; use eager loading for related data.
- Keep TypeScript strict-safe and prefer explicit return types.
```

### Key Cursor Rule: no-n-plus-one-queries.mdc

```markdown
- Avoid N+1 query patterns.
- Prefer eager loading for related entities.
- Fetch all required relationship data in as few queries as possible.
```

### Key Cursor Rule: mutations-via-server-actions.mdc

```markdown
- Implement write operations in Server Actions.
- Do not place mutation logic in API routes.
- Validate input and return a consistent `{ ok, error? }` shape.
```

**All Cursor rules are enforced with `alwaysApply: true`.**

---

## Opencode Skills Summary

The `.opencode/` directory contains skills and prompts:

### Main Skills

| Skill                  | Purpose                    |
| ---------------------- | -------------------------- |
| `server-action-skill/` | Server Action patterns     |
| `dal-skill/`           | Data Access Layer patterns |
| `ui-skill/`            | shadcn/UI component usage  |
| `db-skill/`            | Database operations        |
| `auth-skill/`          | Authentication patterns    |
| `testing-skill/`       | Testing patterns           |
| `validation-skill/`    | Input validation           |
| `security-skill/`      | Security best practices    |
| `deployment-skill/`    | Deployment guides          |
| `plaid-skill/`         | Plaid bank integration     |
| `dwolla-skill/`        | Dwolla payment integration |

### SKILL.md Overview

The main `SKILL.md` provides:

1. **Suspense patterns** - Handle async auth in Next.js 16
2. **Server Action patterns** - Zod validation, error handling, revalidation
3. **DAL patterns** - N+1 prevention, JOINs, transactions

### Quick Reference

```typescript
// Server Action pattern from skills
export async function action(
  data: Input
): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }
  // ... action logic
  return { ok: true };
}

// DAL pattern from skills
const result = await db
  .select({ user: users, profile: user_profiles })
  .from(users)
  .leftJoin(user_profiles, eq(users.id, user_profiles.userId));
```

---

## Testing Guidelines

### Vitest (Unit/Integration)

```bash
# Run all Vitest tests
npm run test:browser

# Run specific test file
npx vitest run tests/unit/auth.test.ts

# Run with coverage
npx vitest run --coverage
```

### Playwright (E2E)

```bash
# Run all E2E tests
npm run test:ui

# Run specific test
npx playwright test tests/e2e/auth.spec.ts

# Run with UI
npx playwright test --ui

# Codegen new tests
npm run test:ui:codegen
```

### Test File Organization

```
tests/
├── unit/                    # Vitest tests
│   ├── register.test.ts
│   ├── auth.test.ts
│   └── ...
├── e2e/                    # Playwright tests
│   ├── auth.spec.ts
│   ├── bank-linking.spec.ts
│   ├── pages.spec.ts
│   └── ...
└── fixtures/               # Test fixtures
    └── auth.ts             # Playwright auth fixtures
```

### Writing Unit Tests with Vitest

```typescript
// tests/unit/user-dal.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { userDal } from "@/lib/dal";
import { db } from "@/database/db";

describe("UserDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return user when email exists", async () => {
      const mockUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User"
      };

      // Mock the database query
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockUser])
          })
        })
      } as any);

      const result = await userDal.findByEmail("test@example.com");
      expect(result).toEqual([mockUser]);
    });

    it("should return empty array when email not found", async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([])
          })
        })
      } as any);

      const result = await userDal.findByEmail(
        "notfound@example.com"
      );
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create user with valid data", async () => {
      const newUser = {
        email: "new@example.com",
        name: "New User"
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi
            .fn()
            .mockResolvedValue([{ id: "456", ...newUser }])
        })
      } as any);

      const result = await userDal.create(newUser);
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe(newUser.email);
    });
  });
});
```

### Writing E2E Tests with Playwright

```typescript
// tests/e2e/bank-linking.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Bank Linking", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test("should redirect unauthenticated users to sign-in", async ({
    page
  }) => {
    await page.goto("/my-banks");
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("should show sign-in form when accessing bank linking without auth", async ({
    page
  }) => {
    await page.goto("/my-banks");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("should show error toast for invalid credentials", async ({
    page
  }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Wait for error toast
    await expect(page.getByText("Invalid credentials")).toBeVisible({
      timeout: 10000
    });
  });
});
```

### Test Fixtures

```typescript
// tests/fixtures/auth.ts
import {
  test as base,
  type Page,
  type Locator
} from "@playwright/test";

interface AuthFixtures {
  authenticatedPage: Page;
  unauthenticatedPage: Page;
}

async function signInWithSeedUser(page: Page): Promise<void> {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("user@seed.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(/\/dashboard/);
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await signInWithSeedUser(page);
    await use(page);
  },

  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  }
});

export { expect } from "@playwright/test";
```

### Testing Server Actions

```typescript
// tests/unit/server-actions.test.ts
import { describe, it, expect, vi } from "vitest";
import { createUser } from "@/lib/actions/user.actions";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: "123", email: "admin@test.com", role: "admin" }
  })
}));

vi.mock("@/lib/dal", () => ({
  userDal: {
    create: vi.fn().mockResolvedValue({ id: "456" })
  }
}));

describe("createUser Server Action", () => {
  it("should create user with valid input", async () => {
    const input = {
      email: "newuser@test.com",
      name: "New User"
    };

    const result = await createUser(input);
    expect(result.ok).toBe(true);
  });

  it("should return error for invalid email", async () => {
    const input = {
      email: "invalid-email",
      name: "New User"
    };

    const result = await createUser(input);
    expect(result.ok).toBe(false);
    expect(result.error).toContain("email");
  });

  it("should return error for unauthenticated user", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const input = {
      email: "newuser@test.com",
      name: "New User"
    };

    const result = await createUser(input);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });
});
```

### Best Practices for Testing

1. **Use meaningful test descriptions**

   ```typescript
   // ❌ BAD
   it("test1", () => { ... });

   // ✅ GOOD
   it("should return user when email exists in database", () => { ... });
   ```

2. **Test edge cases and error paths**

   ```typescript
   // Always test happy path AND error cases
   it("should throw error when database is unavailable", async () => {
     vi.mocked(db.select).mockRejectedValueOnce(
       new Error("DB connection failed")
     );
     await expect(userDal.findAll()).rejects.toThrow(
       "DB connection failed"
     );
   });
   ```

3. **Use data-testid for reliable selectors**

   ```typescript
   // ✅ GOOD - stable selectors
   <button data-testid="submit-form">Submit</button>
   await page.getByTestId("submit-form").click();

   // ❌ BAD - fragile selectors
   await page.locator("form > div:nth-child(2) > button").click();
   ```

4. **Clean up after tests**

   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
     vi.resetAllMocks();
   });
   ```

5. **Use realistic test data**

   ```typescript
   // ✅ GOOD - realistic data
   const validUser = {
     email: "john.doe@example.com",
     name: "John Doe"
   };

   // ❌ BAD - unrealistic test data
   const validUser = {
     email: "a@b.c",
     name: "a"
   };
   ```

### Writing Tests

```typescript
// Vitest example
import { describe, it, expect } from "vitest";

describe("User", () => {
  it("should create user with valid data", () => {
    // Test logic
    expect(true).toBe(true);
  });
});
```

```typescript
// Playwright example
import { test, expect } from "@playwright/test";

test("should sign in successfully", async ({ page }) => {
  await page.goto("/sign-in");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
});
```

### Test Fixtures

```typescript
// tests/fixtures/auth.ts
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await signInWithSeedUser(page);
    await use(page);
  },
  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  }
});
```

---

## Security Best Practices

### Environment Variables

```typescript
// ✅ Always use lib/env.ts
import { env } from "@/lib/env";
const apiKey = env.API_KEY;

// ❌ Never use process.env directly
const apiKey = process.env.API_KEY;
```

### Input Validation

```typescript
// ✅ Always validate with Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const parsed = schema.safeParse(input);
if (!parsed.success) {
  return { ok: false, error: "Invalid input" };
}
```

### Authentication

```typescript
// ✅ Always check auth in Server Actions
export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  // Continue with action
}
```

### Authorization

```typescript
// ✅ Check permissions before operations
export async function adminOnlyAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  if (session.user.role !== "admin") {
    return { ok: false, error: "Forbidden: Admin access required" };
  }

  // Continue with admin operation
}
```

### Database Queries

```typescript
// ✅ Use parameterized queries (Drizzle does this automatically)
await db.select().from(users).where(eq(users.id, id));

// ✅ Always use parameterized values, never string concatenation
// ❌ BAD - SQL injection vulnerable
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ GOOD - Using Drizzle's query builder
const query = db.select().from(users).where(eq(users.id, userId));
```

### Sensitive Data

```typescript
// ✅ Never log sensitive data
console.log(user.password); // ❌ BAD
console.log({ userId: user.id }); // ✅ GOOD

// ✅ Hash passwords before storage
import { hash, verify } from "@/lib/encryption";
const hashedPassword = await hash(password);

// ✅ Mask sensitive data in responses
function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 4) return "****";
  return (
    "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4)
  );
}
```

### API Security

```typescript
// ✅ Validate content types
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return new Response("Invalid content type", { status: 415 });
  }
  // Process request
}

// ✅ Implement rate limiting considerations
// Use middleware or external services like Upstash for rate limiting
```

### CSRF Protection

```typescript
// ✅ Server Actions include built-in CSRF protection
// No additional implementation needed for Server Actions

// ❌ Don't implement mutations in API routes without CSRF tokens
```

### File Upload Security

```typescript
// ✅ Validate file types and sizes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateFile(file: File): { ok: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: "File too large" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Invalid file type" };
  }
  return { ok: true };
}
```

### Input Validation

```typescript
// ✅ Always validate with Zod
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const parsed = schema.safeParse(input);
if (!parsed.success) {
  return { ok: false, error: "Invalid input" };
}
```

### Authentication

```typescript
// ✅ Always check auth in Server Actions
export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  // Continue with action
}
```

### Database Queries

```typescript
// ✅ Use parameterized queries (Drizzle does this automatically)
await db.select().from(users).where(eq(users.id, id));
```

### Sensitive Data

```typescript
// ✅ Never log sensitive data
console.log(user.password); // ❌ BAD
console.log({ userId: user.id }); // ✅ GOOD

// ✅ Hash passwords before storage
import { hash, verify } from "@/lib/encryption";
const hashedPassword = await hash(password);
```

---

## Troubleshooting

### Build Errors

**Error: "Module not found"**

```bash
# Clear cache and reinstall
npm run clean
npm install
```

**Error: "Type error: Cannot find module"**

```bash
# Check TypeScript
npm run type-check
```

**Error: Prerender failed**

```bash
# Run debug build
npm run build:debug
```

**Error: "Route uses Date.now() inside Client Component without Suspense"**

```typescript
// This is a Next.js 16 Cache Components issue
// Solution: Wrap in Suspense or use 'use cache' directive

// Option 1: Wrap in Suspense
<Suspense fallback={<Loading />}>
  <ClientComponentWithDate />
</Suspense>

// Option 2: Add generateStaticParams for dynamic routes
export function generateStaticParams() {
  return [];
}
```

**Error: "cacheComponents and dynamic export are incompatible"**

```typescript
// In Next.js 16 with Cache Components:
// Remove 'export const dynamic = "force-dynamic"'
// Use generateStaticParams instead for dynamic pages:

export function generateStaticParams() {
  return [];
}
```

### Test Failures

**Error: "Port 3000 already in use"**

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use the kill script:
./scripts/kill-port-3000.sh
```

**Error: "Database not seeded"**

```bash
# Seed the database
npm run db:seed
```

**Error: E2E tests timeout**

```bash
# Increase timeout in playwright.config.ts
timeout: 30000,
```

**Error: "Test timed out"**

```typescript
// Increase timeout in test
test(
  "should complete",
  async ({ page }) => {
    // test logic
  },
  { timeout: 30000 }
);
```

**Error: "Element not found"**

```typescript
// Wait for element to be visible
await page.waitForSelector('[data-testid="element"]');
await expect(page.locator('[data-testid="element"]')).toBeVisible();
```

### Lint Errors

**Error: "Too many warnings"**

```bash
# Fix automatically
npm run lint:fix

# Then check strict
npm run lint:strict
```

**Error: "prefer-const"**

```bash
# Fix automatically
npm run lint:fix
```

**Error: "security/detect-non-literal-fs-filename"**

```typescript
// This is expected in scripts folder
// The ESLint config already handles this with an override for scripts/

// If it fails elsewhere, use path.join() for dynamic paths:
const filePath = path.join(process.cwd(), userInput);
```

**Error: "noInlineConfig has no effect"**

```typescript
// ESLint config has noInlineConfig: true
// Inline eslint-disable comments won't work
// Use config file overrides instead:

// In eslint.config.mts:
{
  files: ["scripts/**/*.ts"],
  rules: {
    "security/detect-non-literal-fs-filename": "off",
  },
}
```

### TypeScript Errors

**Error: "Object is possibly null"**

```typescript
// Use optional chaining
const name = user?.name;

// Or type narrowing
if (user !== null && user !== undefined) {
  const name = user.name;
}

// Or use non-null assertion (use sparingly)
const name = user!.name;
```

**Error: "Argument of type 'string' is not assignable"**

```typescript
// Check the expected type
// If expecting string | undefined, ensure type matches
const value: string | undefined = getValue();
```

**Error: "Type 'any' is not assignable to type 'unknown'"**

```typescript
// Never use 'any', use 'unknown' instead
// ❌ BAD
const value: any = getData();

// ✅ GOOD
const value: unknown = getData();
if (typeof value === "string") {
  // narrow the type
}
```

**Error: "Cannot find module '@/lib/..."**

```typescript
// Check tsconfig.json paths configuration
// Ensure @ alias is configured:

// tsconfig.json:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Database Errors

**Error: "relation does not exist"**

```bash
# Push schema to database
npm run db:push

# Or migrate
npm run db:migrate
```

**Error: "database does not exist"**

```bash
# Create database in PostgreSQL
# Then run migrations
psql -U postgres -c "CREATE DATABASE banking;"
npm run db:push
```

**Error: "connection refused"**

```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
pg_isready -h localhost -p 5432
```

### Authentication Errors

**Error: "NextAuth not configured"**

```typescript
// Check auth options in lib/auth-options.ts
// Ensure providers are configured:

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ]
};
```

**Error: "JWT secret not defined"**

```bash
# Add NEXTAUTH_SECRET to .env.local
NEXTAUTH_SECRET=your-secret-at-least-32-characters-long
```

### Runtime Errors

**Error: "Hydration failed"**

```typescript
// This happens when server and client content differ
// Solution: Use suppressHydrationWarning or ensure consistent rendering

// Option 1: Add suppressHydrationWarning
<div suppressHydrationWarning>{content}</div>

// Option 2: Use useEffect for client-only rendering
"use client";
import { useState, useEffect } from "react";

export function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}
```

**Error: "Too many re-renders"**

```typescript
// Usually caused by state updates in render
// Move to useEffect or event handlers

// ❌ BAD
return <button onClick={setCount(count + 1)}>Click</button>

// ✅ GOOD
return <button onClick={() => setCount(count + 1)}>Click</button>
```

**Error: "Context not found"**

```typescript
// Ensure provider wraps the component
// Check component hierarchy
// In layout.tsx:

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Error: "Type error: Cannot find module"**

```bash
# Check TypeScript
npm run type-check
```

**Error: Prerender failed**

```bash
# Run debug build
npm run build:debug
```

### Test Failures

**Error: "Port 3000 already in use"**

```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use the kill script:
./scripts/kill-port-3000.sh
```

**Error: "Database not seeded"**

```bash
# Seed the database
npm run db:seed
```

**Error: E2E tests timeout**

```bash
# Increase timeout in playwright.config.ts
timeout: 30000,
```

### Lint Errors

**Error: "Too many warnings"**

```bash
# Fix automatically
npm run lint:fix

# Then check strict
npm run lint:strict
```

**Error: "prefer-const"**

```bash
# Fix automatically
npm run lint:fix
```

### TypeScript Errors

**Error: "Object is possibly null"**

```typescript
// Use optional chaining
const name = user?.name;

// Or type narrowing
if (user !== null && user !== undefined) {
  const name = user.name;
}
```

**Error: "Argument of type 'string' is not assignable"**

```typescript
// Check the expected type
// If expecting string | undefined, ensure type matches
const value: string | undefined = getValue();
```

---

## External References

### Next.js

- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Suspense](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

### TypeScript

- [Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

### Drizzle ORM

- [Getting Started](https://orm.drizzle.team/docs/quick-start)
- [Queries](https://orm.drizzle.team/docs/select)
- [Relations](https://orm.drizzle.team/docs/rrelations)
- [Transactions](https://orm.drizzle.team/docs/transactions)

### NextAuth

- [Configuration](https://next-auth.js.org/configuration/options)
- [Providers](https://next-auth.js.org/providers/)
- [Callbacks](https://next-auth.js.org/configuration/callbacks)

### Zod

- [Documentation](https://zod.dev/)
- [Schemas](https://zod.dev/?id=schemas)
- [Coercion](https://zod.dev/?id=coercion)

### Testing

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

### Security

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/security/)

---

## Pre-Commit Checklist

Before submitting a PR, ensure all of these pass:

```bash
# Run the full validation suite
npm run validate
```

This executes in order:

1. `format:check` - Code formatting
2. `type-check` - TypeScript errors
3. `lint:strict` - ESLint (0 warnings)
4. `test` - All tests pass

---

## Related Files

For detailed information on specific topics, see:

| Topic | Location |
| --- | --- |
| Database Schema | `database/schema.ts` |
| Environment Variables | `lib/env.ts` |
| Deployment Guide | `README.md` |
| Coding Standards | `.cursor/rules/banking-coding-standards.mdc` |
| N+1 Prevention | `.cursor/rules/no-n-plus-one-queries.mdc` |
| Server Actions | `.cursor/rules/mutations-via-server-actions.mdc` |
| Env Validation | `.cursor/rules/env-access-via-lib-env.mdc` |
| TypeScript Rules | `.cursor/rules/typescript-no-any.mdc` |

---

**End of AGENTS.md** — For workspace rules, see [`.cursor/rules/`](.cursor/rules/) and [`.opencode/`](.opencode/)
