# Domain Concepts

## Key Entities

### User

- Core authentication entity with email/password
- Soft-deleted (has `deletedAt` timestamp)
- Linked to `user_profiles` for extended data

### UserProfile

- Extended user data: address, phone, SSN (encrypted)
- One-to-one relationship with `users`
- SSN stored encrypted using `lib/utils` encryption

### Bank

- Connected bank accounts via Plaid
- Stores Plaid `access_token` (encrypted)
- Associated with single user
- Supports multiple bank connections

### Wallet

- Internal wallet accounts (checking/savings)
- Linked to user and optional Dwolla `fundingSourceUrl`
- Used for transfers between platform users

### Transaction

- All money movement records
- Types: `credit` (incoming) or `debit` (outgoing)
- Channels: `online`, `in_store`, `other`
- Soft-deleted

### Recipient

- Saved transfer recipients
- Dwolla `on-demand authorization` for recurring transfers
- Associated with single user

## Relationships

```
users 1──1 user_profiles
users 1──N banks
users 1──N wallets
users 1──N transactions
users 1──N recipients
wallets 1──N transactions (sender or receiver)
```

## Value Objects

### Money

- All amounts stored as `string` type
- Never use floating point for currency
- Display formatted with `formatCurrency` utility

### Status

- Transaction: `pending`, `processing`, `completed`, `failed`
- Bank connection: `active`, `disconnected`
- KYC verification: `not_started`, `pending`, `verified`, `failed`
