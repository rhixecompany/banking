---
name: dwolla-skill
description: Dwolla API integration for ACH transfers, payment processing, and bank account verification in the Banking app.
lastReviewed: 2026-04-29
applyTo: "lib/**/*.{ts,js,md}"
---

# Dwolla Skill — Dwolla Integration Patterns

## Overview

This skill provides comprehensive patterns for integrating with the Dwolla API for ACH transfers, funding source management, and webhook handling in the Banking app.

**This skill applies to:** Implementing transfers, funding source creation, customer management, or webhook handlers that interact with Dwolla.

## Multi-Agent Support

### OpenCode
```bash
# Dwolla API operations
lib/dwolla/client.ts dwollaClient createCustomer createTransfer

# Webhook handling
app/api/webhooks/dwolla/route.ts

# Actions
actions/dwolla.actions.ts createFundingSource initiateTransfer
```

### Cursor
```typescript
// Import Dwolla client
import { dwollaClient } from "@/lib/dwolla";

// Create customer
const customer = await dwollaClient.post("customers", {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  type: "personal"
});

// Initiate transfer
const transfer = await dwollaClient.post("transfers", {
  _links: {
    source: fundingSourceUrl,
    destination: recipientFundingSourceUrl
  },
  amount: {
    value: "100.00",
    currency: "USD"
  }
});
```

### GitHub Copilot
```typescript
// Copilot suggests Dwolla API calls
// Create a funding source for bank account verification
// Initiate ACH transfer between accounts
```

## Dwolla Client Setup

### Client Configuration

```typescript
// lib/dwolla/client.ts
import Dwolla from "dwolla-v2";

const appKey = process.env.DWOLLA_KEY;
const appSecret = process.env.DWOLLA_SECRET;
const environment = process.env.DWOLLA_ENV || "sandbox";

export const dwollaClient = new Dwolla({
  key: appKey,
  secret: appSecret,
  environment: environment  // "sandbox" or "production"
});

// Base URL for API calls
export const dwollaBaseUrl = environment === "sandbox"
  ? "https://api-sandbox.dwolla.com"
  : "https://api.dwolla.com";
```

### Environment Variables

```bash
# .env.local (development)
DWOLLA_KEY=your_sandbox_key
DWOLLA_SECRET=your_sandbox_secret
DWOLLA_ENV=sandbox
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com

# .env.production
DWOLLA_KEY=your_production_key
DWOLLA_SECRET=your_production_secret
DWOLLA_ENV=production
DWOLLA_BASE_URL=https://api.dwolla.com
```

## Customer Management

### Create Personal Customer

```typescript
// actions/dwolla.actions.ts
"use server";
import { dwollaClient } from "@/lib/dwolla";
import { auth } from "@/lib/auth";
import { recipientDal } from "@/dal";

interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  ssn?: string;  // For ID verification
  dateOfBirth?: string;
}

export async function createDwollaCustomer(input: CreateCustomerInput) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const response = await dwollaClient.post("customers", {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      type: "personal",
      // For full account verification, include:
      // ssn: input.ssn,
      // dateOfBirth: input.dateOfBirth
    });

    const customerUrl = response.headers.get("location");

    // Store customer URL in database
    await recipientDal.updateDwollaCustomerId(session.user.id, customerUrl!);

    return { ok: true, customerUrl };
  } catch (error) {
    console.error("Dwolla customer creation failed:", error);
    return { ok: false, error: "Failed to create customer" };
  }
}
```

### Create Business Customer

```typescript
export async function createBusinessCustomer(input: {
  businessName: string;
  email: string;
  taxId: string;
  controller: {
    firstName: string;
    lastName: string;
    title: string;
    dateOfBirth: string;
    ssn: string;
  };
}) {
  const response = await dwollaClient.post("customers", {
    firstName: input.controller.firstName,
    lastName: input.controller.lastName,
    email: input.email,
    type: "business",
    business: {
      name: input.businessName,
      taxId: input.taxId,
      controller: {
        firstName: input.controller.firstName,
        lastName: input.controller.lastName,
        title: input.controller.title,
        dateOfBirth: input.controller.dateOfBirth,
        ssn: input.controller.ssn
      }
    }
  });

  return response.headers.get("location");
}
```

## Funding Sources

### Add Bank Account (Micro-Deposits)

```typescript
// actions/dwolla.actions.ts
"use server";
import { dwollaClient, dwollaBaseUrl } from "@/lib/dwolla";
import { auth } from "@/lib/auth";
import { walletDal } from "@/dal";

interface AddBankAccountInput {
  customerId: string;  // Dwolla customer URL
  routingNumber: string;
  accountNumber: string;
  accountType: "checking" | "savings";
  name: string;  // Label for the account
}

export async function addFundingSource(input: AddBankAccountInput) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    // Create funding source using IAV (Instant Account Verification)
    // or micro-deposits
    const response = await dwollaClient.post(`${input.customerId}/funding-sources`, {
      routingNumber: input.routingNumber,
      accountNumber: input.accountNumber,
      type: input.accountType,
      name: input.name,
      channel: "ach"
    });

    const fundingSourceUrl = response.headers.get("location");

    // Trigger micro-deposits for verification
    await dwollaClient.post(`${fundingSourceUrl}/micro-deposits`, {});

    // Store funding source in database (encrypted)
    await walletDal.create({
      userId: session.user.id,
      fundingSourceUrl: fundingSourceUrl!,
      accountType: input.accountType,
      bankName: input.name
    });

    return { ok: true, fundingSourceUrl };
  } catch (error) {
    console.error("Failed to add funding source:", error);
    return { ok: false, error: "Failed to add bank account" };
  }
}
```

### Verify Micro-Deposits

```typescript
// actions/dwolla.actions.ts
export async function verifyMicroDeposits(input: {
  fundingSourceUrl: string;
  amount1: string;  // e.g., "0.10"
  amount2: string;  // e.g., "0.25"
}) {
  try {
    const response = await dwollaClient.post(
      `${input.fundingSourceUrl}/micro-deposits`,
      {
        amount1: { value: input.amount1, currency: "USD" },
        amount2: { value: input.amount2, currency: "USD" }
      }
    );

    // Check if verification succeeded
    const status = response.body.status;  // "verified" or "failed"
    return { ok: true, status };
  } catch (error) {
    return { ok: false, error: "Micro-deposit verification failed" };
  }
}
```

## ACH Transfers

### Initiate Transfer

```typescript
// actions/dwolla.actions.ts
"use server";
import { dwollaClient } from "@/lib/dwolla";
import { auth } from "@/lib/auth";
import { walletDal, transactionDal } from "@/dal";
import { encrypt } from "@/lib/encryption";

interface TransferInput {
  fromFundingSourceUrl: string;
  toFundingSourceUrl: string;
  amount: number;  // In dollars
  note?: string;
}

export async function initiateTransfer(input: TransferInput) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    // Verify sender has sufficient balance
    const wallet = await walletDal.findByFundingSourceUrl(input.fromFundingSourceUrl);
    if (!wallet || wallet.balance < input.amount) {
      return { ok: false, error: "Insufficient funds" };
    }

    // Create transfer
    const response = await dwollaClient.post("transfers", {
      _links: {
        source: {
          href: input.fromFundingSourceUrl
        },
        destination: {
          href: input.toFundingSourceUrl
        }
      },
      amount: {
        value: input.amount.toFixed(2),
        currency: "USD"
      },
      metadata: {
        note: input.note || "",
        userId: session.user.id
      }
    });

    const transferUrl = response.headers.get("location");

    // Record transaction in database
    await transactionDal.create({
      senderWalletId: wallet.id,
      recipientFundingSourceUrl: input.toFundingSourceUrl,
      amount: input.amount,
      status: "pending",
      dwollaTransferId: transferUrl
    });

    return { ok: true, transferUrl };
  } catch (error) {
    console.error("Transfer failed:", error);
    return { ok: false, error: "Transfer failed" };
  }
}
```

### Check Transfer Status

```typescript
export async function getTransferStatus(transferUrl: string) {
  try {
    const response = await dwollaClient.get(transferUrl);
    const transfer = response.body;

    return {
      id: transfer.id,
      status: transfer.status,  // "pending", "processed", "failed", "cancelled"
      amount: transfer.amount.value,
      createdAt: transfer.created
    };
  } catch (error) {
    return { ok: false, error: "Failed to get transfer status" };
  }
}
```

## Webhooks

### Webhook Handler

```typescript
// app/api/webhooks/dwolla/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dwollaClient } from "@/lib/dwolla";
import { transactionDal, walletDal } from "@/dal";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.DWOLLA_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("x-dwolla-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const body = await request.text();
    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const topic = event.topic;

    // Handle different event types
    switch (topic) {
      case "transfer_created":
        await handleTransferCreated(event);
        break;
      case "transfer_completed":
        await handleTransferCompleted(event);
        break;
      case "transfer_failed":
        await handleTransferFailed(event);
        break;
      case "customer_verified":
        await handleCustomerVerified(event);
        break;
      case "funding_source_verified":
        await handleFundingSourceVerified(event);
        break;
      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleTransferCompleted(event: any) {
  const transferUrl = event.resource.href;
  const transfer = event.resource;

  // Update transaction status
  await transactionDal.updateStatusByDwollaId(transferUrl, "completed");

  // Update wallet balances
  const amount = parseFloat(transfer.amount.value);
  if (transfer.type === "debit") {
    // Money leaving account - decrease balance
    await walletDal.decreaseBalanceByFundingSourceUrl(
      transfer._links.source.href,
      amount
    );
  } else if (transfer.type === "credit") {
    // Money coming in - increase balance
    await walletDal.increaseBalanceByFundingSourceUrl(
      transfer._links.destination.href,
      amount
    );
  }
}

async function handleTransferFailed(event: any) {
  const transferUrl = event.resource.href;
  await transactionDal.updateStatusByDwollaId(transferUrl, "failed");
}
```

### Webhook Signature Verification

```typescript
// lib/dwolla/webhooks.ts
import crypto from "crypto";

export function verifyDwollaWebhook(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Error Handling

### Retry Pattern

```typescript
async function dwollaWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  backoffMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Exponential backoff for server errors (5xx)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, backoffMs * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError;
}
```

### Error Types

```typescript
// Handle specific Dwolla errors
try {
  await dwollaClient.post("transfers", transferData);
} catch (error: any) {
  if (error.status === 400) {
    const errors = error.body._embedded?.errors || [];
    const errorCode = errors[0]?.code;

    switch (errorCode) {
      case "InsufficientFunds":
        return { ok: false, error: "Insufficient funds in account" };
      case "InvalidFundingSource":
        return { ok: false, error: "Invalid bank account" };
      case "RoutableAccountRequired":
        return { ok: false, error: "Account not routable" };
      default:
        return { ok: false, error: errors[0]?.message || "Transfer failed" };
    }
  }

  throw error;
}
```

## Rate Limiting

```typescript
// Implement rate limiting for Dwolla API calls
import { RateLimiter } from "@/lib/rate-limiter";

const dwollaRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000  // Per minute
});

export async function dwollaRateLimitedRequest<T>(
  operation: () => Promise<T>
): Promise<T> {
  await dwollaRateLimiter.wait();
  return operation();
}
```

## Validation

```bash
# Type checking
bun run type-check

# Test Dwolla integration
bun run test:browser

# Verify webhook endpoint
curl -X POST https://your-domain.com/api/webhooks/dwolla \
  -H "Content-Type: application/json" \
  -H "x-dwolla-signature: ..." \
  -d '{"topic": "transfer_completed", "resource": {...}}'
```

## Common Issues

### 1. Invalid API Keys
```typescript
// Check environment variables are set correctly
console.log("Dwolla Key:", process.env.DWOLLA_KEY ? "set" : "MISSING");
console.log("Dwolla Secret:", process.env.DWOLLA_SECRET ? "set" : "MISSING");
```

### 2. Sandbox vs Production
```typescript
// Ensure you're using correct environment
const isSandbox = process.env.DWOLLA_ENV === "sandbox";
// Sandbox uses different base URL
```

### 3. Webhook Verification
```typescript
// Always verify webhook signatures
const isValid = verifyDwollaWebhook(body, signature, WEBHOOK_SECRET);
if (!isValid) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

### 4. Transfer Status Polling
```typescript
// Don't rely on webhooks alone - poll for status
const status = await pollTransferStatus(transferUrl, maxAttempts = 5);
```

## Cross-References

- **security-skill** — Encryption for sensitive data
- **db-skill** — Database schema
- **server-action-skill** — Server Action patterns
- **testing-skill** — Testing with mock Dwolla responses

## Multi-Agent Examples

### OpenCode: Dwolla Operations
```bash
# Test Dwolla API connection
curl -H "Authorization: $DWOLLA_KEY:$DWOLLA_SECRET" \
  https://api-sandbox.dwolla.com/customers
```

### Cursor: Webhook Handler
```typescript
// Cursor suggests webhook implementation
// Handle Dwolla webhook events
```

### Copilot: Transfer Logic
```typescript
// Write comment for transfer suggestions
// Implement ACH transfer with balance check
```