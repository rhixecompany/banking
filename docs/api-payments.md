# Payments API Reference

Comprehensive reference for integrating Plaid (bank linking) and Dwolla (ACH transfers) APIs.

---

## Plaid API

### Overview

Plaid API is JSON over HTTP. Requests are POST requests, and responses are JSON.

### API Access

To gain access to the Plaid API, create an account on the Plaid Dashboard.

### API Protocols and Headers

- All requests must include a Content-Type of `application/json`
- The body must be valid JSON
- Almost all Plaid API endpoints require a `client_id` and `secret`
- Every response includes a `request_id` for support purposes

### API Host

- Sandbox: `https://sandbox.plaid.com`
- Production: `https://production.plaid.com`

Items cannot be moved between environments.

> **Note:** See `docs/plaid-auth.md`, `docs/plaid-balance.md`, `docs/plaid-transactions.md` for product-specific guides.

---

## Dwolla API

### Overview

Dwolla API empowers developers to facilitate account-to-account payments, digital wallet functionality, customer identity verification, and bank account verification.

### API Fundamentals

#### Making Requests and Authentication

- All requests require authentication via OAuth access token
- Use `Authorization: Bearer <token>` header
- Content-Type: `application/vnd.dwolla.v1.hal+json`
- Base URLs:
  - Sandbox: `https://api-sandbox.dwolla.com`
  - Production: `https://api.dwolla.com`

#### Handling Responses

- Response types follow JSON-HAL format
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 429 (Too Many Requests)
- Use Location header for created resource URLs

#### Rate Limits

- Concurrency-based and volume-based limits
- Handle HTTP 429 Too Many Requests status codes

#### Idempotency Key

- Use `Idempotency-Key` header to prevent duplicate operations
- Key is valid for 24 hours

> **Note:** See `docs/dwolla-context.md`, `docs/dwolla-send-money.md`, `docs/dwolla-transfer-between-users.md` for integration guides.

---

## Quickstart: Plaid + Dwolla Integration

### Step 1: Plaid Link Token Creation

```javascript
const linkTokenRequest = {
  user: { client_user_id: user.id },
  client_name: "Banking App",
  products: ["auth"],
  language: "en",
  webhook: "https://webhook.example.com",
  redirect_uri: "https://domainname.com/oauth-page.html",
  country_codes: ["US"]
};

const createTokenResponse =
  await client.linkTokenCreate(linkTokenRequest);
```

### Step 2: Exchange Public Token

```javascript
const tokenResponse = await client.itemPublicTokenExchange({
  public_token: publicToken
});

const accessToken = tokenResponse.data.access_token;
const itemID = tokenResponse.data.item_id;
```

### Step 3: Create Processor Token (Dwolla)

```javascript
const processorResponse = await client.processorTokenCreate({
  access_token: accessToken,
  processor: "dwolla",
  account_id: accountId
});

const processorToken = processorResponse.data.processor_token;
```

### Step 4: Dwolla Transfer

```bash
POST https://api-sandbox.dwolla.com/transfers
Authorization: Bearer {access_token}

{
  "_links": {
    "source": { "href": "https://api-sandbox.dwolla.com/funding-sources/{source_id}" },
    "destination": { "href": "https://api-sandbox.dwolla.com/funding-sources/{dest_id}" }
  },
  "amount": { "currency": "USD", "value": "100.00" }
}
```

---

## Testing Credentials

### Plaid Sandbox

- username: `user_good`
- password: `pass_good`
- 2FA code (if prompted): `1234`

### Dwolla Sandbox

Navigate to the Sandbox Dashboard and click "Process Bank Transfers" to move transfer from pending to processed status.

---

## Related Documentation

- `docs/plaid/link-guide.md` — Plaid Link integration
- `docs/plaid/transactions.md` — Transaction sync
- `docs/dwolla-send-money.md` — Send money guide
- `docs/dwolla-transfer-between-users.md` — User-to-user transfers
- `lib/plaid.ts` — Mock token detection for testing
- `lib/dwolla.ts` — Dwolla utility functions

---

_Consolidated from `docs/services/plaid-api.md` and `docs/services/dwolla-api.md`_
