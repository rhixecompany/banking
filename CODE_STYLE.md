# Code Style Guide

## Naming Conventions

### Files

| Type | Convention | Example |
| --- | --- | --- |
| Config | kebab-case | `next.config.ts`, `drizzle.config.ts` |
| Hooks | camelCase | `usePagination.ts`, `useAuth.ts` |
| Types | PascalCase | `User.ts`, `Transaction.ts`, `Wallet.ts` |
| Components | PascalCase | `Sidebar.tsx`, `Header.tsx` |
| Stores | camelCase | `useUIStore.ts` |
| Server Actions | dot.camelCase | `auth.signin.ts`, `transaction.actions.ts` |
| DAL | dot.camelCase | `user.dal.ts`, `transaction.dal.ts` |
| Schemas | PascalCase | `TransferSchema.ts` |

### Functions

- **Regular functions**: camelCase

  ```typescript
  export function cn(...classes: ClassValue[]) {}
  export function formatAmount(amount: number) {}
  export async function signin(credentials: SignInCredentials) {}
  ```

- **React components**: PascalCase

  ```tsx
  export function SidebarProvider({
    children
  }: SidebarProviderProps) {}
  export function WalletCard({ wallet }: WalletCardProps) {}
  ```

- **Hooks**: camelCase with `use` prefix (or PascalCase for exported)
  ```typescript
  export function usePagination(props: UsePaginationProps) {}
  function useSidebar() {}
  ```

### Variables

- **Local variables**: camelCase

  ```typescript
  const currentPage = 1;
  const { email, password } = parsed.data;
  ```

- **Constants**: SCREAMING_SNAKE_CASE
  ```typescript
  const SIDEBAR_COOKIE_NAME = "sidebar_state";
  const MAX_TRANSFER_AMOUNT = 10000;
  ```

### Types

- **Interfaces/Types**: PascalCase

  ```typescript
  interface UserProfile {}
  type Transaction = {};
  export interface WalletWithDetails {}
  ```

- **Zod Schemas**: PascalCase with `Schema` suffix
  ```typescript
  const SignInSchema = z.object({ ... });
  const TransferSchema = z.object({ ... });
  ```

### Classes

- **Classes**: PascalCase
  ```typescript
  export class UserDal {}
  export class WalletDal {}
  ```

## File Organization

### Server Actions (`src/actions/`)

```typescript
// Named export for utilities, default for main action
export function helper() {}
export default async function mainAction(data: Input) {
  // 1. Validate input with Zod
  // 2. Authenticate user
  // 3. Perform operation
  // 4. Return { ok: boolean, error?: string, ...data }
}
```

### DAL Files (`src/dal/`)

```typescript
// Constructor-based DAL class
export class UserDal {
  constructor(private db: DB) {}

  async findById(id: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }
}

// Barrel export from index.ts
export { userDal } from "./user.dal";
```

### Components (`src/components/`)

```typescript
// Component with props interface
interface ComponentNameProps {
  className?: string;
  children: React.ReactNode;
}

export function ComponentName({ className, children }: ComponentNameProps) {
  return <div className={className}>{children}</div>;
}
```

## Import Style

### Group order (1. External, 2. Internal, 3. Local)

```typescript
// 1. React/Next
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. Library imports
import { useForm } from "react-hook-form";
import { z } from "zod";

// 3. Internal (paths use aliases)
import { db } from "@/database/db";
import { users } from "@/database/schema";

// 4. Local components
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### Path Aliases

```typescript
@/           → src/
@/actions/   → src/actions/
@/components → src/components/
@/lib        → src/lib/
@/types      → src/types/
@/dal        → src/dal/
@/database   → src/database/
```

## Code Patterns

### Server Action Response Pattern

```typescript
export default async function actionName(input: Input) {
  try {
    // 1. Validate
    const parsed = Schema.parse(input);

    // 2. Authorize
    const session = await getServerSession(authOptions);
    if (!session?.user) return { ok: false, error: "Unauthorized" };

    // 3. Execute
    const result = await performOperation(parsed);

    // 4. Return success
    return { ok: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { ok: false, error: error.errors[0].message };
    }
    console.error("Action error:", error);
    return { ok: false, error: "Internal error" };
  }
}
```

### Zod Schema Definition

```typescript
import { z } from "zod";

const ActionSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be at least $1")
    .max(10000, "Amount cannot exceed $10,000"),
  recipientId: z.string().cuid("Invalid recipient")
});

export type ActionInput = z.infer<typeof ActionSchema>;
```

### Soft Delete Query Pattern

```typescript
// DAL always filters deletedAt
async findById(id: string) {
  return this.db.query.users.findFirst({
    where: and(
      eq(users.id, id),
      isNull(users.deletedAt)  // Always exclude soft-deleted
    ),
  });
}
```

### Idempotency Key Pattern

```typescript
import { crypto } from "crypto";

// Generate before mutation
const idempotencyKey = crypto.randomUUID();

// Use in API call
const result = await dwollaClient.transfer({
  idempotencyKey
  // ...params
});
```

## Error Handling

### Action Errors

```typescript
// Return structured errors
return { ok: false, error: "Descriptive message" };

// Or throw for top-level handling
throw new Error("Operation failed");
```

### try/catch in Components

```typescript
try {
  await mutate();
} catch (error) {
  toast.error(error instanceof Error ? error.message : "Failed");
}
```

## Logging

### Use `console.error` for errors (deployed logs elsewhere)

```typescript
// In actions
console.error("Transfer failed:", error);

// In API routes
console.error("Webhook error:", error);
```

### Debug logging (dev only)

```typescript
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}
```

## Testing

### File Structure

```
src/
├── tests/
│   ├── unit/
│   │   ├── actions.test.ts
│   │   └── utils.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       └── transfer.spec.ts
```

### Test Patterns

```typescript
// Unit test
describe("transferMoney", () => {
  it("validates amount", async () => {
    const result = await transferMoney({ amount: 0 });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Amount");
  });
});
```

### Run Tests

```bash
bun run test        # Unit tests
bun run test:unit   # Unit tests only
bun run test:e2e   # E2E tests (Playwright)
```

## Security

- **Never expose secrets**: Use `lib/env.ts` for env access, never `process.env` directly
- **Encrypt tokens**: Plaid `access_token` and Dwolla tokens stored via encryption utilities
- **Validate input**: All server action inputs must use Zod schemas
- **Authorize mutations**: Always check session before any write operation
- **Use idempotency keys**: Required for all financial operations to prevent duplicates

## Related Documentation

- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design and component overview
- **Agent Guidance**: See [AGENTS.md](./AGENTS.md) for authoritative development rules and patterns
- **Consolidated Guides**: See `/docs/` directory:
  - `docs/DrizzleORMGuide.md` — Drizzle ORM patterns
  - `docs/PlaidIntegrationGuide.md` — Plaid integration
  - `docs/DwollaIntegrationGuide.md` — Dwolla ACH transfers
  - `docs/DockerGuide.md` — Containerization

## Do's and Don'ts

### Do

- Use Zod schemas for input validation in actions
- Return `{ ok, error?, data? }` from server actions
- Use path aliases (`@/lib/utils`)
- Filter `deletedAt IS NULL` in all DAL queries
- Use idempotency keys for financial operations
- Encrypt sensitive tokens (Plaid, Dwolla)
- Use `bun` as package manager (never `npm`/`yarn`/`pnpm`)

### Don't

- Don't use `console.log` in production code
- Don't expose raw database errors to client
- Don't skip validation in API routes
- Don't hardcode environment variables
- Don't perform mutations without authorization checks
- Don't import `db` directly in components/actions — use DAL classes
