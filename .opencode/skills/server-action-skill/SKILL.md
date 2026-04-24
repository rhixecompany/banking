---
name: server-action-skill
description: Patterns and examples for Next.js Server Actions in the Banking app.
lastReviewed: 2026-04-24
applyTo: "app/**/*.{ts,tsx}"
---

# ServerActionSkill — Server Actions

Overview

Server Actions are the only allowed place for stateful mutations. Follow these rules: validate input with Zod, guard auth with `auth()`, perform DB operations through `dal/`, and revalidate caches after changes.

Quick Example

```ts
"use server";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).meta({ description: "Display name" })
});

export async function updateProfile(input: unknown) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = Schema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };

  await userDal.update(session.user.id, parsed.data);
  revalidatePath("/profile");
  return { ok: true };
}
```

Rules

- Return shape: `{ ok: boolean; error?: string }`.
- Always validate inputs on the server.
- Use `dal/` for DB access and avoid queries in loops (no N+1).
- Use `revalidatePath` / `revalidateTag` after mutations.

Validation

- `npm run type-check`
- `npm run lint:strict`
