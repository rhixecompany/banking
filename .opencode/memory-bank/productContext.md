# Product Context

## Why This Project Exists

Solves the problem of managing multiple bank accounts from different institutions in one place. Users can:

- **Connect** multiple bank accounts via Plaid
- **View** real-time transactions across all accounts
- **Transfer** money to other platform users via Dwolla ACH
- **Track** spending by category

## Problems Solved

1. **Account Fragmentation** — Users with accounts at multiple banks need one dashboard
2. **Transaction Tracking** — Real-time sync shows all spending in one view
3. **Peer-to-Peer Transfers** — Send money to other users without external apps

## User Experience Goals

- Simple bank linking flow (Plaid Link)
- Clean dashboard showing total balance
- Easy transfer form with validation
- Transaction history with filtering

---

## Key Flows

### Connect Bank
1. User clicks "Connect Bank" → Plaid Link opens
2. User authenticates with bank
3. Access token stored, bank account created
4. Dashboard updates with new account

### Transfer Money
1. User selects source bank
2. Enters recipient email + sharable ID
3. Enters amount
4. Server Action creates Dwolla transfer
5. Transaction recorded in DB

---

## Competitive Context

Based on tutorial by Alexander Iseghohi. Similar to apps like:
- Mint (budget tracking)
- Robinhood (financial aggregation)
- Venmo/Zelle (transfers)

Unique: Self-hosted option, full control over data