# Dwolla — Transfer Money Between Users

Source: [Dwolla Transfer Money Between Users](https://developers.dwolla.com/docs/transfer-money-between-users)

## Overview

Marketplace / peer-to-peer transfers between two of your Customers (e.g. buyer → seller). One party must complete identity verification; the sender **must** have a verified funding source.

---

## Key Rules

1. **At least one party** (sender OR receiver) must complete [identity verification](https://www.dwolla.com/updates/guide-customer-identification-program-payments-api/)
2. **The sender must have a verified funding source** — unverified sources can only receive money
3. Both parties can be Verified Customers if your use case requires it

### This Guide's Scenario

- **Jane Merchant** (seller) = **Verified Customer** with **unverified** funding source (can receive only)
- **Joe Buyer** (buyer) = **Unverified Customer** with **verified** funding source (can send)

---

## Step 1 — Create a Verified Customer (Seller / Recipient)

Creating a Business Verified Customer (sole proprietorship):

```bash
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "firstName": "Jane",
  "lastName": "Merchant",
  "email": "solePropBusiness@email.com",
  "ipAddress": "143.156.7.8",
  "type": "business",
  "dateOfBirth": "1980-01-31",
  "ssn": "6789",
  "address1": "99-99 33rd St",
  "city": "Some City",
  "state": "NY",
  "postalCode": "11101",
  "businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
  "businessType": "soleProprietorship",
  "businessName": "Jane Corp",
  "ein": "00-0000000"
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
```

> **Note:** Verified Customers may have non-`verified` statuses after creation. Handle verification statuses — see [Business Verified Customer](https://developers.dwolla.com/docs/business-verified-customer#handle-verification-statuses).

Customer types:

- [Personal Verified Customer](https://developers.dwolla.com/docs/personal-verified-customer)
- [Business Verified Customer](https://developers.dwolla.com/docs/business-verified-customer)

---

## Step 2 — Create Unverified Funding Source (for Seller / Recipient)

Unverified funding sources can **only receive** funds:

```bash
POST https://api-sandbox.dwolla.com/customers/{customer_id}/funding-sources
Authorization: Bearer {access_token}

{
  "routingNumber": "222222226",
  "accountNumber": "123456789",
  "bankAccountType": "checking",
  "name": "Jane Merchant"
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
```

---

## Step 3 — Create an Unverified Customer (Buyer / Sender)

```bash
POST https://api-sandbox.dwolla.com/customers
Authorization: Bearer {access_token}

{
  "firstName": "Joe",
  "lastName": "Buyer",
  "email": "jbuyer@mail.net",
  "ipAddress": "99.99.99.99"
}

# Response: 201 Created
# Location: https://api-sandbox.dwolla.com/customers/247B1BD8-F5A0-4B71-A898-F62F67B8AE1C
```

---

## Step 4 — Attach a Verified Funding Source (for Buyer / Sender)

**The sender must have a verified funding source.** The recommended approach is [Open Banking with Plaid](https://developers.dwolla.com/docs/open-banking/plaid):

1. Initiate an Exchange Session with Dwolla
2. Guide user through Plaid Link (authentication with bank credentials)
3. Use Exchange details to create a verified funding source in Dwolla

Integration guide: [Dwolla Open Banking with Plaid](https://developers.dwolla.com/docs/open-banking/plaid)

Working example: [Dwolla open banking Plaid example](https://github.com/Dwolla/integration-examples/tree/main/packages/open-banking/plaid)

---

## Step 5 — Initiate Transfer (Buyer → Seller)

```bash
POST https://api-sandbox.dwolla.com/transfers
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer {access_token}

{
  "_links": {
    "source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{joe_buyer_verified_bank_id}"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/{jane_merchant_bank_id}"
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

---

## Check Transfer Status

```bash
GET https://api-sandbox.dwolla.com/transfers/{transfer_id}

# Response:
{
  "id": "D76265CD-0951-E511-80DA-0AA34A9B2388",
  "status": "pending",
  "amount": {
    "value": "225.00",
    "currency": "USD"
  },
  "created": "2015-09-02T00:30:25.580Z"
}
```

Transfer statuses: `pending` → `processed` | `failed` | `cancelled`

---

## Customer Types Summary

| Type | Can Send | Can Receive | Identity Verification |
| --- | --- | --- | --- |
| Unverified | Only with verified bank | Yes | No |
| Receive-only | No | Yes | No |
| Personal Verified | Yes (with verified bank) | Yes | Yes (SSN) |
| Business Verified | Yes (with verified bank) | Yes | Yes (EIN + docs) |

---

## Plaid + Dwolla Integration (Open Banking)

For verified funding source creation via Plaid:

1. Your server creates a Plaid `link_token` with `processor` product
2. User completes Plaid Link → `public_token`
3. Exchange `public_token` → `access_token` + call `/processor/token/create` (processor: "dwolla") → `processor_token`
4. Provide `processor_token` to Dwolla to create verified funding source

See [Dwolla + Plaid integration example](https://github.com/Dwolla/integration-examples/tree/main/dwolla-plaid-funding-source).
