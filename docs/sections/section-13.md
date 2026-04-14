# Section 13 — Caching & Revalidation

Use Next.js revalidatePath, revalidateTag, or updateTag for cache invalidation in Server Actions. Prefer updateTag for immediate changes and revalidateTag for background invalidation.

Example:

```ts
import { revalidatePath } from "next/cache";

export async function mutate() {
  // ... mutate
  revalidatePath("/my-wallets");
}
```
