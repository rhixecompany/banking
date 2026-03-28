# Agent Coding Standards - Banking App

## Project Overview

This is a Next.js 16.2.1 banking application built with TypeScript, Tailwind CSS v4, Drizzle ORM, and NextAuth. The application integrates with Plaid for bank account linking and transaction synchronization, and Dwolla for account-to-account transfers.

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth v4 with Drizzle adapter
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **External Integrations**: Plaid (banking), Dwolla (transfers)

### Key Application Flows

1. **User Registration & Authentication**: Users can sign up with email/password or use OAuth (GitHub, Google)
2. **Bank Account Linking**: Users link external bank accounts via Plaid integration
3. **Transaction Management**: View, track, and manage transactions across linked accounts
4. **Payment Transfers**: Send/receive money between accounts via Dwolla
5. **Admin Functions**: Admin users can manage other users (toggle admin status, activate/deactivate)

---

## Personas

The banking app follows a structured development approach with four distinct personas. Each persona has specific responsibilities and focus areas that guide their work.

### Architect Persona

The Architect focuses on high-level system design decisions and tradeoffs. This role is responsible for ensuring the overall system remains scalable, maintainable, and performant. Key responsibilities include designing the data flow from Server to DAL to Client, creating database schema designs with proper indexes and composite keys, and establishing scalability patterns such as batch processing, caching, and lazy loading. The Architect should reference documentation sections 3, 6, 22, and 24 for detailed guidance on system design patterns specific to this project.

When making architectural decisions, the Architect must consider:

- The separation between Server Components and Client Components
- The Data Access Layer (DAL) pattern and its proper implementation
- Caching strategies and when to use them
- Database indexing strategies for optimal query performance
- Integration patterns for external services (Plaid, Dwolla)

### Implementer Persona

The Implementer is responsible for writing the actual code that brings features to life. This role follows strict patterns to ensure consistency across the codebase. The primary directive is to use Server Components by default and only add 'use client' when interactivity is absolutely necessary. All data reads must go through the DAL pattern using BaseDal<T> classes with .with() for eager loading relations to avoid N+1 query problems. All mutations must use Server Actions following the pattern: auth() → validate → DAL → revalidate. Important note: React Compiler is ON in this project, so never use useMemo, useCallback, or memo() as they are unnecessary and add unnecessary complexity.

The Implementer should reference documentation sections 7-9, 14, and 23 for detailed implementation patterns.

Key implementation patterns include:

- Using 'use client' directive only for components that need interactivity (forms, buttons, event handlers)
- Always awaiting searchParams and params in Server Components (they are Promise types in Next.js 16)
- Using revalidatePath() or revalidateTag() after mutations to refresh cached data
- Encrypting sensitive data (bank access tokens) before storing in the database
- Using Zod for input validation in Server Actions

### Reviewer Persona

The Reviewer is responsible for ensuring code quality and catching issues before they reach production. This role performs thorough reviews of all changes, checking for type safety (never use 'any', use unknown plus type guards for external data), N+1 queries (must use .with() or single JOIN, never loop+query), proper authentication in Server Actions (auth() must be the first call), Tailwind v4 syntax compliance, and zero TypeScript errors.

The Reviewer must verify:

- All tests pass with 100% success
- npm run type-check produces zero errors
- npm run lint:strict produces zero warnings
- npm run format:check passes
- DAL queries properly use eager loading instead of N+1 patterns
- Server Actions follow the auth() → validate → DAL → revalidate pattern

Reference documentation sections 14, 17, 18, and 25 for detailed review criteria.

### Debugger Persona

The Debugger is responsible for investigating and resolving issues in the application. This role follows a systematic approach to problem-solving. When debugging an issue, the Debugger should first reproduce the issue with a minimal test case to understand the exact conditions causing the problem. Next, check the console and Next.js MCP for runtime errors to identify any error messages or stack traces. Then verify the auth state by calling auth() in Server Components to ensure proper authentication. Additionally, check DAL queries using Drizzle Studio (npm run db:studio) to inspect database state and verify that queries are working as expected. Finally, verify environment variables using the Zod validation in lib/env.ts to ensure all required configuration is present.

Reference documentation sections 5, 20, and 25 for detailed debugging procedures.

---

## Build/Lint/Test Commands

This section provides comprehensive documentation of all available commands for building, testing, and maintaining the application. These commands are essential for development workflows and must be run before committing changes.

### Development Commands

```bash
# Start the development server on port 3000
npm run dev

# Build the application for production
npm run build

# Start the production server (after building)
npm run start

# Run full validation (format, type-check, lint, test)
npm run validate
```

The development server supports hot-reloading and provides detailed error messages during development. The build command performs full TypeScript checking, optimization, and prepares the application for production deployment. Always run npm run build before deploying to ensure there are no compilation errors.

### Database Commands (Drizzle ORM)

```bash
# Open Drizzle Studio for database visualization and management
npm run db:studio

# Push schema changes to the database
npm run db:push

# Run database migrations
npm run db:migrate

# Generate migration files from schema changes
npm run db:generate

# Check schema consistency against the database
npm run db:check
```

Drizzle Studio provides a web interface (typically at http://localhost:5433) for exploring the database, running queries, and managing data. This is particularly useful for debugging DAL queries and verifying database state. The db:push command is used during development to quickly sync schema changes, while db:migrate should be used in production environments for safe schema evolution.

### Linting and Formatting Commands

```bash
# Run ESLint to find code issues
npm run lint

# Fix auto-fixable ESLint issues
npm run lint:fix

# Run ESLint with zero warnings allowed (required before commits)
npm run lint:strict

# Format code with Prettier
npm run format

# Check code formatting without modifying files
npm run format:check
```

The lint:strict command is particularly important as it enforces zero warnings, which is a requirement before any code can be committed. Always run this command and resolve all warnings before creating a commit. The format command uses Prettier to ensure consistent code style across the codebase.

### Type Checking Commands

```bash
# Run TypeScript compiler to check for type errors
npm run type-check

# Generate Next.js types
npm run type-gen
```

The type-check command uses TypeScript's strict mode to ensure type safety throughout the codebase. This is a required check before any commit. The type-gen command generates additional types that Next.js needs for certain features.

### Testing Commands

```bash
# Run all tests (browser + E2E)
npm run test

# Run Vitest unit/integration tests
npm run test:browser

# Run Playwright E2E tests
npm run test:ui
```

Testing is a critical part of the development process. All tests must pass with 100% success before code can be merged. The test suite uses Vitest for fast unit and integration tests, and Playwright for comprehensive end-to-end testing that verifies user flows.

### Running Single Test Files

When working on specific features, you may need to run individual test files rather than the entire test suite. Use the following commands for single test execution:

```bash
# Run a single Vitest test file
npm exec vitest run path/to/test.test.ts --config=vitest.config.ts

# Run a single Playwright test file
npm exec playwright test path/to/spec.spec.ts
```

For example, to run the registration test:

```bash
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts
```

To run the admin actions test:

```bash
npm exec vitest run tests/unit/admin.actions.test.ts --config=vitest.config.ts
```

To run a specific Playwright test:

```bash
npm exec playwright test tests/e2e/sign-in.spec.ts
```

---

## Code Style Guidelines

This section provides detailed guidelines for writing consistent, maintainable code in the banking application. Following these guidelines ensures that all code in the project maintains a consistent style and follows best practices.

### General Guidelines

The project uses TypeScript with strict mode enabled in tsconfig.json. This enforces rigorous type checking throughout the codebase and helps catch errors at compile time rather than runtime. All TypeScript guidelines must be followed strictly.

**Never use the 'any' type** - This is one of the most important rules in the codebase. Using 'any' defeats the purpose of TypeScript's type system and can lead to runtime errors. Instead, use explicit types when the type is known, or use 'unknown' plus type guards when handling external or uncertain data. For example, when parsing user input or handling API responses, use type guards to narrow the type safely.

**Never use raw process.env** - Environment variables should never be accessed directly via process.env as this bypasses type checking and validation. Instead, always use the typed env utility from @/lib/env. This module provides Zod-based validation at startup and ensures all required environment variables are present and correctly formatted.

**Use npm for dependency management** - This project uses npm exclusively for managing dependencies. Do not use yarn or pnpm as they may result in inconsistent dependency resolution.

**Use the @/ alias for all imports** - All imports should use the @/ alias which maps to the project root. This ensures consistent import paths and makes refactoring easier. For example, import from @/lib/dal instead of relative paths like ../../lib/dal.

### Naming Conventions

Consistent naming conventions make the codebase easier to read and navigate. The following conventions must be followed:

| Type          | Convention       | Example                   |
| ------------- | ---------------- | ------------------------- |
| Components    | PascalCase       | BankCard.tsx, AuthForm    |
| Hooks/Utils   | camelCase        | useAuth(), formatAmount() |
| Constants     | UPPER_SNAKE_CASE | TEST_USER_ID, MAX_RETRY   |
| Files/folders | kebab-case       | my-banks/, total-balance  |
| CSS classes   | kebab-case       | text-16, bank-card        |

Component files should use PascalCase and typically have a .tsx extension. Hook files should use camelCase and start with "use" prefix. Constants should use all uppercase with underscores separating words. Files and folders should use kebab-case (lowercase with hyphens).

### File Structure

The project follows a clear file structure that separates concerns and makes it easy to find code:

```
app/              # Next.js App Router (routes, layouts, API)
components/       # Reusable UI components
components/ui/    # shadcn/ui primitive components
lib/              # Server actions, DAL, utils, integrations
database/         # Drizzle ORM schema and configuration
tests/            # Unit (Vitest), E2E (Playwright) tests
types/            # TypeScript type definitions
constants/        # Application constants
```

The app/ directory contains all Next.js App Router files including pages, layouts, and route handlers. The components/ directory contains reusable UI components, with components/ui/ specifically for shadcn/ui primitives. The lib/ directory contains business logic including server actions, DAL classes, utility functions, and external service integrations. The database/ directory contains the Drizzle schema definition and database configuration. The tests/ directory contains both unit tests (Vitest) and end-to-end tests (Playwright).

### Imports Order

Imports should be organized in a specific order to make it easy to understand the dependencies of each file:

1. React/Next.js imports (from 'react', 'next', etc.)
2. External library imports (from installed packages)
3. Internal module imports (from @/lib, @/components)

All imports must use the @/ alias as specified in tsconfig.json. Group imports by category and use blank lines between groups. Sort imports alphabetically within each group.

Example:

```typescript
import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerUser } from "@/lib/actions/register";
import { userDal } from "@/lib/dal";
import { cn } from "@/lib/utils";
```

---

## Server Components and Actions

This section provides detailed guidance on working with Next.js Server Components and Server Actions, which are the primary building blocks of this application.

### Server Components

Server Components are the default in this project. Use Server Components for:

- Fetching data from the database
- Rendering static content
- Accessing backend resources directly
- Keeping sensitive logic server-side

Server Components execute only on the server, reducing the JavaScript bundle sent to the client and improving performance. They can directly import and use DAL classes, call Server Actions, and access environment variables.

**Example of a Server Component:**

```typescript
// app/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { bankDal } from '@/lib/dal';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const banks = await bankDal.findByUserId(session.user.id);

  return (
    <div>
      <h1>Your Banks</h1>
      {/* Render banks */}
    </div>
  );
}
```

### Client Components

Add 'use client' directive only when the component needs:

- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, useRef, etc.)
- Browser-only APIs
- Interactivity (modals, dropdowns, forms)

**Example of a Client Component:**

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/lib/actions/register';
import { toast } from 'sonner';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    const result = await registerUser(data);

    if (!result.ok) {
      toast.error(result.error);
    } else {
      toast.success('Registration successful');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Register'}
      </Button>
    </form>
  );
}
```

### Server Actions

Server Actions are used for all mutations (create, update, delete operations). They provide a type-safe way to handle form submissions and data modifications. The standard pattern for Server Actions is:

1. Call auth() to verify the user is authenticated
2. Validate input using Zod schema
3. Perform the operation using the DAL
4. Call revalidatePath() or revalidateTag() to refresh cached data
5. Return a result object with ok and optional error fields

**Example Server Action:**

```typescript
"use server";

import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DisconnectBankSchema = z.object({
  bankId: z.string().min(1)
});

export async function disconnectBank(input: unknown) {
  // Step 1: Authenticate
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  // Step 2: Validate input
  const parsed = DisconnectBankSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  // Step 3: Perform operation via DAL
  try {
    await bankDal.delete(parsed.data.bankId);

    // Step 4: Revalidate affected paths
    revalidatePath("/dashboard");
    revalidatePath("/my-banks");

    return { ok: true };
  } catch (error) {
    // Step 5: Return error result
    console.error("Disconnect bank error:", error);
    return { ok: false, error: "Failed to disconnect bank" };
  }
}
```

### Handling searchParams and params

In Next.js 16, searchParams and params are Promise types. Always await them in Server Components:

```typescript
// For dynamic routes like app/users/[id]/page.tsx
export default async function UserPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const userId = params.id;
  // Use userId...
}

// For pages with searchParams like app/search/page.tsx
export default async function SearchPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const page = parseInt(searchParams.page || "1", 10);
  // Use query and page...
}
```

---

## Data Access Layer (DAL)

The DAL pattern is central to this application's data handling. All database reads must go through DAL classes to ensure consistent query patterns, proper error handling, and centralized logic for concerns like encryption.

### DAL Structure

The DAL is located in lib/dal/ and contains class-based implementations for each major entity:

- lib/dal/user.dal.ts - User and profile operations
- lib/dal/bank.dal.ts - Bank account operations
- lib/dal/transaction.dal.ts - Transaction operations
- lib/dal/base.dal.ts - Common utility functions

Each DAL class follows a consistent pattern with methods for common operations:

```typescript
// lib/dal/user.dal.ts
export class UserDal {
  async findByEmail(email: string) {
    /* ... */
  }
  async findById(id: string) {
    /* ... */
  }
  async findByIdWithProfile(id: string) {
    /* ... */
  }
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }) {
    /* ... */
  }
  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    /* ... */
  }
  async delete(id: string) {
    /* ... */
  }
}

export const userDal = new UserDal();
```

### Using DAL in Server Components

Always use the exported instance (e.g., userDal) rather than instantiating the class directly:

```typescript
import { userDal } from '@/lib/dal';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  // Use the DAL instance
  const user = await userDal.findByIdWithProfile(session.user.id);

  if (!user) notFound();

  return <Profile user={user} />;
}
```

### Eager Loading Relations

To avoid N+1 query problems, always use eager loading when fetching related data. The DAL classes provide methods that handle this:

```typescript
// Instead of this (N+1 problem):
const users = await userDal.findAll();
for (const user of users) {
  const profile = await profileDal.findByUserId(user.id); // N+1 queries!
}

// Use this (eager loading):
const user = await userDal.findByIdWithProfile(userId); // Single query with JOIN
```

### Encrypting Sensitive Data

The DAL layer handles encryption of sensitive data before storage and decryption on read. This is particularly important for bank access tokens:

```typescript
// lib/dal/bank.dal.ts
import { encrypt, decrypt } from "@/lib/encryption";

export class BankDal {
  async createBank(data: {
    userId: string;
    accessToken: string; // Plain text token from Plaid
    // ...
  }) {
    // Encrypt before storing
    const encryptedData = {
      ...data,
      accessToken: encrypt(data.accessToken)
    };

    const [bank] = await db
      .insert(banks)
      .values(encryptedData)
      .returning();

    // Return with decrypted token for immediate use
    bank.accessToken = data.accessToken;
    return bank;
  }

  async findById(id: string) {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.id, id));

    if (bank) {
      // Decrypt on read
      bank.accessToken = decrypt(bank.accessToken);
    }

    return bank;
  }
}
```

---

## Component Patterns

This section outlines the patterns used for creating and organizing components in the application.

### Component Organization

Components are organized in the components/ directory with the following structure:

- components/ui/ - shadcn/ui primitive components
- components/\*.tsx - Feature-specific components

### Using shadcn/ui Components

The application uses shadcn/ui for base UI components. These are located in components/ui/ and should be used as building blocks for custom components:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
```

### Forms with React Hook Form

Forms should use React Hook Form with Zod validation for type-safe form handling:

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '@/lib/actions/register';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await registerUser(data);
    if (!result.ok) {
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* More fields */}
      </form>
    </Form>
  );
}
```

### Using forwardRef for Components with Refs

When creating components that need to expose a ref (like input components), use React.forwardRef:

```typescript
import { forwardRef } from 'react';

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && <span className="error">{error}</span>}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
```

---

## CSS and Tailwind

The application uses Tailwind CSS v4 for styling. This section covers the specific patterns and utilities used.

### Tailwind CSS v4 Features

Tailwind CSS v4 introduces new features that should be used:

- Linear gradients: bg-linear-to-br, bg-linear-to-r, etc.
- Aspect ratios: aspect-2/3, aspect-video, aspect-square
- Container queries (when needed)
- Advanced color palettes

### Using the cn() Utility

The cn() utility (located in lib/utils.ts) combines clsx and tailwind-merge for conditional class handling:

```typescript
import { cn } from '@/lib/utils';

<button
  className={cn(
    'base-classes',
    isActive && 'active-classes',
    variant === 'primary' ? 'primary-classes' : 'secondary-classes'
  )}
/>
```

### Custom Color Variables

The application defines custom colors in the Tailwind configuration. Use these consistently:

- text-black-1, text-black-2, etc. for black variations
- bg-bank-gradient for the primary brand gradient
- text-gray-600, text-gray-900 for gray text
- bg-success-25, bg-success-100 for success states

### Common Tailwind Patterns

```typescript
// Button with gradient
<Button className="bg-bank-gradient text-white shadow-form hover:bg-blue-600">

// Card styling
<div className="rounded-xl bg-white p-6 shadow-sm">

// Form input
<input className="form-input">

// Layout patterns
<div className="flex flex-col gap-4 md:flex-row">
```

---

## Error Handling and Validation

Proper error handling is critical for a banking application. This section outlines the patterns for handling errors and validating input.

### Server Action Error Handling

Server Actions should always return a consistent result structure:

```typescript
export async function someAction(input: unknown) {
  try {
    // Operation
    return { ok: true, data: /* result */ };
  } catch (error) {
    console.error('Action error:', error);
    return { ok: false, error: 'User-friendly error message' };
  }
}
```

### Client-Side Error Handling

On the client, check the result and display appropriate feedback:

```typescript
const result = await someAction(data);

if (!result.ok) {
  toast.error(result.error);
  return;
}

// Success
toast.success("Operation completed");
```

### Zod Validation

Use Zod for all input validation:

```typescript
import { z } from "zod";

const CreateTransactionSchema = z.object({
  amount: z.string().min(1),
  recipientId: z.string().min(1),
  senderBankId: z.string().min(1)
});

export async function createTransaction(input: unknown) {
  const parsed = CreateTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map(i => i.message).join(", ")
    };
  }

  // Proceed with validated data
}
```

### Error Tracking

The application uses an error tracking system (configured in lib/error-tracking.ts) to capture and monitor errors:

```typescript
// In Server Actions for important operations
try {
  // Operation
} catch (error) {
  // Log to error tracking
  console.error("Operation failed:", error);
  return { ok: false, error: "Failed to complete operation" };
}
```

---

## Security

Security is paramount for a banking application. This section outlines the security measures implemented in the codebase.

### Authentication

The application uses NextAuth v4 with:

- Drizzle ORM adapter for session storage
- Credentials provider for email/password login
- OAuth providers (GitHub, Google)
- Database session strategy (not JWT)

Authentication is managed through the auth() function in lib/auth.ts:

```typescript
import { auth } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // User is authenticated
}
```

### Authorization

Check user roles and permissions for protected operations:

```typescript
export async function adminOnlyAction(input: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: "Not authenticated" };
  }

  if (!session.user.isAdmin) {
    return { ok: false, error: "Admin access required" };
  }

  // Proceed with admin operation
}
```

### Rate Limiting

Rate limiting is implemented using Upstash Redis. Auth routes are protected with 5 requests per 60 seconds:

```typescript
// Rate limiting is configured in the middleware or at the API level
// Uses Upstash Redis for distributed rate limiting
```

### Token Encryption

All sensitive tokens (bank access tokens from Plaid) are encrypted using AES-256-GCM:

```typescript
import { encrypt, decrypt } from "@/lib/encryption";

// Encrypt before storing
const encryptedToken = encrypt(plainTextToken);

// Decrypt when needed
const plainTextToken = decrypt(encryptedToken);
```

### Environment Variables

Never use raw process.env. Use the typed environment utility:

```typescript
// lib/env.ts provides type-safe environment access
import { env } from "@/lib/env";

// env is validated at startup and provides typed properties
const apiKey = env.PLAID_CLIENT_ID;
```

Required environment variables:

- ENCRYPTION_KEY - Minimum 32 characters for AES-256-GCM
- NEXTAUTH_SECRET - For NextAuth session encryption
- DATABASE_URL - PostgreSQL connection string

Optional environment variables:

- AUTH_GITHUB_ID, AUTH_GITHUB_SECRET - GitHub OAuth
- AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET - Google OAuth
- PLAID_CLIENT_ID, PLAID_SECRET - Plaid integration
- DWOLLA_KEY, DWOLLA_SECRET - Dwolla integration

---

## Database Schema

The database schema is defined in database/schema.ts using Drizzle ORM. This section provides an overview of the schema structure.

### Users Table

The users table stores authentication and basic user information:

```typescript
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRole("role").default("user").notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
```

### User Profiles Table

Extended profile information:

```typescript
export const user_profiles = pgTable("user_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 })
});
```

### Banks Table

Linked bank accounts via Plaid:

```typescript
export const banks = pgTable(
  "banks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token").notNull(), // Encrypted
    fundingSourceUrl: text("funding_source_url"),
    sharableId: varchar("sharable_id", { length: 255 })
      .notNull()
      .unique(),
    institutionId: varchar("institution_id", { length: 255 }),
    institutionName: varchar("institution_name", { length: 255 }),
    accountId: varchar("account_id", { length: 255 }),
    accountType: varchar("account_type", { length: 50 }),
    accountSubtype: varchar("account_subtype", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
  },
  table => [
    index("banks_user_id_idx").on(table.userId),
    index("banks_sharable_id_idx").on(table.sharableId)
  ]
);
```

### Transactions Table

Transaction records:

```typescript
export const transactions = pgTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    senderBankId: text("sender_bank_id").references(() => banks.id),
    receiverBankId: text("receiver_bank_id").references(
      () => banks.id
    ),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    amount: varchar("amount", { length: 50 }).notNull(),
    type: varchar("type", { length: 50 }),
    status: varchar("status", { length: 50 }).default("pending"),
    channel: varchar("channel", { length: 50 }),
    category: varchar("category", { length: 255 }),
    plaidTransactionId: varchar("plaid_transaction_id", {
      length: 255
    }),
    createdAt: timestamp("created_at").defaultNow()
  },
  table => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_sender_bank_idx").on(table.senderBankId),
    index("transactions_receiver_bank_idx").on(table.receiverBankId)
  ]
);
```

### Indexes

All tables have appropriate indexes for common query patterns. When adding new queries, ensure indexes exist for:

- Foreign key columns (userId on banks, transactions)
- Columns used in WHERE clauses
- Columns used for sorting (createdAt)

---

## Testing

Testing is essential for maintaining code quality in this banking application. This section outlines the testing approach and patterns.

### Test Organization

Tests are organized in the tests/ directory:

- tests/unit/ - Vitest unit and integration tests
- tests/e2e/ - Playwright end-to-end tests

Tests should be co-located with the code they test when possible, following the pattern of placing tests in a tests/ subdirectory alongside the relevant files.

### Vitest Unit Tests

Use Vitest for unit and integration tests of server actions, DAL methods, and utility functions:

```typescript
// tests/unit/register.test.ts
import { registerUser } from "@/lib/actions/register";
import { describe, expect, it } from "vitest";

describe("registerUser", () => {
  describe("validation", () => {
    it("should return error for invalid email", async () => {
      const result = await registerUser({
        email: "invalid-email",
        password: "password123",
        firstName: "John",
        lastName: "Doe"
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("email");
    });

    it("should return error for short password", async () => {
      const result = await registerUser({
        email: "test@example.com",
        password: "short",
        firstName: "John",
        lastName: "Doe"
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("8 characters");
    });
  });
});
```

### Playwright E2E Tests

Use Playwright for end-to-end tests that verify user flows:

```typescript
// tests/e2e/sign-in.spec.ts
import { test, expect } from "@playwright/test";

test("sign in with valid credentials", async ({ page }) => {
  await page.goto("/sign-in");

  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
});

test("sign in with invalid credentials shows error", async ({
  page
}) => {
  await page.goto("/sign-in");

  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "wrongpassword");
  await page.click('button[type="submit"]');

  await expect(page.locator(".toast-error")).toBeVisible();
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run only Vitest tests
npm run test:browser

# Run only Playwright tests
npm run test:ui

# Run a specific Vitest test file
npm exec vitest run tests/unit/register.test.ts --config=vitest.config.ts

# Run a specific Playwright test
npm exec playwright test tests/e2e/sign-in.spec.ts
```

### Test Requirements

- All tests must pass with 100% success before merging
- New features should include appropriate test coverage
- Bug fixes should include regression tests
- Use descriptive test names that explain what is being tested

---

## Key Features

This section provides details on the key features implemented in the banking application.

### Authentication

The application implements comprehensive authentication:

- NextAuth v4 with Drizzle ORM adapter for session persistence
- Email/password authentication with secure password hashing (bcrypt)
- OAuth integration with GitHub and Google
- Session-based authentication strategy
- Protected routes with automatic redirects
- Role-based access control (user, admin, moderator)

Authentication configuration is in lib/auth-config.ts and lib/auth-options.ts. The auth() function in lib/auth.ts provides easy access to the current session.

### Bank Account Linking (Plaid)

Users can link external bank accounts through Plaid:

1. User initiates bank connection in the UI
2. Plaid Link modal collects credentials
3. Plaid returns access token
4. Access token is encrypted and stored in the database
5. Bank accounts and transactions are synced from Plaid

The Plaid integration handles:

- Account linking and unlinking
- Transaction synchronization
- Balance retrieval
- Account details retrieval

### Payment Transfers (Dwolla)

The application supports account-to-account transfers through Dwolla:

- Transfers between linked bank accounts
- Transfer status tracking
- Funding source management
- ACH and other transfer types

### Transaction Management

Users can view and manage transactions:

- Transaction history with pagination
- Filter by date, category, account
- Transaction categorization
- Search functionality
- Transaction details view

### Admin Functions

Admin users have additional capabilities:

- View all users
- Toggle admin status
- Activate/deactivate user accounts
- Access to admin-only pages

---

## Anti-Rate-Limiting Strategy

When using AI assistants or automated tools to work on this codebase, follow these strategies to avoid rate limiting and ensure efficient progress.

### Chunked Execution

1. Never paste full documentation files into a prompt. Reference by path instead.
2. Work in focused phases - one feature or section at a time.
3. Use specific references - "Implement pattern from Section 23.2" instead of quoting code.
4. Batch related changes - edit multiple files in one turn rather than sequential turns.

### Efficient Prompting Examples

Good prompt:

```
Add reading progress tracking using the idempotent upsert pattern from lib/dal/user.dal.ts
```

Bad prompt:

```
Here's the full schema... [500 lines] ... now implement this
```

Good prompt with persona:

```
As Implementer, add a DAL method for user search following the pattern in user.dal.ts
```

Bad open-ended prompt:

```
Implement all features for the entire application
```

### Session Management

- Start fresh sessions for each major phase (Foundation → Features → QA → Deploy)
- Commit between phases to save state and reduce context window
- Run npm run type-check after each batch to catch issues early
- Keep prompts under 500 words - reference docs instead of quoting

---

## PR and Merge Requirements

All pull requests must meet the following requirements before they can be merged:

### Required Checks

- All PRs must pass npm run lint:strict (zero warnings allowed)
- All PRs must pass npm run type-check (zero TypeScript errors)
- All PRs must pass npm run test (100% test success)
- All PRs must pass npm run format:check (proper code formatting)

### Pre-Push Validation

Before pushing changes, run:

```bash
npm run validate
```

This command runs all checks in sequence to ensure the code meets all requirements.

### Merge Flow

1. Create a feature branch from main
2. Implement changes following the guidelines in this document
3. Write tests for new functionality
4. Run all validation commands locally
5. Push and create PR
6. Wait for CI to pass
7. Request review from team members
8. Address any feedback
9. Merge after approval

---

## Reference

### Important Files

- lib/auth.ts - Authentication helper
- lib/dal/user.dal.ts - User data access
- lib/dal/bank.dal.ts - Bank data access
- lib/dal/transaction.dal.ts - Transaction data access
- lib/actions/register.ts - Registration action
- lib/actions/bank.actions.ts - Bank management actions
- lib/actions/transaction.actions.ts - Transaction actions
- lib/actions/user.actions.ts - User actions
- lib/actions/admin.actions.ts - Admin actions
- lib/actions/updateProfile.ts - Profile update actions
- database/schema.ts - Database schema definition
- lib/env.ts - Environment variable validation
- lib/encryption.ts - Encryption utilities
- lib/plaid.ts - Plaid integration
- lib/utils.ts - Utility functions

### External Documentation

- Next.js 16 Documentation
- Drizzle ORM Documentation
- NextAuth v4 Documentation
- Plaid Documentation
- Dwolla Documentation
- Tailwind CSS v4 Documentation

---

## App Router Patterns

This section provides detailed patterns for working with the Next.js App Router.

### Route Groups

The application uses route groups to organize layouts:

```
app/
├── (auth)/           # Auth-specific layout (sign-in, sign-up)
│   ├── layout.tsx
│   ├── sign-in/
│   └── sign-up/
├── (root)/          # Main app layout (dashboard, etc.)
│   ├── layout.tsx
│   ├── dashboard/
│   ├── my-banks/
│   ├── transaction-history/
│   └── payment-transfer/
└── page.tsx          # Public landing page
```

### Layouts

Use layouts for shared UI and state:

```typescript
// app/(root)/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Loading States

Use loading.tsx for Suspense boundaries:

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
```

### Error Handling

Use error.tsx for error boundaries:

```typescript
// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found

Use not-found.tsx for 404 pages:

```typescript
// app/dashboard/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/dashboard">Return Home</Link>
    </div>
  );
}
```

---

## Database Query Patterns

This section provides detailed patterns for database queries using Drizzle ORM.

### Basic Queries

```typescript
// Simple select
const [user] = await db.select().from(users).where(eq(users.id, id));

// Select with multiple conditions
const results = await db
  .select()
  .from(transactions)
  .where(
    and(
      eq(transactions.userId, userId),
      eq(transactions.status, "completed")
    )
  );

// Ordering and limiting
const transactions = await db
  .select()
  .from(transactions)
  .where(eq(transactions.userId, userId))
  .orderBy(desc(transactions.createdAt))
  .limit(10)
  .offset(0);
```

### Aggregations

```typescript
// Group by and aggregate
const stats = await db
  .select({
    type: transactions.type,
    total: sql<string>`SUM(CAST(${transactions.amount} AS DECIMAL))`,
    count: sql<number>`COUNT(*)`
  })
  .from(transactions)
  .where(eq(transactions.userId, userId))
  .groupBy(transactions.type);
```

### Inserts

```typescript
// Single insert
const [user] = await db.insert(users).values(data).returning();

// Multiple inserts
const newUsers = await db.insert(users).values(usersData).returning();
```

### Updates

```typescript
// Update with returning
const [updated] = await db
  .update(users)
  .set({ name: "New Name" })
  .where(eq(users.id, userId))
  .returning();
```

### Deletes

```typescript
// Delete with condition
await db.delete(users).where(eq(users.id, userId));
```

---

## API Integration Patterns

This section covers patterns for integrating with external APIs like Plaid and Dwolla.

### Plaid Integration

The Plaid integration handles bank account linking:

```typescript
// lib/plaid.ts contains Plaid client configuration
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
});

export const plaidClient = new PlaidApi(configuration);
```

### Dwolla Integration

The Dwolla integration handles transfers:

```typescript
// dwolla.ts contains Dwolla client configuration
// Use for account-to-account transfers
```

### Error Handling for External APIs

Always handle external API errors gracefully:

```typescript
try {
  const result = await plaidClient.itemExchange(publicToken);
  // Process result
} catch (error) {
  if (error.response?.data?.error_code === "ITEM_LOGIN_REQUIRED") {
    // Handle re-authentication needed
    return { ok: false, error: "Re-authentication required" };
  }
  console.error("Plaid error:", error);
  return { ok: false, error: "Failed to link account" };
}
```

---

## Form Validation Patterns

This section provides comprehensive patterns for form validation.

### Basic Validation Schema

```typescript
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});
```

### Complex Validation Schema

```typescript
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  // Optional fields
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  postalCode: z.string().min(5).max(10).optional(),
  dateOfBirth: z.string().optional(),
  ssn: z.string().optional()
});
```

### Conditional Validation

```typescript
const authFormSchema = (type: string) =>
  z
    .object({
      firstName:
        type === "sign-in"
          ? z.string().optional()
          : z.string().min(2),
      lastName:
        type === "sign-in"
          ? z.string().optional()
          : z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword:
        type === "sign-in" ? z.string().optional() : z.string().min(8)
    })
    .refine(
      data => {
        if (type !== "sign-up") return true;
        return data.password === data.confirmPassword;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"]
      }
    );
```

### Validation Error Handling

```typescript
export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);

  if (!parsed.success) {
    // Return first error message
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Validation failed"
    };
  }

  // Proceed with validated data
  const { email, password, firstName, lastName } = parsed.data;
  // ... rest of implementation
}
```

---

## Performance Optimization

This section covers performance optimization techniques for the banking application.

### Server Component Usage

Minimize client-side JavaScript by using Server Components:

- Render data-fetching components on the server
- Use client components only for interactive elements
- Pass data from Server Components to Client Components via props

### Data Fetching

Optimize data fetching patterns:

```typescript
// Good: Fetch only needed data
const user = await userDal.findById(userId);

// Good: Use pagination for large datasets
const transactions = await transactionDal.findByUserId(userId, 20, 0);

// Good: Use specific selects
const [bank] = await db
  .select({ id: banks.id, name: banks.institutionName })
  .from(banks)
  .where(eq(banks.userId, userId));
```

### Caching

Leverage Next.js caching:

```typescript
// Revalidate after mutations
revalidatePath("/dashboard");
revalidatePath("/transactions");

// Use cache tags for specific invalidation
revalidateTag("transactions");
```

---

## Debugging Guide

This section provides a comprehensive debugging guide for the banking application.

### Common Issues and Solutions

#### Authentication Issues

If users cannot authenticate:

1. Check DATABASE_URL is set correctly
2. Verify session configuration in lib/auth-options.ts
3. Check browser cookies are enabled
4. Inspect NextAuth.js debug logs

#### Database Connection Issues

If database queries fail:

1. Run `npm run db:studio` to verify connection
2. Check DATABASE_URL format
3. Verify database server is running
4. Check for migration issues

#### API Integration Issues

If Plaid/Dwolla APIs fail:

1. Verify API keys in environment
2. Check Plaid/Dwolla dashboard for errors
3. Verify webhook configurations
4. Check network connectivity

### Debug Logging

Use appropriate logging:

```typescript
// Server-side logging
console.error("Error details:", error);

// Client-side logging (avoid in production)
console.debug("Debug info:", value);
```

---

## Deployment Guide

This section covers deployment procedures for the banking application.

### Environment Setup

Required environment variables for production:

```
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate-random-string>
ENCRYPTION_KEY=<32-character-key>
PLAID_CLIENT_ID=<client-id>
PLAID_SECRET=<secret>
DWOLLA_KEY=<key>
DWOLLA_SECRET=<secret>
```

### Build Process

```bash
# Production build
npm run build

# Verify build
npm run start
```

### Database Migrations

Always run migrations in production:

```bash
npm run db:migrate
```

---

## Additional Resources

For more information, refer to:

- Next.js 16 App Router Documentation
- Drizzle ORM Getting Started Guide
- NextAuth.js Configuration
- Plaid Node.js SDK
- Dwolla API Documentation
- Tailwind CSS v4 Documentation

---

Last Updated: 2026-03-28
