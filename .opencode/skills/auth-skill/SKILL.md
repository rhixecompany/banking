---
name: auth-skill
description: NextAuth v4 authentication patterns, session helper, and protected route guidance.
lastReviewed: 2026-04-13
---

# auth-skill — Authentication Patterns

Overview

Auth uses NextAuth v4 with `jwt` strategy. Use the `auth()` server helper to obtain sessions inside Server Actions.

Session Shape

- `session.user` includes `{ id: string; name?: string; email?: string; isAdmin: boolean; isActive: boolean }`.

Server Action Example

```ts
import { auth } from "@/auth";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  if (!session.user.isActive)
    return { ok: false, error: "AccountDeactivated" };
  return { ok: true };
}
```

Validation

- `npm run type-check`
