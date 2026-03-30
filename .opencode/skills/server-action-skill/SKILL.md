---
name: ServerActionSkill
description: Server Action patterns for mutations, form handling, revalidation, and error handling in the Banking app. Use when creating forms, mutations, or data updates.
---

# ServerActionSkill - Server Actions Patterns

## Overview

This skill provides guidance on Server Action patterns for the Banking project.

## Key Patterns

### Basic Server Action

```typescript
// lib/actions/user.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional()
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name"),
    image: formData.get("image")
  };

  const result = updateProfileSchema.safeParse(rawData);
  if (!result.success) {
    return { ok: false, error: result.error.message };
  }

  await userDal.update(session.user.id, result.data);
  revalidatePath("/dashboard");

  return { ok: true };
}
```

### With useFormState (React 19 useActionState)

```typescript
// lib/actions/register.ts
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function registerUser(
  prevState: {
    error?: string;
    fieldErrors?: Record<string, string[]>;
  },
  formData: FormData
) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return {
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors
    };
  }

  const existingUser = await userDal.findByEmail(result.data.email);
  if (existingUser) {
    return { error: "Email already registered" };
  }

  const user = await userDal.create(result.data);

  // Set session and redirect
  const session = await auth();
  if (session) {
    await session.update({
      user: { id: user.id, name: user.name, email: user.email }
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
```

### Client Component with useFormStatus

```typescript
// components/submit-button.tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Processing..." : "Submit"}
    </button>
  );
}
```

### Optimistic Updates (useOptimistic)

```typescript
// components/transfer-list.tsx
"use client";

import { useOptimistic } from "react";

export function TransferList({ transfers, onCancel }: TransferListProps) {
  const [optimisticTransfers, addOptimistic] = useOptimistic(
    transfers,
    (state, newTransfer) => [...state, newTransfer]
  );

  return (
    <ul>
      {optimisticTransfers.map((t) => (
        <li key={t.id}>
          {t.amount} - {t.status}
        </li>
      ))}
    </ul>
  );
}
```

## Error Handling

```typescript
export async function transferFunds(
  fromAccountId: string,
  toAccountId: string,
  amount: number
) {
  try {
    const fromAccount = await bankDal.findById(fromAccountId);
    if (!fromAccount) {
      return { ok: false, error: "Source account not found" };
    }
    if (fromAccount.balance < amount) {
      return { ok: false, error: "Insufficient funds" };
    }

    await bankDal.transfer(fromAccountId, toAccountId, amount);
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Transfer error:", error);
    return { ok: false, error: "Transfer failed. Please try again." };
  }
}
```

## Validation

Run: `npm run type-check` and `npm run lint:strict`

## Critical Rules

1. **No API routes for mutations** - Use Server Actions for all writes
2. **Always validate input** - Use Zod schemas
3. **Auth check first** - Verify session before any action
4. **Revalidate after mutations** - Use `revalidatePath()` or `revalidateTag()`
5. **Return error shape** - `{ ok: boolean; error?: string }`
