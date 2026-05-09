# Anti-Patterns to Avoid

## Error Handling

### ❌ Throwing from Actions

```typescript
// BAD - throws propagate to server rendering
async function getData() {
  throw new Error("Failed");
}
```

### ✅ Return Stable Error Shapes

```typescript
// GOOD
async function getData() {
  try {
    return { ok: true, data: await db.query() };
  } catch (e) {
    logger.error("getData failed:", e);
    return { error: "Failed", ok: false };
  }
}
```

## Environment Access

### ❌ Direct `process.env` Access

```typescript
// BAD - no validation, inconsistent access
const apiKey = process.env.PLAID_CLIENT_ID;
```

### ✅ Use env.ts Wrapper

```typescript
// GOOD - validated, typed access
import { plaid } from "@/app-config";
// or
import { env } from "@/lib/env";
```

## Type Safety

### ❌ Using `any` Type

```typescript
// BAD - 94 uses of `any` found in codebase
function processData(data: any) {
  return data.value; // No type safety
}
```

### ✅ Use Proper Types

```typescript
// GOOD - strong typing
function processData(data: Transaction) {
  return data.amount;
}
```

## Database

### ❌ Raw SQL in Test Helpers

```typescript
// BAD - SQL injection risk
await db.execute(`DELETE FROM users WHERE id = '${id}'`);
```

### ✅ Use Parameterized Queries

```typescript
// GOOD - safe via ORM
await db.delete(users).where(eq(users.id, id));
```

## E2E Tests

### ❌ Debug Logs in Auth Actions

```typescript
// BAD - info disclosure in production
console.log("User credentials:", email, password);
```

### ✅ Use Structured Logger

```typescript
// GOOD - controlled logging
logger.debug("Auth attempt", { email: email.slice(0, 3) + "***" });
```

## Soft Delete

### ❌ Hard Deleting Data

```typescript
// BAD - permanent data loss
await db.delete(users).where(eq(users.id, id));
```

### ✅ Soft Delete

```typescript
// GOOD - recoverable
await db
  .update(users)
  .set({ deletedAt: new Date() })
  .where(eq(users.id, id));
```

## State Management

### ❌ Direct Zustand `create()` (Breaks SSR)

```typescript
// BAD - hydration mismatch
export const useStore = create(set => ({
  count: 0
}));
```

### ✅ Factory Pattern with `createStore`

```typescript
// GOOD - SSR safe
export function createUIStore() {
  return createStore<UIStore>()(set => ({
    count: 0
  }));
}
```

## Imports

### ❌ Deep Relative Paths

```typescript
// BAD - fragile
import { util } from "../../../../../lib/utils";
```

### ✅ Path Aliases

```typescript
// GOOD - clear and stable
import { cn } from "@/lib/utils";
```
