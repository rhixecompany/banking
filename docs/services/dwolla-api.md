# Dwolla API Documentation

## Overview

Welcome to the Dwolla API documentation, your gateway to seamlessly integrating your software with robust banking infrastructure. Our API empowers developers with the essential tools to facilitate account-to-account payments, digital wallet functionality, customer identity verification, and bank account verification.

## API Fundamentals

### Making Requests and Authentication

- All requests require authentication via OAuth access token
- Use `Authorization: Bearer <token>` header
- Content-Type: `application/vnd.dwolla.v1.hal+json`
- Base URLs:
  - Sandbox: `https://api-sandbox.dwolla.com`
  - Production: `https://api.dwolla.com`

### Handling Responses

- Response types follow JSON-HAL format
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 429 (Too Many Requests)
- Use Location header for created resource URLs

### Rate Limits

- Concurrency-based and volume-based limits
- Handle HTTP 429 Too Many Requests status codes

### Idempotency Key

- Use `Idempotency-Key` header to prevent duplicate operations
- Key is valid for 24 hours

### Error Handling

- Standard HTTP status codes
- Top-level error codes and embedded errors
- Use X-Request-ID for debugging

## Send Money Quickstart

### Key Concepts

1. **Choose and create the Customer type** - Select appropriate Customer type (receive-only, verified, etc.)
2. **Attach a funding source** - Add a bank account as a funding source to the recipient's Customer record
3. **Retrieve available funding sources** - Get list of verified funding sources
4. **Send funds** - Initiate transfer from source to destination

### Before You Begin

- Create a sandbox account at https://dashboard.dwolla.com
- Obtain API Key and Secret
- Create webhook subscription (recommended)

### Step 1 - Create a Recipient

Create a receive-only user (lightweight onboarding):

```bash
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "firstName": "Jane",
  "lastName": "Merchant",
  "email": "jmerchant@nomail.net",
  "type": "receive-only",
  "ipAddress": "99.99.99.99"
}
```

Response: 201 Created with Location header pointing to created Customer

### Step 2 - Adding a Funding Source

Add a bank account to the Customer:

```bash
POST https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources
{
  "routingNumber": "222222226",
  "accountNumber": "123456789",
  "bankAccountType": "checking",
  "name": "Jane Merchant - Checking 6789"
}
```

Response: 201 Created with Location header pointing to created funding source

### Step 3 - Retrieve Funding Sources

List funding sources for your account:

```bash
GET https://api-sandbox.dwolla.com/accounts/{account_id}/funding-sources?removed=false
Authorization: Bearer {access_token}
```

List funding sources for a Customer:

```bash
GET https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources
Authorization: Bearer {access_token}
```

### Step 4 - Initiating a Transfer

```bash
POST https://api-sandbox.dwolla.com/transfers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "_links": {
    "source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{source_funding_source_id}"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{destination_funding_source_id}"
    }
  },
  "amount": {
    "currency": "USD",
    "value": "225.00"
  }
}
```

Response: 201 Created with Location header pointing to created Transfer

### Simulate ACH Processing

Navigate to the Sandbox Dashboard and click "Process Bank Transfers" to move transfer from pending to processed status.

### Verify Transfer Status

```bash
GET https://api-sandbox.dwolla.com/transfers/{transfer_id}
Authorization: Bearer {access_token}
```

## Customer Types

| Type         | Description                                  |
| ------------ | -------------------------------------------- |
| Personal     | Personal verified customer                   |
| Business     | Business verified customer                   |
| Receive-only | Lightweight user that can only receive funds |

## Funding Source Methods

| Method | Verified? | Required Information |
| --- | --- | --- |
| API - Account & Routing | Optional (with microdeposits) | Bank Account and Routing Number |
| Dwolla + Open Banking | Yes | Online banking credentials |
| Drop-in components | Optional (with microdeposits) | Bank Account and Routing Number |
| Third Party - Plaid | Yes | Online Bank Credentials |

## Related Documentation

- [Dwolla Send Money](../dwolla-send-money.md)
- [Dwolla Context](../dwolla-context.md)
- [Dwolla Transfer Between Users](../dwolla-transfer-between-users.md)

---

_Source: https://developers.dwolla.com/docs/api-reference/api-fundamentals_ _Source: https://developers.dwolla.com/docs/send-money_
