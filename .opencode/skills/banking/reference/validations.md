# Validation & Server Actions Reference

**Quick Reference**: [NEVER List](#validation-anti-patterns) | [Schemas](#zod-schemas) | [Strategy](#before-writing-a-validation-schema) | [Actions](#action-files) | [Patterns](#server-actions-pattern) | [Errors](#error-handling)

---

## Validation Anti-Patterns

**NEVER** use `.parse()` without try-catch (crashes on invalid input):

```typescript
// ❌ WRONG - throws exception, no graceful handling
const user = signUpSchema.parse(input);

// ✅ CORRECT - returns error object, graceful error handling
const parsed = signUpSchema.safeParse(input);
if (!parsed.success) return { error: "Invalid input", ok: false };
```

**Why**: `.parse()` throws exceptions on validation failure. `.safeParse()` returns structured errors safe to return to users.

---

**NEVER** expose raw Zod error objects to users (leaks implementation details):

```typescript
// ❌ WRONG - exposes internals, confusing to users
return { ok: false, errors: parsed.error.errors };

// ✅ CORRECT - humanized, user-friendly error
const message = parsed.error.issues[0].message;
return { ok: false, error: message };
```

**Why**: Raw Zod errors contain field paths and type information; users need clear, actionable messages. Limit to 1–3 error messages per response.

---

**NEVER** validate monetary amounts as strings (precision loss and injection risks):

```typescript
// ❌ WRONG - string math causes precision issues
const amount = z.string().transform(x => parseFloat(x));

// ✅ CORRECT - validate as number with explicit bounds
const amount = z.number().positive().finite().max(10000);
```

**Why**: Floating-point strings introduce rounding errors. Numbers enforce type safety; use `.max()` to prevent transfer limit bypass.

---

**NEVER** skip transfer limit validation at the schema level (security risk):

```typescript
// ❌ WRONG - no limit enforcement
const transferSchema = z.object({
  amount: z.number().positive()
});

// ✅ CORRECT - explicit limit in schema
const transferSchema = z.object({
  amount: z.number().positive().max(10000)
});
```

**Why**: Validation happens in Server Actions, before DAL. Schema-level limits prevent even invalid requests from reaching the database.

---

**NEVER** reuse schemas across contexts without modification (security + UX):

```typescript
// ❌ WRONG - admin and user schemas identical
export const createUserSchema = z.object({ email, password, role });

// ✅ CORRECT - separate schemas by context
export const userSignUpSchema = z.object({ email, password }); // Users can't set role
export const adminCreateUserSchema = z.object({
  email,
  password,
  role
}); // Admins can
```

**Why**: User roles affect what fields are allowed. Admin schemas should enforce stricter validation (no user role escalation).

---

## Before Writing a Validation Schema

Ask yourself these questions:

- **Strictness**: Should this validate strictly for security (transfers, auth) or loosely for UX (optional fields)?
- **User Feedback**: Will validation errors be immediately obvious? Should message be for users or developers?
- **Security**: Does this schema prevent injection, limit bypass, or unintended field modification?
- **Edge Cases**: How do you handle max Int values, empty strings vs. null, timezone-aware dates?
- **Extensibility**: Will this schema need new fields? How will you version it?
- **Consistency**: Do error shapes match everywhere? Is error handling pattern reused?

---

## Zod Schemas

Location: `lib/validations/`

**signUpSchema** (`auth.ts`):

```typescript
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  address1: z.string().optional()
});
```

**signInSchema** (`auth.ts`):

```typescript
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
```

**transferSchema** (`transfer.ts`):

```typescript
export const transferSchema = z.object({
  amount: z.number().positive().max(10000),
  fromWalletId: z.string().uuid(),
  toRecipientId: z.string().uuid(),
  memo: z.string().max(200).optional()
});
```

## Server Actions Pattern

All actions in `actions/*.ts` follow this flow:

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
  // 1. Validate input (ALWAYS use safeParse)
  const parsed = someSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.issues
      .slice(0, 3)
      .map(i => i.message)
      .join("; ");
    return { error: errors, ok: false };
  }

  // 2. Auth check (if protected)
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  // 3. Use DAL helper
  const result = await someDal.doSomething(parsed.data);
  if (!result.ok) return { error: result.error, ok: false };

  // 4. Revalidate cache (if needed)
  revalidatePath("/dashboard");
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

## Error Handling

Always return consistent error shape:

```typescript
// Success
return { ok: true, user: result.user };

// Error (always include message)
return { error: "Email already registered", ok: false };
```

**Rules**:

- Limit error messages to 1–3 per response (focus user attention)
- Never expose raw Zod errors
- Never leak sensitive details (avoid "user ID 42 not found" — use "Invalid request")

## TypeScript Types

Export inferred types from Zod schemas for type-safe forms:

```typescript
export type RegisterInput = z.infer<typeof signUpSchema>;
```

This allows callers to import and use the type without duplicating validation logic.
