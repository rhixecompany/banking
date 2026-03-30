---
name: DwollaSkill
description: Dwolla API integration for ACH transfers, payment processing, and bank account verification in the Banking app. Use when working with transfers, ACH, or payment flows.
---

# DwollaSkill - Banking ACH Transfers

## Overview

This skill provides guidance on Dwolla API integration for ACH transfers in the Banking project.

## Key Patterns

### Create Customer

```typescript
// lib/actions/dwolla.actions.ts
"use server";

import { dwollaClient } from "@/lib/dwolla";
import { recipientDal } from "@/lib/dal";

export async function createDwollaCustomer(
  userId: string,
  email: string,
  name: string
) {
  const response = await dwollaClient.post("customers", {
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1] || "",
    email,
    type: "personal"
  });

  const customerUrl = response.headers.get("location");
  await recipientDal.updateDwollaCustomerId(userId, customerUrl);

  return customerUrl;
}
```

### Add Funding Source (Micro-deposits)

```typescript
export async function addFundingSource(
  customerUrl: string,
  routingNumber: string,
  accountNumber: string
) {
  const response = await dwollaClient.post(
    `${customerUrl}/funding-sources`,
    {
      routingNumber,
      accountNumber,
      type: "checking",
      name: "Primary Checking"
    }
  );

  return response.headers.get("location");
}
```

### Initiate Transfer

```typescript
export async function initiateTransfer(
  fromFundingSourceUrl: string,
  toFundingSourceUrl: string,
  amount: number
) {
  const response = await dwollaClient.post("transfers", {
    _links: {
      source: { href: fromFundingSourceUrl },
      destination: { href: toFundingSourceUrl }
    },
    amount: {
      currency: "USD",
      value: amount.toFixed(2)
    }
  });

  return response.headers.get("location");
}
```

### Webhook Handler

```typescript
// app/api/webhooks/dwolla/route.ts
import { dwollaClient } from "@/lib/dwolla";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("x-dwolla-signature");

  // Verify webhook signature
  const isValid = dwollaClient.webhookVerify(
    {
      "x-dwolla-signature": signature,
      "webhook-url": process.env.DWOLLA_WEBHOOK_URL!
    },
    body
  );

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.topic) {
    case "transfer_completed":
      // Update transaction status
      break;
    case "transfer_failed":
      // Handle failed transfer
      break;
  }

  return new Response("OK");
}
```

## Environment Variables

Required in `lib/env.ts`:

- `DWOLLA_KEY`
- `DWOLLA_SECRET`
- `DWOLLA_ENV` (sandbox/development/production)
- `DWOLLA_WEBHOOK_URL`

## Verification Methods

1. **Micro-deposits** - Small deposits (~$0.10) to verify ownership
2. **Instant account verification** - Plaid integration for faster verification
3. **XML** - Bank login verification (legacy)

## Validation

Run: `npm run type-check` and `npm run test:browser`

## Common Issues

1. **ACH processing time** - Transfers take 1-3 business days
2. **Failure reasons** - Handle insufficient funds, invalid account, etc.
3. **Webhook retries** - Dwolla retries failed webhooks with exponential backoff
