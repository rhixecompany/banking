# Drizzle ORM Guide: Toggling a Boolean Field

## Overview

- Use `update().set()` with `not()` to toggle a boolean column.
- MySQL uses `tinyint(1)`, SQLite uses `0/1` for booleans.

## Example

```ts
import { eq, not } from 'drizzle-orm';
const db = drizzle(...);
await db.update(table).set({ isActive: not(table.isActive) }).where(eq(table.id, 1));
```

```sql
update "table" set "is_active" = not "is_active" where "id" = 1;
```

Note: No native boolean type in MySQL/SQLite; use integer representation.
