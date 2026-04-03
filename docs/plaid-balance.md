# Plaid Balance — Introduction

Source: https://plaid.com/docs/balance/

## Overview

Balance provides **real-time** balance information. Used to verify sufficient funds before initiating a payment (avoiding ACH returns). Available only in combination with other Plaid products (Auth, Transactions).

> **Important**: The free `/accounts/get` endpoint returns **cached** balances — NOT suitable for payment use cases. Use Balance (`/accounts/balance/get` or `/signal/evaluate`) for real-time data.

### Latency

- p50 ~3s, p95 ~11s (always performs real-time data extraction)
- For lower-latency ACH risk checks in user-present flows, consider [Signal Transaction Scores](https://plaid.com/docs/signal/) (p95 <2s)

---

## Two Integration Options

### Option 1: `/signal/evaluate` (Recommended for ACH payments)

- Checks balance AND runs Signal Rules (business logic configured in Dashboard)
- Returns: current/available balance + recommended action (accept, review, decline)
- Available for new Balance customers with Production access after Oct 15, 2025
- Configure rules in [Signal Rules Dashboard](https://dashboard.plaid.com/signal/risk-profiles)

### Option 2: `/accounts/balance/get` (Legacy / Non-payment use cases)

- Returns current and available balance
- Does NOT run Signal Rules
- Use for PFM, treasury management, non-US accounts, or legacy integrations

Both options:

- Same price
- Same latency
- Same account data returned

---

## Integration Using `/signal/evaluate`

1. Create a Balance-only Rule in [Signal Rules Dashboard](https://dashboard.plaid.com/signal/risk-profiles)
2. Call `/link/token/create` with `products: ["signal", "auth"]` (do NOT include `balance`)
3. Initialize Link → user completes flow
4. Exchange `public_token` → `access_token`
5. Call `/signal/evaluate` and determine next steps based on ruleset results
6. Report ACH returns and decisions to Plaid
7. Periodically review and tune Signal Rules in Dashboard

---

## Integration Using `/accounts/balance/get`

1. Call `/link/token/create` with your product(s) (do NOT include `balance` in products)
2. Initialize Link → user completes flow
3. Exchange `public_token` → `access_token`
4. Call `/accounts/balance/get` with `access_token`

---

## Current vs Available Balance

| Field | Description |
| --- | --- |
| `current` | Balance not accounting for pending transactions |
| `available` | Predicted balance net of pending transactions (more useful for ACH risk) |

For credit accounts: `available` = amount that can be spent without hitting credit limit.

If institution doesn't provide `available`, approximate it: start with `current`, subtract pending transactions from Transactions product.

### Typical Fill Rates

| Field             | Fill Rate |
| ----------------- | --------- |
| Current balance   | 99%       |
| Available balance | 91%       |

---

## Pricing

Billed on **flat fee per request** for each successful call to `/signal/evaluate` or `/accounts/balance/get`.

---

## Signal Transaction Scores (Enhancement)

For critical user-present flows requiring low latency:

- p95 <2s vs Balance's 11s
- 80+ criteria for rule generation
- ML-powered recommendations
- No additional engineering once Balance is integrated via `/signal/evaluate` — upgrade rules in Dashboard

Contact [Sales](https://plaid.com/contact/) or your account manager for access.
