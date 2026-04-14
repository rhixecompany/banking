# Section 6 — DAL Patterns

- All DB access must go through `dal/` helpers.
- Avoid N+1 queries; use JOINs and eager loading.

Example DAL method (Drizzle):

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
