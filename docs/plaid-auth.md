# Plaid Auth — Introduction

Source: https://plaid.com/docs/auth/

## Overview

Auth allows you to retrieve a user's checking, savings, or cash management **account and routing numbers** for initiating ACH, wire transfer, or equivalent international payments. Auth is used to fund accounts, cash out to bank accounts, or make pay-by-bank purchases.

Auth **must** be used with a payment processor to move money — either a [Plaid Partner](https://plaid.com/docs/auth/partnerships/) or a third party. For an all-in-one solution, see [Transfer](https://plaid.com/docs/transfer/) (US only).

Auth only works with debitable checking, savings, or cash management accounts. **Credit accounts and debit cards cannot use Auth.**

Commonly combined with:

- **Balance** — verify sufficient funds before transfer
- **Signal** — ML-powered ACH return risk analysis
- **Identity** — verify account ownership

---

## Integration Process (Step-by-Step)

1. Call `/link/token/create` with `auth` in the `products` parameter
2. Initialize Link with the `link_token` (see [Link docs](https://plaid.com/docs/link/))
3. Exchange `public_token` for `access_token` via `/item/public_token/exchange`
4. **If using a Plaid partner** (e.g. Dwolla): enable the partner in the [Dashboard](https://dashboard.plaid.com/developers/integrations), then call `/processor/token/create` to get a processor token for the partner
5. **If NOT using a Plaid partner**: call `/auth/get` to get account and routing number directly
6. Listen for `PENDING_DISCONNECT` webhook — send Item through update mode within 7 days or consent expires
7. Listen for `USER_PERMISSION_REVOKED` and `USER_ACCOUNT_REVOKED` webhooks — must re-authorize via update mode
8. **PNC-specific**: call `/auth/get` or `/processor/token/create` every time a PNC Item goes through update mode to get a fresh TAN

---

## Using Dwolla with Auth

Dwolla is a Plaid partner. When using Dwolla:

- Do **not** call `/auth/get`
- Call `/processor/token/create` instead
- Provide the processor token to Dwolla for ACH transfers

Example integration guide: [Move money with Dwolla](https://plaid.com/docs/auth/partnerships/dwolla/)

---

## Processor Token Flow

```
/link/token/create (products: ["auth"])
       ↓
  Link (user logs in)
       ↓
/item/public_token/exchange → access_token
       ↓
/processor/token/create (processor: "dwolla") → processor_token
       ↓
  Provide processor_token to Dwolla
```

---

## Direct Auth Data (without processor)

Call `/auth/get` with the `access_token` to retrieve account/routing numbers:

```json
"numbers": {
  "ach": [
    {
      "account": "1111222233330000",
      "account_id": "bWG9l1DNpdc8zDk3wBm9iMkW3p1mVWCVKVmJ6",
      "routing": "011401533",
      "wire_routing": "021000021"
    }
  ]
}
```

> US compliance: ACH data must be stored per [Nacha rules](https://www.nacha.org/). Consult internal compliance team.

---

## Tokenized Account Numbers (TANs)

Some institutions (Chase, PNC, US Bank) return **tokenized account numbers** instead of real account numbers. TANs:

- Are unique per app per user
- Are standard ACH-compatible numbers
- Can be revoked if user revokes access
- Check `is_tokenized_account_number` field in `/auth/get` response

**PNC TAN expiration**: Consent expires 1 year after last user consent. Renew via update mode. Call `/auth/get` or `/processor/token/create` again after update mode on PNC Items.

---

## Account Verification Dashboard

[Dashboard](https://dashboard.plaid.com/account-verification) allows enabling:

- Micro-deposit verification
- Database verification
- Identity Match (KYC in Link flow)

---

## Optimizing Link for Auth

- Use "Account Select: Enabled for one account" setting if user should pick a single account for payment
- Use [Embedded Institution Search](https://plaid.com/docs/link/embedded-institution-search/) for pay-by-bank use cases with multiple payment methods

---

## Auth Data by Country

| Country | Format                                 | Transfer System |
| ------- | -------------------------------------- | --------------- |
| US      | routing + account (ACH) + wire_routing | ACH / wire      |
| Canada  | transit + institution + account (EFT)  | EFT             |
| Europe  | IBAN + BIC                             | SEPA            |
| UK      | sort_code + account (BACS) + IBAN      | BACS / SEPA     |

---

## Testing Auth in Sandbox

- GitHub repo: https://github.com/plaid/sandbox-custom-users
- Default test credentials: `user_good` / `pass_good`
- For complex flows (micro-deposit): see [Additional Auth flows](https://plaid.com/docs/auth/coverage/testing/)

---

## Pricing

Auth is billed on a **one-time fee** model (charged once per Item, not per call).
