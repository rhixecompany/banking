# Banking Project Implementation Plan

## Overview

This document outlines the implementation plan for enhancing the Banking project with Plaid and Dwolla integrations, database improvements, and comprehensive testing.

## Completed Analysis

### Documentation Files Reviewed

- `docs/dwolla-context.md` - Dwolla API integration details
- `docs/plaid-context.md` - Plaid API integration details

### Config Files Reviewed

- `next.config.ts` - Has React Compiler, typed routes, security headers ✓
- `postcss.config.mjs` - Simple Tailwind setup ✓
- `.prettierrc.ts` - Comprehensive formatting ✓
- `eslint.config.mts` - Extensive linting rules ✓

### Existing Implementations Reviewed

- `lib/plaid.ts` - Plaid client configured ✓
- `lib/dwolla.ts` - Dwolla client configured ✓
- `actions/dwolla.actions.ts` - Basic operations exist
- `actions/bank.actions.ts` - Basic operations exist
- `dal/bank.dal.ts` - Bank DAL with encryption ✓
- `database/schema.ts` - Existing tables analyzed

---

## Implementation Plan

### Phase 1: Database Enhancements

#### 1.1 Add Dwolla-Specific Tables

Add to `database/schema.ts`:

- `dwolla_customers` - Maps userId to Dwolla customer URL
- `dwolla_funding_sources` - Stores bank account references
- `dwolla_transfers` - Tracks A2A transfers

### Phase 2: TypeScript Types

#### 2.1 Create Dwolla Types

File: `types/dwolla.ts`

- DwollaCustomer types
- DwollaFundingSource types
- DwollaTransfer types
- DwollaWebhookEvent types

#### 2.2 Create Plaid Types

File: `types/plaid.ts`

- PlaidLinkToken types
- PlaidAccount types
- PlaidTransaction types
- PlaidWebhookEvent types

### Phase 3: Data Access Layer

#### 3.1 Create Dwolla DAL

File: `dal/dwolla.dal.ts`

- findCustomerByUserId
- createCustomer
- createFundingSource
- findFundingSourcesByCustomerId
- createTransfer
- findTransfersByUserId
- findTransferById

### Phase 4: Server Actions

#### 4.1 Create Plaid Actions

File: `actions/plaid.actions.ts`

- createLinkToken - Create Plaid Link token for user
- exchangePublicToken - Exchange public token for access token
- getAccounts - Retrieve linked bank accounts
- getTransactions - Fetch transactions for an account
- getInstitution - Get bank institution details
- refreshAccounts - Refresh account data
- getBalance - Get account balances

#### 4.2 Enhance Dwolla Actions

File: `actions/dwolla.actions.ts`

- Enhance existing actions with better error handling
- Add webhook processing
- Add transfer status checks

### Phase 5: Pages

#### 5.1 Enhance My Banks Page

File: `app/(root)/my-banks/page.tsx`

- Display linked banks with institution logos
- Show account balances
- Add "Link New Bank" functionality
- Add disconnect bank option

### Phase 6: Testing

#### 6.1 Unit Tests

Create:

- `tests/unit/dwolla.test.ts`
- `tests/unit/plaid.test.ts`
- `tests/unit/bank.dal.test.ts`
- `tests/unit/dwolla.dal.test.ts`

#### 6.2 E2E Tests

Create:

- `tests/e2e/bank-linking.spec.ts`
- `tests/e2e/payment-transfer.spec.ts`
- `tests/e2e/my-banks.spec.ts`

### Phase 7: Optional Enhancements

#### 7.1 Plaid Link Component

Consider creating `components/plaid-link.tsx` - A reusable React component for Plaid Link integration

---

## Priority Order

1. Database schema updates
2. TypeScript types creation
3. DAL implementation
4. Server Actions implementation
5. Page enhancements
6. Testing
7. Optional components

---

## Notes

- All database operations should use the DAL pattern
- All mutations must go through Server Actions
- Follow existing code conventions from AGENTS.md
- Ensure all tests pass before merging
- Use Zod for input validation
