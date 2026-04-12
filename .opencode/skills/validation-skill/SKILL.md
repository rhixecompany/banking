---
name: ValidationSkill
description: Zod schema validation patterns for forms, API inputs, and type-safe data in the Banking app. Use when creating schemas, validating user input, or implementing form validation.
---

# ValidationSkill - Zod Schema Validation

## Overview

This skill provides guidance on Zod schema validation patterns for the Banking project.

## Zod v4 Patterns

### ESLint-Enforced Rules

- `zod/no-any-schema` — error
- `zod/require-error-message` — error (all validators need message strings)
- `zod/prefer-meta` — error (every field must have `.describe("...")`)
- `zod/no-optional-and-default-together` — error

### Basic Schema with `.describe()`

```typescript
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .describe("User email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .describe("User password")
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .describe("Display name"),
  email: z
    .string()
    .email("Invalid email address")
    .describe("User email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .describe("User password")
});
```

### Complex Schemas

```typescript
// Transfer validation
export const transferSchema = z
  .object({
    recipientId: z
      .string()
      .uuid("Invalid recipient")
      .describe("Recipient UUID"),
    amount: z.coerce
      .number()
      .positive("Amount must be positive")
      .max(10000, "Amount exceeds limit")
      .describe("Transfer amount"),
    memo: z.string().max(100).optional().describe("Transfer memo")
  })
  .refine(d => d.amount > 0, {
    message: "Amount must be greater than 0",
    path: ["amount"]
  });
```

### Form Integration

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().describe("Recipient email"),
  amount: z.coerce.number().min(0.01).describe("Transfer amount"),
});

export function TransferForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", amount: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createTransfer(values);
    if (!result.ok) form.setError("root", { message: result.error });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* form fields */}
    </form>
  );
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

export const auth = parseAuthConfig();
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
2. **Use `safeParse`** for controlled error handling
3. **Chain validators** — `z.string().email().min(8)`
4. **Custom error messages** — Provide clear feedback
5. **`.describe()` on every field** — ESLint-enforced
6. **Use `z.coerce`** for form inputs (numbers, booleans)

Note: For canonical agent rules and plan repository location, see `AGENTS.md` and create plans in `.opencode/plans/` when changes touch more than 3 files.

## Validation

Run: `npm run type-check`

## Common Issues

1. **Type inference** — Use `z.infer<typeof schema>` for TypeScript types
2. **Partial validation** — Use `.partial()` for optional fields
3. **Union types** — Use `.union()` or `.discriminatedUnion()` for alternatives
4. **Missing `.describe()`** — ESLint `zod/prefer-meta` will error
5. **Missing error messages** — ESLint `zod/require-error-message` will error
