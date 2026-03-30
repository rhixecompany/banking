---
name: PlaidSkill
description: Plaid API integration for bank account linking, transaction retrieval, and balance fetching in the Banking app. Use when working with PlaidLink, bank connections, or financial data.
---

# PlaidSkill - Banking Plaid Integration

## Overview

This skill provides guidance on Plaid API integration for the Banking project.

## Key Patterns

### PlaidLink Setup

```typescript
// components/plaid-link.tsx
"use client";

import { usePlaidLink } from "react-plaid-link";
import { useState } from "react";

export function PlaidLinkButton({ userId, onSuccess }: { userId: string; onSuccess: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Fetch link token from server action
  useEffect(() => {
    async function fetchLinkToken() {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      });
      const data = await response.json();
      setLinkToken(data.linkToken);
    }
    fetchLinkToken();
  }, [userId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      await fetch("/api/plaid/exchange-token", {
        method: "POST",
        body: JSON.stringify({ publicToken: public_token, metadata }),
      });
      onSuccess();
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </button>
  );
}
```

### Server Action - Link Bank

```typescript
// lib/actions/plaid.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { bankDal } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export async function linkBankAccount(
  publicToken: string,
  metadata: PlaidLinkMetadata
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get institution info
    const institutionResponse =
      await plaidClient.institutions.getById({
        institution_id: metadata.institution.institution_id,
        country_codes: ["US"]
      });

    // Save to database (encrypt access token first!)
    await bankDal.create({
      userId: session.user.id,
      accessToken: encrypt(accessToken), // Use lib/encryption.ts
      itemId,
      institutionId: metadata.institution.institution_id,
      institutionName: institutionResponse.data.institution.name
    });

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("Plaid link error:", error);
    return { ok: false, error: "Failed to link bank account" };
  }
}
```

### Fetch Transactions

```typescript
// lib/dal/transaction.dal.ts
async function getTransactionsFromPlaid(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const response = await plaidClient.transactionsGet({
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate
  });

  return response.data.transactions;
}
```

## Environment Variables

Required in `lib/env.ts`:

- `PLAID_CLIENT_ID`
- `PLAID_SECRET`
- `PLAID_ENV` (sandbox/development/production)

## Security

1. **NEVER** store PLAID_ACCESS_TOKEN in plain text - use `lib/encryption.ts` (AES-256-GCM)
2. Access tokens should be encrypted at rest
3. Use environment-specific secrets for each environment

## Validation

Run: `npm run type-check` and `npm run test:browser`

## Common Issues

1. **Sandbox testing** - Use Plaid Sandbox credentials for testing
2. **Item expired** - Handle `ITEM_LOGIN_REQUIRED` error with re-authentication flow
3. **Transaction sync** - Implement webhook handlers for real-time updates
