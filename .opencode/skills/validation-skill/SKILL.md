---
name: validation-skill
description: Zod schema validation patterns for forms, API inputs, and type-safe data in the Banking app. Use when creating schemas, validating user input, or implementing form validation.
lastReviewed: 2026-04-29
applyTo: "**/*.{ts,tsx,md}"
agents:
  - opencode
  - cursor
  - copilot
minLines: 300
---

# ValidationSkill - Zod Schema Validation

## Overview

This skill provides comprehensive guidance on Zod schema validation patterns for the Banking project. It covers Zod v4 patterns, ESLint-enforced rules, form integration, and environment validation.

**Supported Agents:** OpenCode, Cursor, Copilot

## Zod v4 Patterns

### ESLint-Enforced Rules

The Banking project enforces strict Zod validation rules via ESLint:

- `zod/no-any-schema` — error (prevents `any` type in schemas)
- `zod/require-error-message` — error (all validators need message strings)
- `zod/prefer-meta` — error (every field must have `.meta({ description: "..." })`)
- `zod/no-optional-and-default-together` — error (cannot use both `.optional()` and `.default()`)

### Basic Schema with `.meta({ description: "..." })`

Zod v4 uses `.meta()` for field descriptions (ESLint `zod/prefer-meta` enforces this):

```typescript
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .meta({ description: "User email for authentication" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .meta({ description: "User password for authentication" })
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .meta({ description: "Display name for user profile" }),
  email: z
    .string()
    .email("Invalid email address")
    .meta({ description: "User email for account creation" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character")
    .meta({ description: "User password for account security" })
});
```

### Complex Schemas

#### Transfer Validation Schema

```typescript
// Transfer validation with custom refinements
export const transferSchema = z
  .object({
    recipientId: z
      .string()
      .uuid("Invalid recipient ID format")
      .meta({ description: "Recipient's unique UUID identifier" }),
    amount: z.coerce
      .number()
      .positive("Amount must be positive")
      .max(10000, "Amount exceeds maximum transfer limit of $10,000")
      .meta({ description: "Transfer amount in USD" }),
    memo: z
      .string()
      .max(100, "Memo cannot exceed 100 characters")
      .optional()
      .meta({ description: "Optional transfer memo or note" })
  })
  .refine(d => d.amount > 0, {
    message: "Amount must be greater than 0",
    path: ["amount"]
  })
  .refine(d => d.recipientId !== d.senderId, {
    message: "Cannot transfer to yourself",
    path: ["recipientId"]
  });
```

#### Wallet Creation Schema

```typescript
export const createWalletSchema = z.object({
  name: z
    .string()
    .min(1, "Wallet name is required")
    .max(50, "Wallet name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Wallet name contains invalid characters")
    .meta({ description: "Name for the new wallet" }),
  type: z
    .enum(["checking", "savings", "investment"], {
      errorMap: () => ({ message: "Invalid wallet type" })
    })
    .meta({ description: "Type of wallet to create" }),
  initialBalance: z.coerce
    .number()
    .min(0, "Initial balance cannot be negative")
    .default(0)
    .meta({ description: "Optional initial balance" })
});
```

#### Transaction Filter Schema

```typescript
export const transactionFilterSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .meta({ description: "Filter transactions from this date" }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .meta({ description: "Filter transactions until this date" }),
  type: z
    .enum(["debit", "credit", "transfer"], {
      errorMap: () => ({ message: "Invalid transaction type" })
    })
    .optional()
    .meta({ description: "Filter by transaction type" }),
  minAmount: z.coerce
    .number()
    .positive()
    .optional()
    .meta({ description: "Minimum transaction amount" }),
  maxAmount: z.coerce
    .number()
    .positive()
    .optional()
    .meta({ description: "Maximum transaction amount" })
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "Start date must be before end date",
  path: ["startDate"]
});
```

### Form Integration

#### React Hook Form with Zod Resolver

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const transferFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .meta({ description: "Recipient email address" }),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be at least $0.01")
    .max(10000, "Amount cannot exceed $10,000")
    .meta({ description: "Transfer amount in USD" }),
  memo: z
    .string()
    .max(100, "Memo cannot exceed 100 characters")
    .optional()
    .meta({ description: "Optional transfer memo" })
});

type TransferFormData = z.infer<typeof transferFormSchema>;

export function TransferForm() {
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      email: "",
      amount: 0,
      memo: ""
    },
    mode: "onBlur"
  });

  async function onSubmit(values: TransferFormData) {
    const result = await createTransfer(values);
    if (!result.ok) {
      form.setError("root", {
        message: result.error || "Transfer failed. Please try again."
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Recipient Email
        </label>
        <input
          id="email"
          type="email"
          {...form.register("email")}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          {...form.register("amount")}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {form.formState.errors.amount && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      {form.formState.errors.root && (
        <p className="text-sm text-red-600">
          {form.formState.errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {form.formState.isSubmitting ? "Processing..." : "Transfer"}
      </button>
    </form>
  );
}
```

#### Server Action Validation

```typescript
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { createTransfer } from "@/dal/transaction.dal";

const transferSchema = z.object({
  recipientId: z
    .string()
    .uuid("Invalid recipient ID")
    .meta({ description: "Recipient UUID" }),
  amount: z.coerce
    .number()
    .positive("Amount must be positive")
    .max(10000, "Amount exceeds limit")
    .meta({ description: "Transfer amount" }),
  memo: z
    .string()
    .max(100)
    .optional()
    .meta({ description: "Transfer memo" })
});

export async function transferFunds(data: unknown) {
  // Always validate on server side
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const result = transferSchema.safeParse(data);
  if (!result.success) {
    return {
      ok: false,
      error: result.error.errors.map(e => e.message).join(", ")
    };
  }

  const { recipientId, amount, memo } = result.data;

  try {
    await createTransfer({
      senderId: session.user.id,
      recipientId,
      amount,
      memo
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: "Transfer failed. Please try again." };
  }
}
```

## Environment Validation (`app-config.ts`)

Environment variables are validated centrally in `app-config.ts` using Zod:

```typescript
// app-config.ts — centralized env config (Zod-validated)
import { z } from "zod";

const authSchema = z.object({
  NEXTAUTH_SECRET: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "NextAuth session secret" }),
  NEXTAUTH_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "NextAuth URL" })
});

const plaidSchema = z.object({
  PLAID_CLIENT_ID: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "Plaid client ID" }),
  PLAID_SECRET: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "Plaid secret key" }),
  PLAID_ENV: z
    .enum(["sandbox", "development", "production"])
    .default("sandbox")
    .meta({ description: "Plaid environment" })
});

export const auth = parseAuthConfig();
export const plaid = parsePlaidConfig();
```

**Never read `process.env` directly.** Use `app-config.ts` (preferred) or `lib/env.ts`:

```typescript
import { env } from "@/lib/env";
// or preferred:
import { auth, plaid, dwolla } from "@/app-config";
```

`lib/env.ts` re-exports from `app-config.ts` for backward compatibility. All env vars use `.optional()` — missing vars return `undefined`, never throw (except required ones in prod via `validateRequiredConfig()`).

## Validation Rules

1. **Never trust client input** — Always re-validate in Server Actions
2. **Use `safeParse`** for controlled error handling (never `parse` which throws)
3. **Chain validators** — `z.string().email().min(8).max(100)`
4. **Custom error messages** — Provide clear, actionable feedback
5. **`.meta({ description: "..." })` on every field** — ESLint-enforced
6. **Use `z.coerce`** for form inputs (numbers, booleans) - handles string to number conversion
7. **Validate on server** — Client validation is for UX only, server validation is mandatory
8. **Use discriminated unions** — For complex conditional validation scenarios

## Cross-References

- **Server Actions:** See `server-action-skill` for Server Action validation patterns
- **Auth:** See `auth-skill` for session-based validation
- **DAL:** See `dal-skill` for database validation patterns
- **Testing:** See `testing-skill` for testing validation schemas

## Troubleshooting

### Common Issues and Solutions

#### 1. Type inference not working

**Problem:** TypeScript cannot infer the type from the schema.

**Solution:** Use `z.infer<typeof schema>`:

```typescript
export const userSchema = z.object({
  name: z.string().meta({ description: "User name" }),
  email: z.string().email().meta({ description: "User email" })
});

type User = z.infer<typeof userSchema>; // { name: string; email: string }
```

#### 2. Partial validation needed

**Problem:** Need to validate optional fields or partial updates.

**Solution:** Use `.partial()`:

```typescript
const updateUserSchema = userSchema.partial();
// All fields are now optional
```

#### 3. Union types not working

**Problem:** Need to validate one of multiple types.

**Solution:** Use `.union()` or `.discriminatedUnion()`:

```typescript
// Simple union
const stringOrNumber = z.union([z.string(), z.number()]);

// Discriminated union (preferred for complex types)
const paymentMethod = z.discriminatedUnion("type", [
  z.object({ type: z.literal("card"), cardNumber: z.string() }),
  z.object({ type: z.literal("bank"), accountNumber: z.string() })
]);
```

#### 4. Missing `.meta()` error

**Problem:** ESLint `zod/prefer-meta` is throwing errors.

**Solution:** Add `.meta({ description: "..." })` to every field:

```typescript
// ❌ Wrong
name: z.string().min(2)

// ✅ Correct
name: z.string().min(2).meta({ description: "User's display name" })
```

#### 5. Missing error messages

**Problem:** ESLint `zod/require-error-message` is throwing errors.

**Solution:** Add error messages to all validators:

```typescript
// ❌ Wrong
email: z.string().email()

// ✅ Correct
email: z.string().email("Please enter a valid email address")
```

#### 6. Form input not converting to number

**Problem:** Form inputs return strings, not numbers.

**Solution:** Use `z.coerce.number()`:

```typescript
// ❌ Wrong - will fail for form input "100"
amount: z.number().min(0)

// ✅ Correct - coerces "100" to 100
amount: z.coerce.number().min(0)
```

#### 7. Custom validation not working

**Problem:** `.refine()` or `.superRefine()` not being applied.

**Solution:** Ensure the validation function returns boolean:

```typescript
// ❌ Wrong
.refine(data => {
  if (data.startDate && data.endDate) {
    // Missing return
    new Date(data.startDate) <= new Date(data.endDate);
  }
})

// ✅ Correct
.refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
})
```

## Multi-Agent Support

### OpenCode

When using OpenCode, validation skills are automatically loaded when working with forms or API inputs. OpenCode respects the ESLint rules and will flag validation errors in real-time.

### Cursor

Cursor IDE users can leverage the validation skill for:
- Real-time ESLint feedback on Zod schemas
- Auto-completion for Zod methods
- Quick fixes for missing `.meta()` and error messages

### Copilot

GitHub Copilot suggestions include:
- Schema templates based on context
- Proper error message formatting
- Type inference patterns

## Validation Checklist

Before submitting validation code:

- [ ] All fields have `.meta({ description: "..." })`
- [ ] All validators have error messages
- [ ] Server Actions re-validate all input
- [ ] Use `safeParse` instead of `parse`
- [ ] Use `z.coerce` for form inputs
- [ ] Cross-check with `server-action-skill` patterns

## Validation

Run: `bun run type-check`

For Zod-specific linting: `bun run lint:strict`

## Notes

- For canonical agent rules and plan repository location, see `AGENTS.md`
- Create plans in `.opencode/commands/` when changes touch more than 7 files
- Zod v4 is required - check `package.json` for version
- All validation schemas should be exported from dedicated files in `lib/schemas/`