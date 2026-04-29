---
name: dwolla-skill
description: Dwolla API integration for ACH transfers, payment processing, and bank account verification in the Banking app.
lastReviewed: 2026-04-24
applyTo: "lib/**/*.{ts,js,md}"
---

# DwollaSkill — Dwolla Integration Patterns

Overview

This SKILL documents how the app integrates with Dwolla for ACH transfers, funding-source management, and webhook handling. Keep sensitive flows inside Server Actions and never log secrets.

When to use

- Implementing transfers, funding-source creation, or customer management that interacts with Dwolla.
- Writing webhook handlers for Dwolla events.

Canonical Patterns

- Server Actions live in `actions/`. Use `@/actions/dwolla.actions` for imports in examples.
- All DB writes must go through `dal/`.
- Never store raw API keys or access tokens in plaintext — use `lib/encryption.ts` to encrypt secrets at rest.

Example — Create Dwolla Customer (Server Action)

```ts
"use server";
import { auth } from "@/lib/auth";
import { dwollaClient } from "@/lib/dwolla";
import { recipientDal } from "@/dal";

export async function createDwollaCustomer(input: unknown) {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  // validate input (zod omitted for brevity)

  const resp = await dwollaClient.post("customers", {
    /* payload */
  });
  const location = resp.headers.get("location");
  await recipientDal.updateDwollaCustomerId(
    session.user.id,
    location
  );
  return { ok: true };
}
```

Webhooks

- Verify signatures using `app-config.ts` (preferred) or `lib/env.ts` secrets and the Dwolla SDK. Keep webhook routes minimal and idempotent.

Environment

- Add DWOLLA_KEY, DWOLLA_SECRET, DWOLLA_ENV, DWOLLA_BASE_URL to `app-config.ts` (preferred) or `lib/env.ts`.

Validation

- Run: `bun run type-check` and `bun run test:browser`

Notes

- Follow rate-limit best practices and exponential backoff for retries.
- Keep examples and implementation consistent with `actions/` and `dal/` conventions.
