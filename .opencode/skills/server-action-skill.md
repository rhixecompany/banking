# Server Action Skill

This skill provides guidance for implementing Server Actions with proper error handling, Zod validation, and revalidation patterns.

## Overview

Server Actions are async functions executed on the server that can be called from Client Components. They provide type-safe function calls with built-in request/response handling.

## Key Patterns

### 1. Basic Server Action Structure

```typescript
// lib/actions/user.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema for validating user creation input
 */
const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

/**
 * Create a new user with proper validation and error handling.
 *
 * @param data - User creation data
 * @returns {Promise<{ ok: boolean; error?: string }>}
 */
export async function createUser(
  data: z.infer<typeof CreateUserSchema>
): Promise<{ ok: boolean; userId?: string; error?: string }> {
  // 1. Validate input with Zod
  const parsed = CreateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  // 2. Check authentication
  const session = await auth();
  if (!session?.user) {
    return { error: "Not authenticated", ok: false };
  }

  // 3. Check authorization (e.g., admin only)
  if (!session.user.isAdmin) {
    return { error: "Not authorized", ok: false };
  }

  try {
    // 4. Perform the action
    const user = await userDal.create(parsed.data);

    // 5. Revalidate affected paths
    revalidatePath("/users");
    revalidatePath("/dashboard");

    return { ok: true, userId: user.id };
  } catch (error) {
    // 6. Handle errors gracefully
    console.error("Create user error:", error);
    return { error: "Failed to create user", ok: false };
  }
}
```

### 2. Server Action with File Upload

```typescript
const UploadSchema = z.object({
  file: z.instanceof(File),
  folder: z.string().min(1).optional()
});

export async function uploadFile(
  formData: FormData
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string;

  const parsed = UploadSchema.safeParse({ file, folder });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message, ok: false };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    // Upload logic here
    const url = await uploadToStorage(
      parsed.data.file,
      parsed.data.folder
    );
    revalidatePath("/uploads");
    return { ok: true, url };
  } catch {
    return { error: "Upload failed", ok: false };
  }
}
```

### 3. Server Action with Optimistic Updates

```tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect } from "react";
import { createUser, type State } from "@/lib/actions/user.actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create User"}
    </button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useActionState<State, FormData>(
    createUser,
    {}
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <SubmitButton />
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### 4. Server Action with Zod Form Integration

```typescript
"use server";

import { z } from "zod";

const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export async function registerUser(
  prevState: { errors?: z.ZodError["issues"] },
  formData: FormData
): Promise<{ errors?: z.ZodError["issues"] }> {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  };

  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { errors: parsed.error.issues };
  }

  // Proceed with registration...
  return {};
}
```

## Error Handling Patterns

### 1. Consistent Error Response Shape

```typescript
// Always return this shape
type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Or simpler for mutations
type MutationResult = { ok: true } | { ok: false; error: string };
```

### 2. Zod Error Formatting

```typescript
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map(issue => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
}
```

### 3. Logging Errors (Server-Side Only)

```typescript
// ✅ GOOD - Log on server
catch (error) {
  console.error("Action failed:", error); // Server-side logging
  return { ok: false, error: "Something went wrong" };
}

// ❌ BAD - Expose error details to client
catch (error) {
  return { ok: false, error: error.message }; // Leaks internals
}
```

## Revalidation Patterns

| Action      | Revalidate                           |
| ----------- | ------------------------------------ |
| Create item | List pages, detail pages             |
| Update item | List pages, detail pages, cache tags |
| Delete item | List pages, cached data              |
| Auth change | All authenticated pages              |

```typescript
// Single path
revalidatePath("/dashboard");

// Pattern matching
revalidatePath("/users/*");

// Cache tags (Next.js 16)
revalidateTag("users");
```

## Best Practices

1. **Always validate input** with Zod
2. **Return consistent shapes** `{ ok: boolean; error?: string }`
3. **Check auth before mutations**
4. **Revalidate affected paths** after changes
5. **Log errors server-side**, never expose to client
6. **Use `useActionState`** for form submissions
7. **Keep actions focused** - one action per mutation

## Example Prompts for This Skill

- "Create a Server Action for user registration with Zod validation"
- "Add authorization check to the delete post action"
- "Implement optimistic updates for the comment form"
- "Add revalidation to the create product action"
- "Fix the Server Action error handling pattern"
