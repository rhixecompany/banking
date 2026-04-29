---
name: plaid-skill
description: >-
  Plaid API integration for bank account linking, transaction retrieval, and balance fetching. Use when implementing bank connections, linking accounts, fetching transactions, or managing Plaid integration. Triggers include requests to "link bank", "connect account", "fetch transactions", "get balance", or any Plaid-related task.
lastReviewed: 2026-04-24
applyTo: "lib/plaid.ts", "actions/**/*.{ts,tsx}"
---

# Plaid Skill — Plaid Integration Patterns

Comprehensive patterns for integrating Plaid API in the Banking app.

## When to Use This Skill

- Creating Plaid Link tokens
- Exchanging public tokens for access tokens
- Fetching transactions from connected accounts
- Getting account balances
- Managing Plaid items
- Implementing bank account linking

## Multi-Agent Commands

### OpenCode / Cursor / Copilot
```bash
# Check Plaid configuration
cat lib/plaid.ts

# Run type check
bun run type-check

# Run tests
bun run test:browser
```

## Core Integration

### Plaid Client Setup

```typescript
// lib/plaid.ts
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { appConfig } from './app-config';

const configuration = new Configuration({
  basePath: PlaidEnvironments[appConfig.plaidEnv], // sandbox/development/production
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': appConfig.plaidClientId,
      'PLAID-SECRET': appConfig.plaidSecret,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
```

### Mock Token Detection

The app uses mock tokens to skip Plaid API calls in tests:

```typescript
// lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  const t = token.toLowerCase();
  return (
    t.startsWith('seed-') ||
    t.startsWith('mock-') ||
    t.startsWith('mock_')
  );
}
```

## Creating Link Token

### Server Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";

export async function createLinkTokenAction() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: session.user.id },
      client_name: "Banking App",
      products: ["transactions", "auth"],
      country_codes: ["US"],
      language: "en",
    });

    return { ok: true, linkToken: response.data.link_token };
  } catch (error) {
    console.error("Link token creation failed:", error);
    return { ok: false, error: "LinkTokenFailed" };
  }
}
```

## Exchanging Public Token

### Server Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { walletDal } from "@/dal/wallet.dal";
import { encrypt } from "@/lib/encryption";
import { isMockAccessToken } from "@/lib/plaid";

export async function exchangePublicToken(input: { publicToken: string }) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    // Skip actual API call for mock tokens
    let accessToken: string;

    if (isMockAccessToken(input.publicToken)) {
      accessToken = input.publicToken;
    } else {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: input.publicToken,
      });
      accessToken = response.data.access_token;
    }

    // Get account info
    let accountId: string | undefined;
    if (!isMockAccessToken(accessToken)) {
      const authResponse = await plaidClient.authGet({
        access_token: accessToken,
      });
      accountId = authResponse.data.accounts[0]?.account_id;
    }

    // Store encrypted access token
    await walletDal.create({
      userId: session.user.id,
      accessToken: encrypt(accessToken),
      accountId,
    });

    return { ok: true };
  } catch (error) {
    console.error("Token exchange failed:", error);
    return { ok: false, error: "ExchangeFailed" };
  }
}
```

## Fetching Transactions

### Server Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { walletDal } from "@/dal/wallet.dal";
import { transactionDal } from "@/dal/transaction.dal";
import { decrypt } from "@/lib/encryption";
import { isMockAccessToken } from "@/lib/plaid";

export async function syncTransactionsAction() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // Get user's wallets (Plaid items)
  const wallets = await walletDal.findByUserId(session.user.id);
  if (wallets.length === 0) {
    return { ok: false, error: "NoLinkedAccounts" };
  }

  const results = [];

  for (const wallet of wallets) {
    const accessToken = decrypt(wallet.accessToken);

    // Skip API call for mock tokens
    if (isMockAccessToken(accessToken)) {
      // Return mock transactions for testing
      results.push({ walletId: wallet.id, mock: true });
      continue;
    }

    try {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      // Save transactions to database
      for (const transaction of response.data.added) {
        await transactionDal.create({
          walletId: wallet.id,
          plaidTransactionId: transaction.transaction_id,
          amount: transaction.amount,
          date: new Date(transaction.date),
          name: transaction.name,
          category: transaction.category?.[0],
        });
      }

      results.push({
        walletId: wallet.id,
        added: response.data.added.length,
        modified: response.data.modified.length,
        removed: response.data.removed.length,
      });
    } catch (error) {
      console.error(`Transaction sync failed for wallet ${wallet.id}:`, error);
      results.push({ walletId: wallet.id, error: true });
    }
  }

  return { ok: true, results };
}
```

## Getting Balances

### Server Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { walletDal } from "@/dal/wallet.dal";
import { decrypt } from "@/lib/encryption";
import { isMockAccessToken } from "@/lib/plaid";

export async function getBalancesAction() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const wallets = await walletDal.findByUserId(session.user.id);
  const balances = [];

  for (const wallet of wallets) {
    const accessToken = decrypt(wallet.accessToken);

    if (isMockAccessToken(accessToken)) {
      balances.push({
        walletId: wallet.id,
        available: 1000.00,
        current: 1000.00,
        mock: true,
      });
      continue;
    }

    try {
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
      });

      const account = response.data.accounts[0];
      balances.push({
        walletId: wallet.id,
        available: account.balances.available,
        current: account.balances.current,
        currency: account.balances.iso_currency_code,
      });
    } catch (error) {
      console.error(`Balance fetch failed for wallet ${wallet.id}:`, error);
      balances.push({ walletId: wallet.id, error: true });
    }
  }

  return { ok: true, balances };
}
```

## Removing Plaid Item

### Server Action

```typescript
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { walletDal } from "@/dal/wallet.dal";
import { decrypt } from "@/lib/encryption";
import { isMockAccessToken } from "@/lib/plaid";

export async function unlinkAccountAction(input: { walletId: string }) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  const wallet = await walletDal.findById(input.walletId);
  if (!wallet || wallet.userId !== session.user.id) {
    return { ok: false, error: "NotFound" };
  }

  const accessToken = decrypt(wallet.accessToken);

  // Remove from Plaid (skip for mock tokens)
  if (!isMockAccessToken(accessToken)) {
    try {
      await plaidClient.itemRemove({
        access_token: accessToken,
      });
    } catch (error) {
      console.error("Plaid item removal failed:", error);
      // Continue to remove from DB anyway
    }
  }

  // Remove from database
  await walletDal.delete(input.walletId);

  return { ok: true };
}
```

## Security Considerations

### Encryption

Always encrypt access tokens before storing:

```typescript
// lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = process.env.ENCRYPTION_KEY!;

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

### Never Expose to Client

- Access tokens never sent to client
- All Plaid operations happen server-side
- Link token created server-side, used client-side only

## Testing with Mocks

### Unit Test Pattern

```typescript
import { describe, it, expect, vi } from 'vitest';
import { exchangePublicTokenAction } from '@/actions/plaid';

vi.mock('@/lib/plaid', () => ({
  plaidClient: {
    itemPublicTokenExchange: vi.fn().mockResolvedValue({
      data: { access_token: 'mock-access-token' }
    })
  },
  isMockAccessToken: vi.fn().mockReturnValue(false)
}));

describe('exchangePublicTokenAction', () => {
  it('should exchange token successfully', async () => {
    const result = await exchangePublicTokenAction({
      publicToken: 'public-token-123'
    });
    expect(result.ok).toBe(true);
  });
});
```

### Mock Token Usage

```typescript
// Use mock tokens to skip Plaid API calls
const mockToken = "seed-access-token-123";

if (isMockAccessToken(mockToken)) {
  // Skip actual API calls, return mock data
}
```

## Error Handling

| Error Code | Meaning |
|------------|---------|
| `LinkTokenFailed` | Failed to create Plaid Link token |
| `ExchangeFailed` | Failed to exchange public token |
| `SyncFailed` | Failed to sync transactions |
| `BalanceFailed` | Failed to fetch balances |
| `NoLinkedAccounts` | User has no linked bank accounts |

## Cross-References

- **auth-skill**: For authentication in Plaid actions
- **dal-skill**: For wallet and transaction DAL
- **server-action-skill**: For Server Action patterns
- **testing-skill**: For testing Plaid integration

## Validation

```bash
# Type check
bun run type-check

# Run tests
bun run test:browser

# Lint
bun run lint:strict
```