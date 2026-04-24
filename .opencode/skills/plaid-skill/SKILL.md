---
name: plaid-skill
description: Plaid API integration for bank account linking, transaction retrieval, and balance fetching.
lastReviewed: 2026-04-24
applyTo: "lib/plaid.ts", "actions/**/*.{ts,tsx}"
---

# PlaidSkill — Plaid Integration Patterns

Overview

Guidance for safely integrating Plaid Link, exchanging public tokens, and storing access tokens (encrypted). Use Server Actions for sensitive operations and `dal/` for DB access. This skill references the repo's actual DAL structure: `wallet.dal.ts` for Plaid item storage.

When to use

- Creating Plaid link tokens and exchanging public tokens.
- Fetching transactions or balances from Plaid.

Canonical Example — Server Action (exchange public token)

```ts
"use server";
import { auth } from "@/lib/auth";
import { plaidClient } from "@/lib/plaid";
import { walletDal } from "@/dal/wallet.dal";
import { encrypt } from "@/lib/encryption";

export async function exchangePublicToken(input: {
  publicToken: string;
}) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const resp = await plaidClient.itemPublicTokenExchange({
    public_token: input.publicToken
  });
  const accessToken = resp.data.access_token;

  await walletDal.create({
    userId: session.user.id,
    accessToken: encrypt(accessToken)
  });
  return { ok: true };
}
```

Security

- Encrypt access tokens before storing. Use `lib/encryption.ts`.
- Do not expose access tokens to the client.

Validation

- Run: `npm run type-check` and `npm run test:browser`
