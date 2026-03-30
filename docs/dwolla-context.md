# Dwolla API Documentation

## Overview

Dwolla is a banking infrastructure platform that enables account-to-account (A2A) payments. It provides APIs for digital wallet functionality, customer identity verification, and bank account verification.

## Getting Started

### Integration Steps

1. **Discovery** - Talk with Dwolla payments experts to determine eligibility
2. **Bank Setup** - Reach out to your bank to set up commercial bank account access
3. **Contract** - Review and sign agreement
4. **Account Setup** - Sign up for Sandbox account and complete forms
5. **Testing** - Build and test in the Sandbox environment
6. **Production** - Go live in production environment

### Sandbox Environment

The Sandbox is a free, simulated environment for building and testing your integration before going live.

## API Fundamentals

### Authentication

Requests to the Dwolla API require an OAuth access token for authentication.

```bash
Authorization: Bearer {access_token}
```

### Base URL

```
Sandbox:     https://api-sandbox.dwolla.com
Production:  https://api.dwolla.com
```

### Request Format

- Content-Type: application/vnd.dwolla.v1+json
- All requests use JSON
- Use idempotency keys for critical operations

### Response Handling

Dwolla uses HAL (Hypermedia Application Language) for responses. Responses include:

- Standard HTTP status codes
- Top-level error codes
- Embedded errors in response body
- X-Request-ID header for debugging

## Core Resources

### Transfers

Create, list, cancel, or retrieve transfer details.

```javascript
// Create a transfer
const transfer = await dwolla.post("transfers", {
  _links: {
    source: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{source_id}"
    },
    destination: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{destination_id}"
    }
  },
  amount: {
    currency: "USD",
    value: "100.00"
  }
});
```

### Funding Sources

Attach bank accounts to customers for funding transfers.

```javascript
// Attach a funding source
const fundingSource = await dwolla.post(
  "customers/{customer_id}/funding-sources",
  {
    routingNumber: "222222226",
    accountNumber: "12345678",
    accountType: "checking",
    name: "My Bank Account"
  }
);
```

## Integration in This Repo (Runnable Example)

This example is **doc‑only** and uses the canonical env var names defined in `lib/env.ts`.

```ts
import { Client } from "dwolla-v2";

const DWOLLA_ENV = process.env.DWOLLA_ENV ?? "sandbox";
const DWOLLA_BASE_URL = process.env.DWOLLA_BASE_URL;

const client = new Client({
  environment: DWOLLA_ENV === "production" ? "production" : "sandbox",
  key: process.env.DWOLLA_KEY!,
  secret: process.env.DWOLLA_SECRET!
});

// Optional: If you need a custom base URL, wrap the client or proxy requests.
// dwolla-v2 does not accept a base URL override directly.

export async function createCustomer(
  customer: Record<string, unknown>
) {
  const response = await client.post("customers", customer);
  return response.headers.get("location");
}
```

### Customers

Create and manage customer records:

- Personal customers
- Business customers
- Receive-only customers

### External Parties

Manage external bank accounts for A2A payments.

## Rate Limits

Dwolla implements both:

- **Concurrency-based limits** - Limits on simultaneous requests
- **Volume-based limits** - Limits on request volume over time

Handle HTTP 429 Too Many Requests responses appropriately.

## SDKs & Tools

Dwolla provides client libraries for:

- Node.js
- Python
- Ruby
- Java
- C# (.NET)
- Go

Install Node.js SDK:

```bash
npm install dwolla-v2
```

## Webhooks

Configure webhooks to receive notifications about:

- Transfer completions
- Transfer failures
- Customer verification status
- Funding source events

## Best Practices

1. **Use idempotency keys** - Prevent duplicate operations
2. **Implement proper error handling** - Check both HTTP status and error codes
3. **Use X-Request-ID for debugging** - Track requests for support
4. **Handle rate limits** - Implement exponential backoff for 429 responses
5. **Store tokens securely** - OAuth tokens should be stored securely

## Security

- IP allowlisting available for additional security
- All API requests require HTTPS
- Token-based authentication (OAuth 2.0)

## Testing

Use the Sandbox environment for all testing:

- Test transfers between test accounts
- Simulate success and failure scenarios
- Verify webhook delivery

## Related Resources

- [Dwolla Developer Portal](https://developers.dwolla.com)
- [Dwolla Postman Collection](https://www.postman.com/dwolladev/workspace/dwolla)
- [Developer Forum](https://discuss.dwolla.com/)
- [Contact Sales](https://www.dwolla.com/contact/)
