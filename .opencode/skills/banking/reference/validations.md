# Validation & Server Actions Reference

## Zod Schemas

All schemas in `lib/validations/`:

### auth.ts

```typescript
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  address1: z.string().optional()
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
```

### transfer.ts

```typescript
export const transferSchema = z.object({
  amount: z.number().positive().max(10000),
  fromWalletId: z.string().uuid(),
  toRecipientId: z.string().uuid(),
  memo: z.string().max(200).optional()
});
```

### admin.ts

```typescript
// Admin-specific validation schemas
```

## Server Actions Pattern

All actions in `actions/*.ts` follow this contract:

```typescript
"use server";

import { z } from "zod";
import { userDal } from "@/dal";
import { someSchema } from "@/lib/validations/some";

export async function doSomething(input: unknown): Promise<{
  ok: boolean;
  data?: SomeType;
  error?: string;
}> {
  // 1. Validate input
  const parsed = someSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues
      .slice(0, 3)
      .map(i => i.message)
      .join("; ");
    return { error: errors, ok: false };
  }

  // 2. Optional: auth check (if protected)
  // const session = await auth();
  // if (!session?.user?.id) {
  //   return { error: "Unauthorized", ok: false };
  // }

  // 3. Use DAL helper
  const result = await someDal.doSomething(parsed.data);
  if (!result.ok) {
    return { error: result.error, ok: false };
  }

  // 4. Optional: revalidate
  // revalidatePath("/dashboard");

  return { ok: true, data: result.data };
}
```

## Action Files

| File                             | Purpose                |
| -------------------------------- | ---------------------- |
| `actions/register.ts`            | User registration      |
| `actions/auth.signin.ts`         | Sign in                |
| `actions/user.actions.ts`        | User profile updates   |
| `actions/updateProfile.ts`       | Profile updates        |
| `actions/wallet.actions.ts`      | Wallet CRUD            |
| `actions/transaction.actions.ts` | Transaction operations |
| `actions/plaid.actions.ts`       | Plaid bank linking     |
| `actions/dwolla.actions.ts`      | ACH transfers          |
| `actions/recipient.actions.ts`   | Transfer recipients    |
| `actions/admin.actions.ts`       | Admin operations       |
| `actions/admin-stats.actions.ts` | Admin statistics       |

## Input Validation

Always use `.safeParse()` and return structured errors:

```typescript
const parsed = signUpSchema.safeParse(input);
if (!parsed.success) {
  const allErrors = parsed.error.issues
    .slice(0, 3) // Limit to 3 errors
    .map(issue => issue.message)
    .join("; ");
  return { error: allErrors, ok: false };
}
```

## Auth in Server Actions

For protected actions, call auth early:

```typescript
import { auth } from "@/lib/auth"; // or next-auth

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  // Continue with user ID: session.user.id
}
```

## Error Handling

Return consistent error shape:

```typescript
// Success
return { ok: true, user: result.user };

// Error
return { error: "Email already registered", ok: false };
```

## TypeScript Types

Export input types from actions:

```typescript
export type RegisterInput = z.infer<typeof signUpSchema>;
```

This allows callers to import the type for type-safe forms.
