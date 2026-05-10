# Dwolla Integration Guide

## Quickstart

1. Sign up at [Dwolla Developer Portal](https://developers.dwolla.com)
2. Install: `npm install dwolla-v2`
3. Configure `DWOLLA_KEY` and `DWOLLA_SECRET` in `.env.local`

---

## Client Setup

```ts
import { Client } from "dwolla-v2";

const client = new Client({
  environment:
    process.env.DWOLLA_ENV === "production"
      ? "production"
      : "sandbox",
  key: process.env.DWOLLA_KEY!,
  secret: process.env.DWOLLA_SECRET!
});
```

---

## Customer Types

| Type | Can Send | Can Receive | Verification |
| --- | --- | --- | --- |
| Unverified | Only with verified bank | Yes | None |
| Personal Verified | Yes | Yes | SSN |
| Business Verified | Yes | Yes | EIN + docs |

---

## Create Customer

```ts
// Personal Verified
const personal = await client.post("customers", {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  type: "personal",
  dateOfBirth: "1990-01-01",
  ssn: "1234",
  address1: "123 Main St",
  city: "Des Moines",
  state: "IA",
  postalCode: "50309"
});

// Business Verified
const business = await client.post("customers", {
  firstName: "Jane",
  lastName: "Merchant",
  email: "business@example.com",
  type: "business",
  businessName: "Jane Corp",
  ein: "00-0000000"
});
```

---

## Funding Sources

### Add Bank Account (Unverified)

```ts
const fs = await client.post(
  "customers/{customerId}/funding-sources",
  {
    routingNumber: "222222226",
    accountNumber: "12345678",
    bankAccountType: "checking",
    name: "My Bank"
  }
);
```

### Add Verified Bank (via Plaid)

```
1. Create Plaid link_token (processor: "dwolla")
2. User completes Plaid Link → get public_token
3. Exchange public_token → processor_token
4. Create funding source with processor_token
```

---

## Transfers

```ts
const transfer = await client.post("transfers", {
  _links: {
    source: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{source_id}"
    },
    destination: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{dest_id}"
    }
  },
  amount: { currency: "USD", value: "100.00" }
});
```

**Status flow:** `pending` → `processed` | `failed` | `cancelled`

---

## Best Practices

1. **Use idempotency keys** for critical operations
2. **Handle 429 errors** with exponential backoff
3. **Store tokens securely** — OAuth tokens are long-lived
4. **Use X-Request-ID** for debugging

---

## Resources

- [Dwolla Developer Portal](https://developers.dwolla.com)
- [API Reference](https://docs.dwolla.com)
- [Postman Collection](https://www.postman.com/dwolladev/workspace/dwolla)
