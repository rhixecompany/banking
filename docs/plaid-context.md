# Plaid API Documentation

## Overview

Plaid is a financial data platform that enables applications to connect with user bank accounts, access financial data, and facilitate payments.

## Quickstart

### Getting Started

1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com) to get API keys
2. You'll receive a `client_id` and `secret` for each environment
3. Plaid has three environments: Sandbox, Development, and Production

### API Keys

| Key Type    | Description                           |
| ----------- | ------------------------------------- |
| `client_id` | Private identifier for your team      |
| `secret`    | Private key, one for each environment |

### Environment URLs

```text
Sandbox:     https://sandbox.plaid.com
Production:  https://production.plaid.com
```

## Token Flow

The Plaid integration follows this flow:

### 1. Create Link Token

Call `/link/token/create` to create a temporary `link_token`:

```javascript
const linkTokenRequest = {
  client_name: "Plaid Test App",
  country_codes: ["US"],
  language: "en",
  products: ["auth"],
  user: {
    client_user_id: user.id
  }
};

const createTokenResponse =
  await client.linkTokenCreate(linkTokenRequest);
```

### 2. Initialize Plaid Link

Use the `link_token` to open Plaid Link on the client side. Link provides a `public_token` via the `onSuccess` callback:

```javascript
const { open, ready } = usePlaidLink({
  onSuccess: async (public_token, metadata) => {
    // Send public_token to server
  },
  token: linkToken
});
```

### 3. Exchange Public Token

On the server, exchange `public_token` for a permanent `access_token`:

```javascript
const tokenResponse = await client.itemPublicTokenExchange({
  public_token: publicToken
});

const accessToken = tokenResponse.data.access_token;
const itemId = tokenResponse.data.item_id;
```

### 4. Make API Requests

Use `access_token` to make product requests:

```javascript
const accountsResponse = await client.accountsGet({
  access_token: accessToken
});
```

## Integration in This Repo (Runnable Example)

This example is **doc‑only** and uses the canonical env var names defined in `lib/env.ts`.

```ts
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const PLAID_ENV = process.env.PLAID_ENV ?? "sandbox";
const PLAID_BASE_URL = process.env.PLAID_BASE_URL;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID!;
const PLAID_SECRET = process.env.PLAID_SECRET!;

const configuration = new Configuration({
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET
    }
  },
  basePath: PLAID_BASE_URL
    ? PLAID_BASE_URL
    : PlaidEnvironments[PLAID_ENV as keyof typeof PlaidEnvironments]
});

const client = new PlaidApi(configuration);

export async function createLinkToken(userId: string) {
  const response = await client.linkTokenCreate({
    client_name: "Banking App",
    country_codes: ["US"],
    language: "en",
    products: ["auth", "transactions"],
    user: { client_user_id: userId }
  });

  return response.data.link_token;
}
```

## API Reference

### Core Concepts

- **Item**: A login at a financial institution (one user can have multiple Items)
- **Account**: A bank account associated with an Item
- **Access Token**: Permanent token for making API requests (must be stored securely)

### Products

| Product | Description |
| --- | --- |
| Auth | Retrieve account information and verify account ownership |
| Transactions | Retrieve up to 24 months of transaction data |
| Identity | Retrieve account holder information |
| Balance | Retrieve real-time balance information |
| Investments | Retrieve investment holdings and transactions |
| Liabilities | Retrieve loan and credit card balances |
| Income | Verify income and employment |
| Transfer | Move money between accounts |

### Request/Response Format

- Protocol: JSON over HTTPS (TLS v1.2 required)
- Method: POST requests
- Headers: `Content-Type: application/json`
- Authentication: Include `client_id` and `secret` in body or headers (`PLAID-CLIENT-ID`, `PLAID-SECRET`)

### Error Handling

Errors are indicated in response bodies with `error_code` and `error_type`. Use these instead of HTTP status codes for application-level errors.

### Sandbox Credentials

```text
Username: user_good
Password: pass_good
2FA (if prompted): 1234
```

## Client Libraries

Plaid provides official client libraries for:

- Node.js
- Python
- Java
- Ruby
- Go
- .NET
- PHP

Install via npm:

```bash
npm install plaid
```

## Webhooks

Plaid uses webhooks to notify your application about events. Configure webhooks in the Dashboard or via the `webhook` parameter when creating link tokens.

## Best Practices

1. **Store tokens securely** - Access tokens are long-lasting and should never be exposed on the client side
2. **Handle errors properly** - Check `error_code` and `error_type` in responses
3. **Track request IDs** - Every response includes a `request_id` for support purposes
4. **Use environment appropriately** - Items cannot be moved between Sandbox and Production

## Related Resources

- [Plaid Dashboard](https://dashboard.plaid.com)
- [Plaid GitHub](https://github.com/plaid)
- [Plaid Postman Collection](https://github.com/plaid/plaid-postman)
- [Plaid Academy (YouTube)](https://www.youtube.com/playlist?list=PLyKH4ZiEQ1bH5wpCt9SiyVfHlV2HecFBq)
- [Developer Community](https://discord.gg/sf57M8DW3y)
