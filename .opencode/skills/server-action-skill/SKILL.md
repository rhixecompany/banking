---
name: server-action-skill
description: >-
  Patterns and examples for Next.js Server Actions in the Banking app. Use when creating, modifying, or debugging Server Actions. Triggers include requests to "create action", "add server action", "fix action", "validate input", or any task involving Server Action development.


lastReviewed: 2026-04-24
applyTo: "app/**/*.{ts,tsx}"
---

# Server Action Skill — Next.js Server Actions

Comprehensive patterns for creating and managing Server Actions in the Banking app.

## When to Use This Skill

- Creating new Server Actions
- Modifying existing actions
- Debugging action failures
- Validating input data
- Implementing authentication in actions
- Working with database operations

## Multi-Agent Commands

### OpenCode / Cursor / Copilot

```bash
# Run type check
bun run type-check

# Run lint
bun run lint:strict

# Generate new action
bun run generate action <name>
```

## Core Patterns

### Basic Server Action Structure

```typescript
"use server";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Input validation schema
const Schema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .meta({ description: "Display name" }),
  email: z.string().email().meta({ description: "User email" })
});

// Action function
export async function updateProfile(input: unknown) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // 2. Validate input
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // 3. Perform operation
  try {
    await userDal.update(session.user.id, parsed.data);

    // 4. Revalidate cache
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { ok: true };
  } catch (error) {
    return { ok: false, error: "UpdateFailed" };
  }
}
```

### Return Shape Pattern

Server Actions MUST return this shape:

```typescript
// Success
return { ok: true };

// Success with data
return { ok: true, data: { userId: "123" } };

// Failure
return { ok: false, error: "ErrorCode" };
```

### Error Codes

Use consistent error codes:

| Code                 | Meaning                |
| -------------------- | ---------------------- |
| `Unauthorized`       | User not authenticated |
| `Forbidden`          | User lacks permission  |
| `AccountDeactivated` | User account inactive  |
| `InvalidInput`       | Validation failed      |
| `NotFound`           | Resource not found     |
| `AlreadyExists`      | Duplicate resource     |
| `OperationFailed`    | General failure        |

## Input Validation with Zod

### Basic Validation

```typescript
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(18).optional()
});
```

### Advanced Validation

```typescript
const RegisterSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .transform(val => val.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain uppercase")
      .regex(/[0-9]/, "Password must contain number"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
```

### Metadata for Forms

```typescript
const FormSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(10000, "Maximum amount is $10,000")
    .meta({ description: "Transfer amount in USD" }),
  recipientId: z
    .string()
    .uuid("Invalid recipient ID")
    .meta({ description: "Recipient user ID" }),
  note: z
    .string()
    .max(500, "Note too long")
    .optional()
    .meta({ description: "Optional transfer note" })
});
```

## Authentication in Actions

### Basic Auth Check

```typescript
export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  // Continue...
}
```

### Admin-Only Action

```typescript
export async function adminAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!session.user.isAdmin) {
    return { ok: false, error: "Forbidden" };
  }
  // Continue...
}
```

### Active Account Check

```typescript
export async function activeUserAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!session.user.isActive) {
    return { ok: false, error: "AccountDeactivated" };
  }
  // Continue...
}
```

## Database Operations

### Using DAL Helpers

```typescript
"use server";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";
import { transactionDal } from "@/dal/transaction.dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().max(500)
});

export async function createTransaction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = TransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // Create transaction via DAL
  const transaction = await transactionDal.create({
    userId: session.user.id,
    amount: parsed.data.amount,
    description: parsed.data.description
  });

  revalidatePath("/dashboard");
  return { ok: true, transactionId: transaction.id };
}
```

### Transaction Support

```typescript
"use server";
import { auth } from "@/lib/auth";
import { db } from "@/database";
import { userDal } from "@/dal/user.dal";
import { walletDal } from "@/dal/wallet.dal";

export async function transferFunds(input: {
  to: string;
  amount: number;
}) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // Use transaction for atomic operations
  await db.transaction(async tx => {
    await userDal.decrementBalance(session.user.id, input.amount, tx);
    await userDal.incrementBalance(input.to, input.amount, tx);
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
```

## Cache Revalidation

### Revalidate Paths

```typescript
import { revalidatePath } from "next/cache";

// After create
revalidatePath("/dashboard");
revalidatePath("/transactions");

// After update
revalidatePath("/profile");
revalidatePath("/settings");
```

### Revalidate Tags

```typescript
import { revalidateTag } from "next/cache";

// Tag-based revalidation
revalidateTag("transactions");
revalidateTag(`user-${userId}`);
```

## Error Handling

### Try-Catch Pattern

```typescript
export async function createUser(input: unknown) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Unauthorized" };
    }

    const parsed = UserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.message };
    }

    const user = await userDal.create(parsed.data);
    revalidatePath("/users");

    return { ok: true, userId: user.id };
  } catch (error) {
    console.error("Create user failed:", error);
    return { ok: false, error: "OperationFailed" };
  }
}
```

### Custom Error Handling

```typescript
export async function complexAction(input: unknown) {
  try {
    // Operation
  } catch (error) {
    if (error instanceof UserExistsError) {
      return { ok: false, error: "UserAlreadyExists" };
    }
    if (error instanceof InsufficientFundsError) {
      return { ok: false, error: "InsufficientFunds" };
    }
    return { ok: false, error: "OperationFailed" };
  }
}
```

## Client-Side Usage

### Using useFormStatus

```typescript
// components/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

// Usage in form
<form action={submitAction}>
  <input name="email" />
  <SubmitButton />
</form>
```

### Using useActionState

```typescript
"use client";

import { useActionState } from "react";
import { submitAction } from "@/actions/submit";

export function Form() {
  const [state, formAction, pending] = useActionState(submitAction, {
    ok: false,
  });

  return (
    <form action={formAction}>
      <input name="email" />
      <button type="submit" disabled={pending}>
        Submit
      </button>
      {!state.ok && <p>{state.error}</p>}
    </form>
  );
}
```

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Check auth early** - Return immediately if not authenticated
3. **Return consistent shape** - `{ ok: boolean; error?: string }`
4. **Use DAL for DB access** - Never query directly in actions
5. **Revalidate after mutations** - Update cached data
6. **Handle errors gracefully** - Return meaningful error codes

## Testing Server Actions

```typescript
import { describe, it, expect, vi } from "vitest";
import { updateProfileAction } from "@/actions/profile";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn()
}));

describe("updateProfileAction", () => {
  it("should update profile successfully", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "test@test.com" }
    });

    const result = await updateProfileAction({ name: "New Name" });
    expect(result.ok).toBe(true);
  });

  it("should reject unauthenticated users", async () => {
    vi.mocked(auth).mockResolvedValue(null);
    const result = await updateProfileAction({ name: "Name" });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });
});
```

## Cross-References

- **auth-skill**: For authentication patterns
- **validation-skill**: For Zod validation
- **dal-skill**: For database operations
- **testing-skill**: For testing patterns

## Validation

```bash
# Type check
bun run type-check

# Lint
bun run lint:strict

# Test
bun run test:browser
```
