---
name: ServerActionSkill
description: Server Action patterns for mutations, form handling, revalidation, and error handling in the Banking app. Use when creating forms, mutations, or data updates.
---

# ServerActionSkill - Server Actions Patterns

## Overview

This skill provides guidance on Server Action patterns for the Banking project.

## Action Files Location

All Server Actions live in `actions/` directory (NOT `lib/actions/`):

| File | Coverage |
| --- | --- |
| `actions/register.ts` | User registration |
| `actions/user.actions.ts` | Auth helpers (getLoggedInUser, logoutAccount, updateProfile) |
| `actions/admin.actions.ts` | Admin toggle |
| `actions/wallet.actions.ts` | Wallet CRUD (getUserWallets, disconnectWallet, createLinkToken, exchangePublicToken) |
| `actions/dwolla.actions.ts` | Transfers (createTransfer) |
| `actions/transaction.actions.ts` | Transaction queries (getRecentTransactions, getTransactionHistory) |
| `actions/plaid.actions.ts` | Plaid integration |
| `actions/recipient.actions.ts` | Recipient management |
| `actions/admin-stats.actions.ts` | Admin statistics |

## Basic Server Action

```typescript
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";
import {
  revalidatePath,
  unstable_updateTag as updateTag
} from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).describe("User display name"),
  image: z.string().url().optional().describe("Profile image URL")
});

export async function updateProfile(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const result = updateProfileSchema.safeParse(input);
  if (!result.success) {
    return { ok: false, error: result.error.message };
  }

  await userDal.update(session.user.id, result.data);
  revalidatePath("/dashboard");
  updateTag("user");

  return { ok: true };
}
```

## Cache Revalidation

```typescript
import {
  revalidatePath,
  unstable_updateTag as updateTag
} from "next/cache";

// Use updateTag in Server Actions for immediate cache invalidation
updateTag("wallets");

// Use revalidatePath for route-level invalidation
revalidatePath("/my-wallets");
```

## Error Handling

```typescript
export async function transferFunds(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user) return { ok: false, error: "Unauthorized" };

    const parsed = transferSchema.safeParse(input);
    if (!parsed.success)
      return { ok: false, error: parsed.error.message };

    // ... transfer logic via DAL

    revalidatePath("/transaction-history");
    updateTag("transactions");
    return { ok: true };
  } catch {
    return { ok: false, error: "Transfer failed. Please try again." };
  }
}
```

## Zod Schema Requirements

Every schema field **must** include `.describe("...")` (enforced by ESLint `zod/prefer-meta`):

```typescript
const transferSchema = z.object({
  amount: z.coerce.number().min(0.01).describe("Transfer amount"),
  senderWalletId: z.string().min(1).describe("Sender wallet ID"),
  receiverWalletId: z.string().min(1).describe("Receiver wallet ID")
});
```

## Validation

Run: `npm run type-check` and `npm run lint:strict`

## Critical Rules

1. **No API routes for mutations** — Use Server Actions for all writes
2. **Always validate input** — Use Zod schemas with `.describe()` on every field
3. **Auth check first** — Verify session before any action
4. **Revalidate after mutations** — Use `revalidatePath()` and `updateTag()`
5. **Return error shape** — `{ ok: boolean; error?: string }`
6. **DAL only** — All DB access through `dal/`, never in actions directly
