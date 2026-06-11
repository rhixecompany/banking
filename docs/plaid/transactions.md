# Plaid Transactions

## Overview

Retrieve up to 24 months of transaction data and stay up-to-date with webhooks.

## Integration Steps

1. **Create Link Token** - Include `transactions` in products array
2. **Initialize Link** - User connects their bank
3. **Exchange Token** - Get `access_token`
4. **Call /transactions/sync** - Initial sync with cursor
5. **Handle Webhooks** - Listen for `SYNC_UPDATES_AVAILABLE`
6. **Fetch Updates** - Call sync with saved cursor

## Key Endpoints

- `/transactions/sync` - Main endpoint for fetching transactions
- `/transactions/refresh` - On-demand refresh (add-on)
- `/transactions/recurring/get` - Recurring transaction insights

## Transaction Data Fields

| Field         | Fill Rate |
| ------------- | --------- |
| Amount        | 100%      |
| Date          | 100%      |
| Description   | 100%      |
| Merchant Name | 97%       |
| Category      | 95%       |

## Testing in Sandbox

Use these test users:

- `user_transactions_dynamic` - Dynamic data with webhook triggers
- `user_ewa_user` - Earned wage access persona
- `user_yuppie` - Young affluent professional
- `user_small_business` - Small business persona

## Webhooks

- `INITIAL_UPDATE_COMPLETE` - First batch ready
- `HISTORICAL_UPDATE_COMPLETE` - All historical data loaded
- `SYNC_UPDATES_AVAILABLE` - New transactions ready

## Pagination

Handle `has_more` and use `next_cursor` for subsequent calls:

```javascript
let cursor = null;
do {
  const response = await plaidClient.transactionsSync({
    access_token: accessToken,
    cursor: cursor
  });
  cursor = response.data.next_cursor;
} while (response.data.has_more);
```

## Transaction States

- `pending` - Transaction not yet finalized
- `posted` - Transaction finalized
- `removed` - Transaction was removed

## Next Steps

- See [Plaid Link](./link-guide.md)
- See [Plaid Balance](./balance.md)
