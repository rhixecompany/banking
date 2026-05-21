# Server Actions Patterns

## Rules

1. Always add `"use server"` at the top
2. Validate inputs with Zod schemas
3. Return stable error shapes: `{ ok, data?, error? }`
4. Log errors with `logger.error()`
5. Authenticate with `auth()` from `@/lib/auth`

## Server Action Structure

```typescript
"use server";

import { z } from "zod";

import type { Transaction } from "@/types/transaction";
import { transactionDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

// 1. Define Zod schema at module level
const ActionSchema = z.object({
  param: z.string().trim().min(1, "Required")
});

// 2. Define the action function
export async function doSomething(input: unknown) {
  // 3. Validate input
  const parsed = ActionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, ok: false };
  }

  try {
    // 4. Authenticate
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated", ok: false };
    }

    // 5. Perform action
    const result = await someDalMethod(parsed.data);
    return { ok: true, data: result };
  } catch (error) {
    // 6. Log and return stable error
    logger.error("doSomething error:", error);
    return { error: "Action failed", ok: false };
  }
}
```

## Server/Client Wrapper Pattern

### Server Wrapper (Fetches Data)

```typescript
// src/components/sign-in/sign-in-server-wrapper.tsx
import { auth } from "@/lib/auth";
import SignInClient from "./SignInClient";

export default async function SignInServerWrapper() {
  const session = await auth();
  return <SignInClient session={session} />;
}
```

### Client Wrapper (Handles Interaction)

```typescript
// src/components/sign-in/sign-in-client-wrapper.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations/auth";

export default function SignInClientWrapper() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: unknown) {
    const result = await signInAction(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return <SignInForm form={form} onSubmit={onSubmit} />;
}
```

## Pass Actions via Props

### Don't import server actions in client components

```typescript
// Server wrapper passes action as prop
interface Props {
  createTransfer?: (input: unknown) => Promise<{
    ok: boolean;
    transferUrl?: string;
    error?: string;
  }>;
}

// Client uses the prop instead of importing
export function PaymentTransferClient({ createTransfer }: Props) {
  async function handleSubmit(data: unknown) {
    const result = await createTransfer?.(data);
    // ...
  }
}
```
