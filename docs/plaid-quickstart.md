# Plaid Quickstart

Source: [Plaid Quickstart](https://plaid.com/docs/quickstart/)

## Overview

The Quickstart app demonstrates the full Plaid token flow locally. Requires API keys from the [Plaid Dashboard](https://dashboard.plaid.com/developers/keys).

- Sandbox credentials: `user_good` / `pass_good` (2FA: `1234`)
- GitHub: [plaid/quickstart](https://github.com/plaid/quickstart)

---

## What is an Item?

An **Item** = a login at a financial institution. A single user can have multiple Items (one per institution). An Item can be associated with multiple accounts (e.g. checking + savings under the same login).

---

## The Complete Plaid Token Flow

### Step 1: Create `link_token` (Server)

```javascript
app.post(
  "/api/create_link_token",
  async function (request, response) {
    const linkTokenRequest = {
      client_name: "Plaid Test App",
      country_codes: ["US"],
      language: "en",
      products: ["auth"],
      redirect_uri: "https://domainname.com/oauth-page.html",
      user: { client_user_id: clientUserId },
      webhook: "https://webhook.example.com"
    };
    const createTokenResponse =
      await client.linkTokenCreate(linkTokenRequest);
    response.json(createTokenResponse.data);
  }
);
```

### Step 2: Initialize Link & Get `public_token` (Client)

```tsx
// React with usePlaidLink
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

const App = () => {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    fetch("/api/create_link_token", { method: "POST" })
      .then(res => res.json())
      .then(data => setLinkToken(data.link_token));
  }, []);

  return linkToken != undefined ? (
    <Link linkToken={linkToken} />
  ) : (
    <></>
  );
};

const Link: React.FC<{ linkToken: null | string }> = ({
  linkToken
}) => {
  const onSuccess = React.useCallback(
    async (public_token, metadata) => {
      await fetch("/api/set_access_token", {
        body: JSON.stringify({ public_token }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
    },
    []
  );

  const { open, ready } = usePlaidLink({
    onSuccess,
    token: linkToken!
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};
```

### Step 3: Exchange `public_token` for `access_token` (Server)

```javascript
app.post(
  "/api/exchange_public_token",
  async function (request, response) {
    const publicToken = request.body.public_token;
    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken
    });
    const accessToken = tokenResponse.data.access_token;
    const itemID = tokenResponse.data.item_id;
    // Store accessToken and itemID in database
    response.json({ public_token_exchange: "complete" });
  }
);
```

### Step 4: Make API Requests (Server)

```javascript
app.get("/api/accounts", async function (request, response) {
  const accountsResponse = await client.accountsGet({
    access_token: accessToken
  });
  response.json(accountsResponse.data);
});
```

---

## Example `/accounts/get` Response

```json
{
  "accounts": [
    {
      "account_id": "A3wenK5EQRfKlnxlBbVXtPw9gyazDWu1EdaZD",
      "balances": {
        "available": 100,
        "current": 110,
        "iso_currency_code": "USD",
        "limit": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "subtype": "checking",
      "type": "depository"
    }
  ],
  "item": {
    "available_products": [
      "assets",
      "balance",
      "identity",
      "investments",
      "transactions"
    ],
    "billed_products": ["auth"],
    "institution_id": "ins_12",
    "item_id": "gVM8b7wWA5FEVkjVom3ri7oRXGG4mPIgNNrBy"
  }
}
```

---

## Quickstart Setup

```bash
git clone https://github.com/plaid/quickstart.git
cp .env.example .env
# Fill PLAID_CLIENT_ID and PLAID_SECRET in .env

cd quickstart/node
npm install
./start.sh

# In another terminal:
cd quickstart/frontend
npm install
npm start
# Visit http://localhost:3000
```

---

## Environments

| Environment | Description                                       |
| ----------- | ------------------------------------------------- |
| Sandbox     | Free, simulated environment with test credentials |
| Production  | Live credentials, real users                      |

---

## Next Steps

- [Product-specific docs](https://plaid.com/docs/)
- [Sample apps](https://plaid.com/docs/resources/#sample-apps)
- [Move money with Dwolla partner](https://plaid.com/docs/auth/partnerships/dwolla/)
- [Plaid in 3 minutes (YouTube)](https://www.youtube.com/playlist?list=PLyKH4ZiEQ1bE7XBcpX81BQWLy1olem1wf)
