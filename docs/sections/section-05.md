# Section 5 — Server Actions

Server Actions must validate inputs with Zod, call `auth()` for protected actions, and use DAL for DB writes. Return a consistent shape: { ok: boolean; error?: string }.

Example:

```ts
"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const Schema = z.object({
  id: z.string().uuid().describe("Resource ID")
});

export async function exampleAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };
  const parsed = Schema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.message };
  // DB work via DAL
  return { ok: true };
}
```
