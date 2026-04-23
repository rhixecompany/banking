---
name: "nextjs-patterns"
description: "Next.js patterns, App Router, Cache Components, and Server Actions"
applyTo: "**/*.{ts,tsx}"
priority: 2
lastReviewed: 2026-04-13
---

# Next.js Patterns - Banking Project

Agentic note: These patterns assume Next.js 16+ and the app-router. Confirm with package.json if in doubt.

## Tech Stack

- Next.js 16 (App Router)
- React Compiler enabled
- Cache Components enabled

Note: Confirm exact version numbers in package.json before asserting specific minor/patch versions. AGENTS.md is the canonical guidance; instruction files should avoid hard-coded versions and instead reference the detected version in the evidence map.

## Server vs Client Components

### Server Components (Default)

Use for data fetching, heavy logic, and non-interactive UI.

```tsx
import { userDal } from "@/dal";

export default async function Dashboard() {
  const user = await userDal.findById("123");
  return <div>Welcome, {user.name}</div>;
}
```

### Client Components

Add "use client" at the top for interactivity:

```tsx
"use client";

import { useState } from "react";
import { createUser } from "@/actions/user.actions";

export function UserForm() {
  const [loading, setLoading] = useState(false);
  return <form>...</form>;
}
```

## Server Actions Pattern

All mutations must use Server Actions; avoid API routes for write logic.

```typescript
"use server";

import { z } from "zod";
import { userDal } from "@/dal";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

export async function createUser(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    await userDal.create(parsed.data);
    revalidatePath("/users");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to create user" };
  }
}
```

Note: Server Actions should return a consistent shape (Promise<{ ok: boolean; error?: string }>) and validate inputs with Zod before any DB or external API calls.

## Cache Components (Next.js 16)

Use "use cache" directive for memoization:

```typescript
"use cache";
cacheLife("hours");

export default async function MyBanksPage() {
  const banks = await getUserBanks();
  return <BankList banks={banks} />;
}
```

### Cache Revalidation

```typescript
import { revalidateTag } from "next/cache";
import { unstable_updateTag as updateTag } from "next/cache";

// Use updateTag in Server Actions for immediate cache invalidation
updateTag("banks");

// Use revalidateTag for background stale-while-revalidate
revalidateTag("banks");
```

## Suspense Boundaries

Wrap async content in Suspense:

```tsx
import { Suspense } from "react";
import { UserListSkeleton } from "./skeletons";

export default function Page() {
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserList />
    </Suspense>
  );
}
```

## Async Request APIs

In Next.js 16, these are async:

```typescript
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const headersList = await headers();
  // ...
}
```

## Project Structure

```
app/
├── (auth)/           # Auth routes
├── (root)/           # Protected routes
│   ├── dashboard/
│   ├── settings/
│   └── transaction-history/
├── api/              # API routes (minimal)
└── layout.tsx

lib/
├── actions/          # Server Actions
├── dal/              # Data Access Layer
├── auth.ts           # auth() helper
└── env.ts            # Zod env validation
```

See: .opencode/skills/server-action-skill/SKILL.md

// Shortened and clarified for consistency with regenerated instruction templates.
