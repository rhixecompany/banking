# Naming Conventions

## File Naming

### Server Actions

- Use `dot.camelCase.ts` naming
- Examples: `auth.signin.ts`, `plaid.actions.ts`, `transaction.actions.ts`

### DAL (Data Access Layer)

- Use `dot.camelCase.ts` naming
- Examples: `user.dal.ts`, `transaction.dal.ts`, `wallet.dal.ts`

### Components

- Use PascalCase for component files
- Examples: `SignInClient.tsx`, `PaymentTransferForm.tsx`
- Use `-server-wrapper.tsx` and `-client-wrapper.tsx` suffixes for wrappers

### Types

- Use PascalCase for type files
- Examples: `transaction.ts`, `wallet.ts`, `user.ts`

## Component Structure

### Server/Client Wrapper Pattern

```
components/
├── sign-in/
│   ├── sign-in-server-wrapper.tsx   # Fetches data, passes to client
│   ├── sign-in-client-wrapper.tsx   # Client logic with useForm
│   └── SignInClient.tsx             # Pure client component
```

## Database Naming

### Tables

- Use `snake_case` for table names
- Examples: `users`, `user_profiles`, `transactions`, `dwolla_transfers`

### Columns

- Use `snake_case` for column names
- Examples: `created_at`, `deleted_at`, `sender_wallet_id`

### Enums

- Use `snake_case` for enum names
- Examples: `transaction_status`, `transaction_type`, `user_role`

## TypeScript Types

### Interfaces

- Use PascalCase with descriptive names
- Examples: `UserWithProfile`, `WalletWithDetails`, `TransactionStats`

### Type Aliases

- Use PascalCase
- Examples: `Transaction = InferSelectModel<typeof transactions>`

## Examples from Codebase

### Action Files

```typescript
// src/actions/auth.signin.ts
// src/actions/transaction.actions.ts
// src/actions/plaid.actions.ts
```

### DAL Files

```typescript
// src/dal/user.dal.ts
// src/dal/transaction.dal.ts
// src/dal/wallet.dal.ts
```

### Component Files

```typescript
// src/components/sign-in/sign-in-server-wrapper.tsx
// src/components/payment-transfer/payment-transfer-client-wrapper.tsx
```
