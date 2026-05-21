# Plaid Integration Guide

## Quickstart

1. Get API keys from [Plaid Dashboard](https://dashboard.plaid.com)
2. Install: `npm install plaid`
3. Configure env vars in `.env.local`

---

## Token Flow (Required)

```
1. Create link_token (server) → 2. Open Plaid Link (client) → 3. Exchange public_token → 4. Store access_token
```

### 1. Create Link Token

```ts
import { PlaidApi, PlaidEnvironments } from "plaid";

const client = new PlaidApi({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
});

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

### 2. Initialize Plaid Link (Client)

```tsx
const { open } = usePlaidLink({
  onSuccess: async (public_token, metadata) => {
    // Send public_token to server
  },
  token: linkToken
});
```

### 3. Exchange Public Token

```ts
export async function exchangePublicToken(publicToken: string) {
  const response = await client.itemPublicTokenExchange({
    public_token: publicToken
  });
  return {
    accessToken: response.data.access_token,
    itemId: response.data.item_id
  };
}
```

### 4. Use Access Token

```ts
const accounts = await client.accountsGet({
  access_token: accessToken
});
const transactions = await client.transactionsSync({
  access_token: accessToken
});
```

---

## Products

| Product        | Purpose                       |
| -------------- | ----------------------------- |
| `auth`         | Account info + verification   |
| `transactions` | 24 months transaction history |
| `identity`     | Account holder info           |
| `balance`      | Real-time balances            |
| `investments`  | Holdings + transactions       |
| `liabilities`  | Loan/credit balances          |
| `income`       | Income verification           |

---

## Sandbox Testing

```
Username: user_good
Password: pass_good
2FA: 1234
```

Or bypass Link: `POST /sandbox/public_token/create`

---

## Error Handling

- Check `error_code` and `error_type` in response body
- Use **Update mode** for re-authentication after password/MFA changes

---

## Resources

- [Plaid Dashboard](https://dashboard.plaid.com)
- [Plaid Link Docs](https://plaid.com/docs/link/)
- [API Reference](https://plaid.com/docs/api/)
