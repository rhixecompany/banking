# Types

## Rules

- Define types in `src/types/` directory — one file per domain concept
- Use `type` for unions/intersections, `interface` for object shapes with extensions
- Avoid `any` — use `unknown` when type is truly unknown, then narrow with type guards
- Export type definitions from a central location when they cross module boundaries
- Use Drizzle's `typeof` helper to derive types from schema for DB row types

## Examples

### Domain Types

```typescript
// src/types/user.ts
import type { User as DBUser } from "@/database/schema";
import type { UserProfile as DBProfile } from "@/database/schema";

export type User = Pick<
  DBUser,
  "id" | "email" | "name" | "createdAt"
>;

export type UserProfile = Pick<
  DBProfile,
  "address" | "city" | "phone" | "ssnEncrypted"
>;

export type UserWithProfile = User & { profile?: UserProfile };
```

### Action Return Types

```typescript
// src/actions/register.ts
export async function registerUser(input: unknown): Promise<{
  ok: boolean;
  user?: UserWithProfile;
  error?: string;
}> {
  // ...
}
```

### Form Data Types

```typescript
// src/types/forms.ts
export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = SignInFormData & {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  phone?: string;
};
```

## Anti-patterns

### Don't Use `any`

```typescript
// BAD: any bypasses type safety
function processData(data: any) {
  return data.id; // No type checking
}

// GOOD: Use unknown with narrowing
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "id" in data) {
    return (data as { id: string }).id;
  }
}
```

### Don't Duplicate Type Definitions

```typescript
// BAD: Defining same shape in multiple places
interface User {
  id: string;
  email: string;
}
interface AdminUser {
  id: string;
  email: string;
  role: string;
}

// GOOD: Use composition
type User = { id: string; email: string };
type AdminUser = User & { role: string };
```
