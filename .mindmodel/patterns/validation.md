# Validation

## Rules

- Use Zod for ALL external input validation (forms, API params, server actions)
- Validate at the boundary (server actions) — not deep in business logic
- Use `.trim()` on string inputs before validation
- Combine Zod schema with `zodResolver` in React Hook Form
- Always set appropriate `z.string()` constraints: `.min()`, `.max()`, `.email()`, `.url()`
- Transform inputs with `.transform()` when needed (e.g., string → number)

## Examples

### Form Validation Schema

```typescript
// src/lib/validations/auth.ts
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  address1: z.string().trim().min(1, "Address is required"),
  // Optional fields with defaults
  address2: z.string().trim().optional(),
  phone: z.string().trim().optional()
});
```

### Pagination Validation

```typescript
// src/actions/transaction.actions.ts
const PageSchema = z.number().int().min(1).default(1);
const PageSizeSchema = z.number().int().min(1).max(200).default(20);

export async function getTransactionHistory(page = 1, pageSize = 20) {
  const p = PageSchema.safeParse(page);
  const ps = PageSizeSchema.safeParse(pageSize);
  if (!p.success)
    return { error: p.error.issues[0].message, ok: false };
  if (!ps.success)
    return { error: ps.error.issues[0].message, ok: false };
  // ... implementation
}
```

### React Hook Form Integration

```typescript
// src/components/sign-in/sign-in-client-wrapper.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations/auth";

export default function SignInClientWrapper() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" }
  });
  // ...
}
```

## Anti-patterns

### Don't Validate Deep in Logic

```typescript
// BAD: Scattering validation through business logic
async function createUser(input: any) {
  if (!input.email) throw new Error("Email required"); // ❌
  if (!input.email.includes("@")) throw new Error("Invalid email"); // ❌
  // ...
}
```

### Don't Skip String Trimming

```typescript
// BAD: Leading/trailing spaces cause validation failures
export const emailSchema = z.object({
  email: z.string().email() // ❌ Missing trim
});

// GOOD: Trim before validation
export const emailSchema = z.object({
  email: z.string().trim().email("Invalid email") // ✓
});
```
