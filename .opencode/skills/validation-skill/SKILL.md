---
name: ValidationSkill
description: Zod schema validation patterns for forms, API inputs, and type-safe data in the Banking app. Use when creating schemas, validating user input, or implementing form validation.
---

# ValidationSkill - Zod Schema Validation

## Overview

This skill provides guidance on Zod schema validation patterns for the Banking project.

## Key Patterns

### Basic Schema

```typescript
// lib/validations/auth.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[0-9]/, "Password must contain number")
});
```

### With Type Inference

```typescript
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

// Use in Server Action
export async function signInAction(input: SignInInput) {
  const result = signInSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, errors: result.error.flatten().fieldErrors };
  }
  // Process sign in...
}
```

### Complex Schemas

```typescript
// Transfer validation
export const transferSchema = z.object({
  recipientId: z.string().uuid("Invalid recipient"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(10000, "Amount exceeds maximum limit"),
  memo: z.string().max(100).optional()
});

// Bank account validation
export const bankAccountSchema = z.object({
  routingNumber: z
    .string()
    .length(9, "Routing number must be 9 digits")
    .regex(/^\d+$/, "Routing number must be only digits"),
  accountNumber: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number must be at most 17 digits")
    .regex(/^\d+$/, "Account number must be only digits"),
  accountType: z.enum(["checking", "savings"])
});
```

### Form Integration

```typescript
// components/transfer-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferSchema, type TransferInput } from "@/lib/validations/transfer";

export function TransferForm() {
  const form = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
  });

  const onSubmit = async (data: TransferInput) => {
    const result = await transferAction(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

### Environment Validation

```typescript
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  PLAID_CLIENT_ID: z.string(),
  PLAID_SECRET: z.string(),
  DWOLLA_KEY: z.string(),
  DWOLLA_SECRET: z.string()
});

export const env = envSchema.parse(process.env);
```

## Validation Rules

1. **Never trust client input** - Always re-validate in Server Actions
2. **Use `safeParse`** for controlled error handling
3. **Chain validators** - `z.string().email().min(8)`
4. **Custom error messages** - Provide clear feedback

## Validation

Run: `npm run type-check`

## Common Issues

1. **Type inference** - Use `z.infer<typeof schema>` for TypeScript types
2. **Partial validation** - Use `.partial()` for optional fields
3. **Union types** - Use `.union()` or `.discriminatedUnion()` for alternatives
