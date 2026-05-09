# Backend

## Rules

- Server Actions handle all mutations (not API routes)
- All server actions must validate session with `auth()` before processing
- Return typed responses: `{ ok: boolean; error?: string; ... }`
- Use DAL classes for database operations
- Log all operations with appropriate context

## Tech Stack

| Category      | Technology               |
| ------------- | ------------------------ |
| Runtime       | Node.js / Bun            |
| Auth          | NextAuth v4              |
| Database      | PostgreSQL + Drizzle ORM |
| External APIs | Plaid SDK, Dwolla SDK    |

## Examples

### Server Action with Auth Check

```typescript
// src/actions/transfer.actions.ts
"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { transferDal } from "@/dal";
import { walletDal } from "@/dal";

const TransferSchema = z.object({
  amount: z.string().transform(Number).pipe(z.number().positive()),
  recipientId: z.string().uuid(),
  sourceWalletId: z.string().uuid()
});

export async function createTransferAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = TransferSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, ok: false };
  }

  logger.info("createTransfer started", { userId: session.user.id });
  // ... implementation
}
```

### External API Integration

```typescript
// src/lib/plaid/index.ts
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV ?? "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
});

export const plaidClient = new PlaidApi(config);
```

## Dependencies

```json
{
  "bcrypt": "^5.1.0",
  "drizzle-orm": "^0.40.0",
  "dwolla-rest-client": "^2.0.0",
  "next": "^16.0.0",
  "next-auth": "^4.24.0",
  "pino": "^9.0.0",
  "pino-pretty": "^11.0.0",
  "plaid": "^23.0.0",
  "postgres": "^3.4.0",
  "zod": "^3.24.0"
}
```
