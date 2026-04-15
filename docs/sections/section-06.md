# Section 6 — DAL Patterns

- Route all DB access through `dal/` helpers; avoid ad-hoc queries in components.
- Prevent N+1 by using JOINs or batching with `IN` when fetching related data.

Example (Drizzle):

```ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";

export async function findByEmail(email: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
}
```
