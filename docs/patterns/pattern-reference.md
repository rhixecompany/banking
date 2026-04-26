# Banking Codebase Pattern Reference

This document provides a comprehensive reference for naming conventions, code patterns, and style patterns used throughout the Banking application codebase.

---

## 1. Naming Conventions

### 1.1 File Names

| Category | Convention | Example |
| --- | --- | --- |
| Server Actions | kebab-case | `auth.signin.ts`, `register.ts`, `wallet.actions.ts` |
| DAL | kebab-case + `.dal.ts` | `user.dal.ts`, `wallet.dal.ts` |
| Components (UI) | PascalCase | `DashboardClientWrapper.tsx`, `WalletsOverview.tsx` |
| Server Wrappers | PascalCase + `ServerWrapper` | `dashboard-server-wrapper.tsx` |
| Client Wrappers | PascalCase + `ClientWrapper` | `dashboard-client-wrapper.tsx` |
| Types | kebab-case | `user.ts`, `wallet.ts`, `transaction.ts` |
| Page Files | `page.tsx` | `dashboard/page.tsx` |
| Layout Files | `layout.tsx` | `(root)/layout.tsx` |
| API Routes | `route.ts` | `api/auth/[...nextauth]/route.ts` |

### 1.2 Functions & Variables

| Category | Convention | Example |
| --- | --- | --- |
| Server Actions | camelCase | `signin()`, `registerUser()`, `disconnectWallet()` |
| DAL Classes | PascalCase | `class UserDal`, `class WalletDal` |
| DAL Instances | camelCase | `userDal`, `walletsDal` |
| Helper Functions | camelCase | `findByEmail()`, `findById()` |
| Constants | SCREAMING_SNAKE_CASE | `ALGORITHM = "aes-256-gcm"` |
| Interfaces | PascalCase | `UserWithProfile`, `WalletWithDetails` |
| Props Interfaces | PascalCase + `Props` | `DashboardClientWrapperProps` |

### 1.3 Database Schema

| Category | Convention | Example |
| --- | --- | --- |
| Table Names | snake_case plural | `users`, `wallets`, `transactions` |
| Column Names | snake_case | `created_at`, `updated_at`, `deleted_at` |
| Enum Names | snake_case | `user_role`, `transaction_status` |

### 1.4 Imports & Aliases

| Alias          | Resolution                 | Usage             |
| -------------- | -------------------------- | ----------------- |
| `@/`           | `/root/banking`            | Root imports      |
| `@/components` | `/root/banking/components` | Component imports |
| `@/lib`        | `/root/banking/lib`        | Library imports   |
| `@/dal`        | `/root/banking/dal`        | Data access layer |
| `@/actions`    | `/root/banking/actions`    | Server actions    |
| `@/types`      | `/root/banking/types`      | Type definitions  |

---

## 2. Code Patterns

### 2.1 Server Actions

**Pattern**: All mutations must be Server Actions with `"use server"` directive.

```typescript
// File: actions/auth.signin.ts
"use server";

import bcrypt from "bcrypt";
import { z } from "zod";

import { userDal } from "@/dal/user.dal";

const SignInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8)
});

export default async function signin(payload: unknown) {
  const parsed = SignInSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { email, password } = parsed.data;
  const user = await userDal.findByEmail(email);

  if (!user) {
    return { error: "Invalid credentials", ok: false };
  }

  if (!user.isActive) {
    return { error: "Account disabled", ok: false };
  }

  const ok = await bcrypt.compare(password, user.password ?? "");
  if (!ok) {
    return { error: "Invalid credentials", ok: false };
  }

  return { ok: true };
}
```

**Key Patterns**:

1. `"use server"` directive at line 1
2. Zod validation with `.safeParse()` first
3. Returns consistent `{ ok: boolean, error?: string }` shape
4. Uses DAL for all database access
5. Auth check via `auth()` for protected actions

**Reference Files**:

- `actions/register.ts` - User registration with password hashing
- `actions/auth.signin.ts` - Authentication flow

---

### 2.2 Data Access Layer (DAL)

**Pattern**: Class-based DAL with methods for each operation.

```typescript
// File: dal/user.dal.ts
export class UserDal {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));
    return result[0] || null;
  }

  async create(data: NewUser): Promise<User> {
    const [created] = await db.insert(users).values(data).returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<User>
  ): Promise<User | null> {
    const [updated] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();
    return !!result[0];
  }
}
```

**Key Patterns**:

1. Class-based: `class UserDal` extends base DAL functionality
2. Method naming: `findBy*`, `create`, `update`, `delete`, `count`
3. Always filter `deletedAt: null` for soft-delete
4. Use Drizzle operators: `eq()`, `and()`, `or()`, `isNull()`, `isNotNull()`
5. Return single result or null: `result[0] || null`

**Reference Files**:

- `dal/user.dal.ts` - User data access
- `dal/transaction.dal.ts` - Transaction data access with eager loading

---

### 2.3 Database Schema (Drizzle ORM)

**Pattern**: Define tables with Drizzle pgTable, add soft-delete columns.

```typescript
// File: database/schema.ts
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  decimal,
  pgEnum
} from "drizzle-orm/pg_core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "cancelled"
]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at")
});

// Transactions Table
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  walletId: uuid("wallet_id")
    .references(() => wallets.id)
    .notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status")
    .default("pending")
    .notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at")
});
```

**Key Patterns**:

1. Use `pgTable` for table definition
2. Use `pgEnum` for enumerated types
3. Always include: `id` (UUID), `createdAt`, `updatedAt`, `deletedAt`
4. Foreign keys: `.references(() => table.column)`
5. Default values: `.default(value)` or `.defaultRandom()` for UUIDs

**Reference Files**:

- `database/schema.ts` - Full schema definition

---

### 2.4 Validation (Zod Schemas)

**Pattern**: Zod schemas with meta descriptions for forms.

```typescript
// File: lib/validations/auth.ts
import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .meta({ description: "Email address" }),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .meta({ description: "Password" }),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100)
    .meta({ description: "First name" }),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100)
    .meta({ description: "Last name" }),
  address1: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Street address" })
});

export type SignUpInput = z.infer<typeof signUpSchema>;
```

**Key Patterns**:

1. Use `.meta({ description: "..." })` for field descriptions
2. Chain validators: `.string().trim().email().max(100)`
3. Custom error messages: `.min(8, "Custom error message")`
4. Export inferred type: `z.infer<typeof schemaName>`
5. Optional fields: `.optional()` before validators

**Reference Files**:

- `lib/validations/auth.ts` - Authentication validation
- `lib/schemas/auth.schema.ts` - Additional schemas

---

### 2.5 Utilities

**Pattern**: Common utility functions for styling and formatting.

```typescript
// File: lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format amount as currency
 */
export function formatAmount(
  amount: number | string,
  currency = "USD"
): string {
  const num =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(num);
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  });
}
```

**Key Patterns**:

1. `cn()` utility uses clsx + tailwind-merge for class conflicts
2. Format helpers for consistent display
3. Date handling with `toLocaleDateString()`

**Reference Files**:

- `lib/utils.ts` - Utility functions

---

### 2.6 Authentication (NextAuth v4)

**Pattern**: Session-based auth with custom user properties.

```typescript
// File: lib/auth.ts
import {
  type DefaultSession,
  getServerSession,
  type Session
} from "next-auth";
import { authOptions } from "@/lib/auth-options";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      isActive: boolean;
    } & DefaultSession["user"];
  }
}

export function auth(): Promise<null | Session> {
  return getServerSession(authOptions);
}
```

**Key Patterns**:

1. Extend `next-auth` Session type for custom properties
2. Use `getServerSession(authOptions)` for server-side auth
3. Custom properties: `id`, `isAdmin`, `isActive`

**Reference Files**:

- `lib/auth.ts` - Auth helper
- `lib/auth-options.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - API route

---

### 2.7 Server & Client Wrappers

**Pattern**: Separate server and client concerns in page wrappers.

```typescript
// File: components/dashboard/dashboard-server-wrapper.tsx
import { auth } from "@/lib/auth";
import { userDal } from "@/dal";
import { redirect } from "next/navigation";

export default async function DashboardServerWrapper() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await userDal.findById(session.user.id);

  if (!user) {
    redirect("/signin");
  }

  const accounts = await getAccounts();
  const wallets = await userDal.findWalletsById(session.user.id);
  const transactions = await getTransactionsByUserId(session.user.id);

  return (
    <DashboardClientWrapper
      accounts={accounts}
      wallets={wallets}
      transactions={transactions}
      userId={session.user.id}
      userName={user.name}
      showOnboarding={!user.hasCompletedOnboarding}
    />
  );
}
```

```typescript
// File: components/dashboard/dashboard-client-wrapper.tsx
"use client";

interface DashboardClientWrapperProps {
  accounts: Account[];
  wallets: Wallet[];
  transactions: Transaction[];
  userId: string;
  userName: string;
  showOnboarding: boolean;
}

export function DashboardClientWrapper({
  accounts,
  wallets,
  transactions,
  userId,
  userName,
  showOnboarding,
}: DashboardClientWrapperProps): JSX.Element {
  // Client-side state and interactions
  return <div>{/* UI components */}</div>;
}
```

**Key Patterns**:

1. Server wrapper fetches data, checks auth, redirects if needed
2. Client wrapper marked with `"use client"`
3. Props passed from server to client
4. Client handles interactivity (state, effects)

**Reference Files**:

- `components/dashboard/dashboard-server-wrapper.tsx`
- `components/dashboard/dashboard-client-wrapper.tsx`

---

### 2.8 Error Handling

**Pattern**: Consistent error return shape in Server Actions.

```typescript
// In Server Actions
export async function someAction(input: unknown) {
  try {
    // Operation that might fail
    const result = await databaseOperation();
    return { ok: true, result };
  } catch (error) {
    // Check for specific error codes
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return { ok: false, error: "Duplicate entry" };
    }
    return { ok: false, error: "Operation failed" };
  }
}
```

**Key Patterns**:

1. Try-catch for operations that might throw
2. Check specific error codes for known conditions
3. Return `{ ok: false, error: "message" }` on failure
4. Never expose internal error details to client

**Reference Files**:

- `actions/register.ts` - Registration with duplicate check
- `dal/*.dal.ts` - DAL operations

---

## 3. Component Patterns

### 3.1 UI Components (shadcn/ui)

**Pattern**: Use shadcn/ui primitives from `@/components/ui/*`.

| Component | Location                   | Usage              |
| --------- | -------------------------- | ------------------ |
| Button    | `components/ui/button.tsx` | Action buttons     |
| Input     | `components/ui/input.tsx`  | Form inputs        |
| Card      | `components/ui/card.tsx`   | Content containers |
| Dialog    | `components/ui/dialog.tsx` | Modal dialogs      |
| Select    | `components/ui/select.tsx` | Dropdowns          |
| Table     | `components/ui/table.tsx`  | Data tables        |

### 3.2 Shared Components

**Pattern**: Reusable components in `components/shared/*`.

| Component              | Purpose                |
| ---------------------- | ---------------------- |
| `wallets-overview.tsx` | Wallet summary display |
| `bank-card.tsx`        | Linked bank card       |
| `transaction-list.tsx` | Transaction items      |

### 3.3 Layout Components

**Pattern**: Layout components in `components/layouts/*`.

| Component     | Purpose            |
| ------------- | ------------------ |
| `sidebar.tsx` | Navigation sidebar |
| `header.tsx`  | Page header        |
| `footer.tsx`  | Page footer        |

---

## 4. Directory Structure

```text
/root/banking
├── actions/                    # Server Actions
│   ├── auth.signin.ts
│   ├── register.ts
│   └── wallet.actions.ts
├── app/                       # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   ├── (root)/              # Protected routes
│   ├── (admin)/             # Admin routes
│   └── api/                 # API routes
│       └── auth/[...nextauth]/
├── components/               # React components
│   ├── dashboard/           # Dashboard components
│   ├── layouts/             # Layout components
│   ├── shared/              # Shared components
│   └── ui/                  # shadcn/ui components
├── dal/                      # Data Access Layer
│   ├── user.dal.ts
│   ├── wallet.dal.ts
│   └── transaction.dal.ts
├── database/                  # Drizzle schema
│   ├── schema.ts
│   └── db.ts
├── lib/                      # Libraries
│   ├── auth.ts
│   ├── auth-options.ts
│   ├── utils.ts
│   └── validations/          # Zod schemas
├── types/                    # Type definitions
│   ├── user.ts
│   ├── wallet.ts
│   └── transaction.ts
└── stores/                  # Client state (Zustand)
    ├── ui-store.tsx
    └── transfer-store.tsx
```

---

## 5. Testing Patterns

### 5.1 Unit Tests (Vitest)

**Location**: `tests/unit/*.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "vitest";

describe("UserDal", () => {
  beforeEach(() => {
    // Reset mock state
  });

  it("should find user by email", async () => {
    const user = await userDal.findByEmail("test@example.com");
    expect(user).toBeDefined();
  });
});
```

### 5.2 E2E Tests (Playwright)

**Location**: `tests/e2e/*.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign in with valid credentials", async ({ page }) => {
    await page.goto("/signin");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });
});
```

---

## 6. Build & Development Commands

### 6.1 Core Commands

| Command               | Purpose                     |
| --------------------- | --------------------------- |
| `npm run dev`         | Start development server    |
| `npm run build`       | Build for production        |
| `npm run start`       | Start production server     |
| `npm run lint`        | Run ESLint                  |
| `npm run lint:strict` | Run ESLint with strict mode |

### 6.2 Database Commands

| Command               | Purpose                    |
| --------------------- | -------------------------- |
| `npm run db:generate` | Generate Drizzle migration |
| `npm run db:migrate`  | Run migrations             |
| `npm run db:push`     | Push schema to database    |
| `npm run db:seed`     | Seed database              |

### 6.3 Testing Commands

| Command                | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run test`         | Run all tests              |
| `npm run test:ui`      | Run E2E tests (Playwright) |
| `npm run test:browser` | Run unit tests (Vitest)    |

---

## 7. Quick Reference

### 7.1 Return Shapes

| Function Type | Return Shape                      |
| ------------- | --------------------------------- |
| Server Action | `{ ok: boolean; error?: string }` |
| Query Action  | `{ data?: T; error?: string }`    |
| Auth Check    | Redirects or returns Session      |

### 7.2 Common Patterns

| Pattern | Example |
| --- | --- |
| Auth check | `const session = await auth(); if (!session) redirect("/signin");` |
| Soft delete | `isNull(users.deletedAt)` in queries |
| Create with return | `const [created] = await db.insert(...).returning()` |
| Filter by user | `eq(transactions.userId, session.user.id)` |

---

## 8. References

- **AGENTS.md** - Master instruction set
- **architecture.md** - System architecture
- **tech-stack.md** - Technology versions
- **coding-standards.md** - Code style rules
- **exemplars.md** - Code examples
