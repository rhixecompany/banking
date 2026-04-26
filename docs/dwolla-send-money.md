# Dwolla — Send Money (Disbursements) Quickstart

Source: [Dwolla Send Money](https://developers.dwolla.com/docs/send-money)

## Overview

This guide covers sending funds (payouts / digital disbursements) from your Dwolla Master Account to an end user's bank account. This is a one-to-one transfer where:

- **Source**: Your Dwolla Master Account bank funding source
- **Destination**: Your customer's bank funding source

For batch disbursements (up to 5,000 payments), use [Mass Payment API](https://developers.dwolla.com/api-reference/mass-payments).

---

## Prerequisites

- [Sandbox account](https://developers.dwolla.com/docs/testing) with API Key and Secret
- OAuth access token (see [auth guide](https://developers.dwolla.com/docs/auth))
- Active webhook subscription (recommended)

---

## Step 1 — Create a Recipient Customer

Create a `receive-only` Customer (lightest onboarding — can only receive funds):

### Request Parameters

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `firstName` | yes | string | Customer's first name |
| `lastName` | yes | string | Customer's last name |
| `email` | yes | string | Customer's email |
| `type` | yes | string | Value: `receive-only` |
| `businessName` | no | string | Business name (if applicable) |
| `ipAddress` | no | string | Customer's IP address (enhances fraud detection) |

```bash
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "firstName": "Jane",
  "lastName": "Merchant",
  "email": "jmerchant@nomail.net",
  "type": "receive-only",
  "ipAddress": "99.99.99.99"
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/customers/c7f300c0-f1ef-4151-9bbe-005005aa3747
```

```javascript
const requestBody = {
  email: "jmerchant@nomail.net",
  firstName: "Jane",
  ipAddress: "99.99.99.99",
  lastName: "Merchant",
  type: "receive-only"
};

dwolla.post("customers", requestBody).then(function (res) {
  res.headers.get("location"); // Customer URL
});
```

**Store the full Customer URL** — needed for attaching banks and correlating webhooks.

**Webhook fired**: `customer_created`

---

## Step 2 — Attach a Funding Source

### Bank Addition Methods

| Method | Will bank be `verified`? | Required Info |
| --- | --- | --- |
| API — Account & Routing Number | Optional (with microdeposits) | Bank account + routing number |
| Dwolla + Open Banking | Yes | Online banking credentials |
| Drop-in Components | Optional (with microdeposits) | Bank account + routing number |
| Third Party — Plaid | Yes | Online banking credentials |

### Create Funding Source (routing + account number)

```bash
POST https://api.dwolla.com/customers/{customer_id}/funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "routingNumber": "222222226",
  "accountNumber": "123456789",
  "bankAccountType": "checking",
  "name": "Jane Merchant - Checking 6789"
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
```

```javascript
const customerUrl = "https://api-sandbox.dwolla.com/customers/{id}";
const requestBody = {
  accountNumber: "123456789",
  bankAccountType: "checking",
  name: "Jane Merchant - Checking 6789",
  routingNumber: "222222226"
};

dwolla
  .post(`${customerUrl}/funding-sources`, requestBody)
  .then(function (res) {
    res.headers.get("location"); // Funding source URL
  });
```

**Store the full funding source URL** — needed when creating transfers.

**Webhook fired**: `customer_funding_source_created`

---

## Step 3 — Retrieve Funding Sources

### List your Master Account's Funding Sources

```bash
GET https://api-sandbox.dwolla.com/accounts/{account_id}/funding-sources?removed=false
```

### List Customer's Funding Sources

```bash
GET https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources
```

---

## Step 4 — Initiate a Transfer

```bash
POST https://api-sandbox.dwolla.com/transfers
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "_links": {
    "source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{your_master_account_bank_id}"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{customer_bank_id}"
    }
  },
  "amount": {
    "currency": "USD",
    "value": "225.00"
  }
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388
```

```javascript
const transferRequest = {
  _links: {
    destination: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{destination_id}"
    },
    source: {
      href: "https://api-sandbox.dwolla.com/funding-sources/{source_id}"
    }
  },
  amount: {
    currency: "USD",
    value: "225.00"
  }
};

dwolla.post("transfers", transferRequest).then(function (res) {
  res.headers.get("location"); // Transfer URL
});
```

Transfer initial status: **`pending`**

**Store the full Transfer URL** for correlating webhooks.

---

## Verify Transfer Status

```bash
GET https://api-sandbox.dwolla.com/transfers/{transfer_id}

# Response includes status: "pending" | "processed" | "failed" | "cancelled"
```

---

## Simulate ACH in Sandbox

In the [Sandbox Dashboard](https://dashboard.dwolla.com), click **"Process Bank Transfers"** to move transfer from `pending` → `processed`.

---

## Webhooks

Key webhook events for this flow:

- `customer_created`
- `customer_funding_source_created`
- `transfer_created`
- `transfer_completed` (after ACH processing)
- `transfer_failed`

See [Working with Webhooks](https://developers.dwolla.com/docs/working-with-webhooks).
