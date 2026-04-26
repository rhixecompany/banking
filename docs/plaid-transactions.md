# Plaid Transactions — Introduction

Source: [Plaid Transactions](https://plaid.com/docs/transactions/)

## Overview

Transactions provides up to **24 months of transaction history** for:

- `depository` accounts (checking, savings)
- `credit` accounts (credit cards)
- Student loan accounts

For investment account transactions, use [Plaid Investments](https://plaid.com/docs/investments/).

### Typical Field Fill Rates

| Field                                  | Fill Rate |
| -------------------------------------- | --------- |
| Amount                                 | 100%      |
| Date                                   | 100%      |
| Description                            | 100%      |
| Merchant name                          | 97%\*     |
| Category (`personal_finance_category`) | 95%       |

\* Excludes transactions without a merchant (cash, direct deposits, bank fees)

---

## Integration Overview (Step-by-Step)

1. Call `/link/token/create` with:
   - `products: ["transactions"]`
   - `webhook` endpoint for transaction updates
   - `transactions.days_requested` (default: 90, max: 730)

2. Initialize Link with `link_token` → user completes Link flow

3. Exchange `public_token` for `access_token` via `/item/public_token/exchange`

4. Create a method to call `/transactions/sync`:
   - First call: no cursor
   - Save the returned `next_cursor` for next call
   - If `has_more` is `true`, paginate: call again with new cursor until `has_more` is `false`
   - On `TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION` error: restart with old preserved cursor

5. Call `/transactions/sync` (with `access_token`) to activate the Item for `SYNC_UPDATES_AVAILABLE` webhook

6. (Optional) Wait for `SYNC_UPDATES_AVAILABLE` with `initial_update_complete: true` → call sync to get last 30 days

7. Wait for `SYNC_UPDATES_AVAILABLE` with `historical_update_complete: true` → call sync for all available history

8. Going forward: Plaid fires `SYNC_UPDATES_AVAILABLE` periodically — call sync to get `added`, `modified`, or `removed` transactions

9. (Optional) Call `/transactions/refresh` for on-demand updates (add-on feature)

---

## Transactions Updates

Transactions are not static — they change as financial institutions process them. Plaid checks for updates regularly (typically 1+ times/day). Updates include:

- `added` — new transactions
- `modified` — updated transactions (e.g. pending → posted)
- `removed` — deleted or reversed transactions

See [Transaction states](https://plaid.com/docs/transactions/transactions-data/) and [Transaction webhooks](https://plaid.com/docs/transactions/webhooks/).

---

## `/transactions/sync` Cursor Pattern

```typescript
// Pseudocode for sync loop
async function fetchAllTransactions(accessToken: string) {
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await plaid.transactionsSync({
      access_token: accessToken,
      cursor
    });
    const { added, has_more, modified, next_cursor, removed } =
      response.data;
    // process added/modified/removed...
    cursor = next_cursor;
    hasMore = has_more;
  }
}
```

Reference implementation:

- [fetchNewSyncData](https://github.com/plaid/tutorial-resources/blob/main/transactions/finished/server/routes/transactions.js#L31)
- [syncTransactions](https://github.com/plaid/tutorial-resources/blob/main/transactions/finished/server/routes/transactions.js#L110)

---

## Recurring Transactions (Add-on)

`/transactions/recurring/get` — available in US, Canada, UK as an add-on.

Returns inflow/outflow stream summaries including category, merchant, last amount, frequency.

---

## Testing in Sandbox

| User | Description | New txns on refresh | Recurring |
| --- | --- | --- | --- |
| `user_transactions_dynamic` | Dynamic data, triggers webhooks | Always | Yes (6 months) |
| `user_ewa_user` | Earned-wage access persona | Sometimes | Some |
| `user_yuppie` | Young affluent professional | Sometimes | Some |
| `user_small_business` | Small business persona | Sometimes | Some |

- All use any non-blank password + non-OAuth institution (e.g. First Platypus Bank `ins_109508`)
- `user_transactions_dynamic` supports `/sandbox/transactions/create` for custom transactions

---

## Pricing

Transactions billed on **subscription model**. Recurring Transactions add-on also subscription. Transactions Refresh add-on billed per-request.

---

## Sample Apps

- [Transactions sample app](https://github.com/plaid/tutorial-resources/tree/main/transactions) — YouTube tutorial companion
- [Plaid Pattern](https://github.com/plaid/pattern) — full PFM example with reconciliation
