# Banking — API Reference

## Overview

Banking uses **Next.js Server Actions** for all mutations and limited **API Routes** for auth callbacks. There are no traditional REST endpoints for CRUD operations.

## Server Actions

All server actions live in `src/actions/` and follow a consistent pattern:

### Authentication

#### `auth.signup(input)`
- **File:** `src/actions/auth.signup.ts`
- **Method:** Server Action
- **Purpose:** Register a new user account
- **Input:**
```typescript
{
  email: string    // Valid email
  name: string     // Full name
  password: string // Min 8 characters
}
```
- **Returns:**
```typescript
{ ok: true, user: UserType } | { ok: false, error: string }
```

#### `auth.signin(credentials)`
- **File:** `src/actions/auth.signin.ts`
- **Method:** Server Action (via NextAuth)
- **Purpose:** Authenticate existing user
- **Input:** `{ email, password }`

### Plaid (Bank Linking)

#### `plaid.createLinkToken()`
- **File:** `src/actions/plaid.actions.ts`
- **Purpose:** Generate a Plaid Link token for frontend
- **Returns:** `{ linkToken: string }`

#### `plaid.exchangePublicToken(publicToken)`
- **File:** `src/actions/plaid.actions.ts`
- **Purpose:** Exchange public_token for access_token
- **Returns:** `{ success: boolean }`

#### `plaid.getAccounts()`
- **File:** `src/actions/plaid.actions.ts`
- **Purpose:** Retrieve linked bank accounts
- **Returns:** `Account[]`

### Dwolla (ACH Transfers)

#### `dwolla.createCustomer(userData)`
- **File:** `src/actions/dwolla.actions.ts`
- **Purpose:** Create Dwolla customer

#### `dwolla.addFundingSource(customerId, bankData)`
- **File:** `src/actions/dwolla.actions.ts`
- **Purpose:** Link bank funding source

#### `dwolla.initiateTransfer(transferData)`
- **File:** `src/actions/dwolla.actions.ts`
- **Purpose:** Execute ACH transfer (idempotent)

### Transactions

#### `transaction.create(data)`
- **File:** `src/actions/transaction.actions.ts`
- **Purpose:** Record a new transaction

#### `transaction.list(filters)`
- **File:** `src/actions/transaction.actions.ts`
- **Purpose:** List transactions with filtering

### User Management

#### `user.updateProfile(data)`
- **File:** `src/actions/user.actions.ts`
- **Purpose:** Update user profile information

#### `user.delete()`
- **File:** `src/actions/user.actions.ts`
- **Purpose:** Soft-delete user account

## API Routes

### `GET /api/auth/[...nextauth]`
- **Purpose:** NextAuth.js callback handlers
- **Providers:** Credentials (email/password)

### `POST /api/auth/[...nextauth]`
- **Purpose:** Sign-in, sign-out, session management

## DAL Methods

Data Access Layer methods in `src/dal/`:

| Method | Purpose | Returns |
|--------|---------|---------|
| `userDal.findByEmail(email)` | Find user by email | `UserType \| null` |
| `userDal.findById(id)` | Find user by ID | `UserType \| null` |
| `bankDal.findByUserId(id)` | Get user's banks | `BankType[]` |
| `transactionDal.findByUserId(id)` | Get user's transactions | `TransactionType[]` |
| `recipientDal.findByUserId(id)` | Get saved recipients | `RecipientType[]` |

## Response Format

All Server Actions return discriminated unions:

```typescript
// Success
{ ok: true, data: T }

// Error
{ ok: false, error: string }
```
