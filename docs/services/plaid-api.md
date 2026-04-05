# Plaid API Documentation

## Overview

Comprehensive reference for integrating with Plaid API endpoints. Plaid API is JSON over HTTP. Requests are POST requests, and responses are JSON, with errors indicated in response bodies as error_code and error_type.

## API Access

To gain access to the Plaid API, create an account on the Plaid Dashboard. Once you've completed the signup process and acknowledged our terms, we'll provide a live client_id and secret via the Dashboard.

## API Protocols and Headers

- All requests must include a Content-Type of application/json
- The body must be valid JSON
- Almost all Plaid API endpoints require a client_id and secret (sent in body or headers PLAID-CLIENT-ID and PLAID-SECRET)
- Every response includes a request_id for support purposes

## API Host

- Sandbox: `https://sandbox.plaid.com`
- Production: `https://production.plaid.com`

Items cannot be moved between environments.

## API Status

- https://status.plaid.com/api/v2/status.json for current status
- https://status.plaid.com/api/v2/incidents.json for current and historical incidents

## Storing API Data

Any token returned by the API is sensitive and should be stored securely. Except for the public_token and link_token, all Plaid tokens are long-lasting and should never be exposed on the client side.

## API Field Formats

### Strings

Many string fields returned by Plaid APIs are reported exactly as returned by the financial institution. Field lengths of 280 characters will generally be adequate.

### Numbers and Money

Plaid returns all currency values as decimal values in dollars (or the equivalent for the currency being used), rather than as integers. Money values may have more than two digits of precision.

## Link Overview

Plaid Link is the client-side component that your users will interact with in order to link their accounts to Plaid and allow you to access their accounts via the Plaid API.

### Link Flow

1. Call `/link/token/create` to create a link_token and pass the temporary token to your app's client
2. Use the link_token to open Link for your user. In the onSuccess callback, Link will provide a temporary public_token
3. Call `/item/public_token/exchange` to exchange the public_token for a permanent access_token and item_id
4. Store the access_token and use it to make product requests

### Link Token Creation

```javascript
const linkTokenRequest = {
  user: {
    client_user_id: user.id
  },
  client_name: "Plaid Test App",
  products: ["auth"],
  language: "en",
  webhook: "https://webhook.example.com",
  redirect_uri: "https://domainname.com/oauth-page.html",
  country_codes: ["US"]
};

const createTokenResponse =
  await client.linkTokenCreate(linkTokenRequest);
```

### Exchanging Public Token

```javascript
const tokenResponse = await client.itemPublicTokenExchange({
  public_token: publicToken
});

const accessToken = tokenResponse.data.access_token;
const itemID = tokenResponse.data.item_id;
```

## Quickstart

### Sandbox Credentials

- username: user_good
- password: pass_good
- 2FA code (if prompted): 1234

### Get Started

1. Clone the Quickstart: `git clone https://github.com/plaid/quickstart.git`
2. Copy .env.example to .env and fill in PLAID_CLIENT_ID and PLAID_SECRET
3. Run the backend: `cd quickstart/node && npm install && ./start.sh`
4. Run the frontend: `cd quickstart/frontend && npm install && npm start`

### What is an Item?

An Item is a Plaid term for a login at a financial institution. A single end-user of your application might have accounts at different financial institutions, which means they would have multiple different Items.

## Products

Plaid offers various products:

- Auth (bank account verification)
- Transactions (transaction history)
- Balance (account balances)
- Identity (identity verification)
- Income (income verification)
- Investments (investment account data)
- Assets (asset report)

## Related Documentation

- [Plaid Link Guide](../plaid/link-guide.md)
- [Plaid Transactions](../plaid/transactions.md)
- [Plaid Balance](../plaid-balance.md)
- [Plaid Auth](../plaid-auth.md)

---

_Source: https://plaid.com/docs/api/_ _Source: https://plaid.com/docs/link/_ _Source: https://plaid.com/docs/quickstart/_
