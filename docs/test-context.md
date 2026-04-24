# Test Context & Documentation

**Date:** 2026-04-24  
**Scope:** All tests in `tests/`  
**Status:** COMPLETE

---

## Overview

This document catalogs all tests in the Banking application, their configuration, helpers, and best practices.

---

## Test Inventory

### Vitest Unit Tests (37)

| Path | Purpose |
| --- | --- |
| `tests/unit/actions/dwolla.actions.test.ts` | Dwolla action tests |
| `tests/unit/actions/wallet.actions.test.ts` | Wallet action tests |
| `tests/unit/actions/admin.actions.test.ts` | Admin action tests |
| `tests/unit/actions/user.actions.test.ts` | User action tests |
| `tests/unit/actions/register.test.ts` | Registration tests |
| `tests/unit/actions/updateProfile.test.ts` | Profile update tests |
| `tests/unit/actions/recipient.actions.test.ts` | Recipient action tests |
| `tests/unit/actions/transaction.actions.test.ts` | Transaction action tests |
| `tests/unit/dal/admin.dal.test.ts` | Admin DAL tests |
| `tests/unit/dal/errors.dal.test.ts` | Error DAL tests |
| `tests/unit/dal/wallet.dal.test.ts` | Wallet DAL tests |
| `tests/unit/dal/transaction.dal.test.ts` | Transaction DAL tests |
| `tests/unit/dal/recipient.dal.test.ts` | Recipient DAL tests |
| `tests/unit/dal/dwolla.dal.test.ts` | Dwolla DAL tests |
| `tests/unit/stores/transfer-store.test.ts` | Transfer store tests |
| `tests/unit/stores/filter-store.test.ts` | Filter store tests |
| `tests/unit/stores/toast-store.test.ts` | Toast store tests |
| `tests/unit/stores/ui-store.test.ts` | UI store tests |
| `tests/unit/dashboard-server-wrapper.test.ts` | Dashboard wrapper tests |
| `tests/unit/settings-server-wrapper.test.ts` | Settings wrapper tests |
| `tests/unit/payment-transfer-server-wrapper.test.ts` | Payment transfer wrapper tests |
| `tests/unit/transaction-history-server-wrapper.test.ts` | Transaction history wrapper tests |
| `tests/unit/my-wallets-server-wrapper.test.ts` | My wallets wrapper tests |
| `tests/unit/signin-wrapper.test.ts` | Sign-in wrapper tests |
| `tests/unit/transaction-mapping.test.ts` | Transaction mapping tests |
| `tests/unit/plaid.test.ts` | Plaid utility tests |
| `tests/unit/dwolla.test.ts` | Dwolla utility tests |
| `tests/unit/error-tracking.test.ts` | Error tracking tests |
| `tests/unit/report-parser.test.ts` | Report parser tests |
| `tests/unit/mcp-runner.verify.test.ts` | MCP runner verification tests |
| `tests/unit/mcp-runner.parse.test.ts` | MCP runner parsing tests |
| `tests/unit/plan-ensure.scoring.test.ts` | Plan ensure scoring tests |
| `tests/unit/plan-ensure.match.test.ts` | Plan ensure matching tests |
| `tests/unit/transaction.actions.db-error.test.ts` | Transaction DB error tests |
| `tests/integration/dal/errors.dal.integration.test.ts` | Integration tests |
| `tests/verify/rules.test.ts` | Rules verification tests |
| `tests/verify-rules/verify-rules.test.ts` | Verify rules tests |

### Playwright E2E Tests (10)

| Path | Purpose |
| --- | --- |
| `tests/e2e/auth.spec.ts` | Authentication flows |
| `tests/e2e/dashboard.spec.ts` | Dashboard functionality |
| `tests/e2e/my-wallets.spec.ts` | Wallet management |
| `tests/e2e/payment-transfer.spec.ts` | Payment transfers |
| `tests/e2e/transaction-history.spec.ts` | Transaction history |
| `tests/e2e/settings.spec.ts` | User settings |
| `tests/e2e/admin.spec.ts` | Admin functionality |
| `tests/e2e/wallet-linking.spec.ts` | Bank account linking |
| `tests/e2e/integration/link-and-transfer.spec.ts` | End-to-end flow |
| `tests/e2e/specs/plaid-script.spec.ts` | Plaid integration |

---

## Test Configuration

### Vitest Configuration

- **Config file:** `vitest.config.ts`
- **Test location:** `tests/unit/`, `tests/integration/`
- **Pattern:** `*.test.ts`

### Playwright Configuration

- **Config file:** `playwright.config.ts`
- **Test location:** `tests/e2e/`
- **Pattern:** `*.spec.ts`
- **Requirements:** Port 3000 must be free

---

## Test Helpers

### E2E Helpers (`tests/e2e/helpers/`)

| File                              | Purpose                  |
| --------------------------------- | ------------------------ |
| `tests/e2e/helpers/db.ts`         | Database helpers for E2E |
| `tests/e2e/helpers/auth.ts`       | Authentication helpers   |
| `tests/e2e/helpers/plaid.mock.ts` | Plaid API mocking        |
| `tests/e2e/helpers/plaid.ts`      | Plaid test utilities     |
| `tests/e2e/helpers/dwolla.ts`     | Dwolla test utilities    |

### Unit Mocks (`tests/mocks/`)

| File                        | Purpose              |
| --------------------------- | -------------------- |
| `tests/mocks/handlers.ts`   | MSW request handlers |
| `tests/mocks/msw/server.ts` | MSW server setup     |
| `tests/mocks/ui/select.tsx` | UI component mocks   |

### Key Test Utilities

```typescript
// Example: Using server wrapper test utils
import { extractPropsFromElement } from "../utils/serverWrapperTestUtils";

// Mock pattern for server actions
vi.mock("@/actions/transaction.actions", () => ({
  getTransactionHistory: vi.fn(async () => ({
    ok: true,
    transactions: []
  }))
}));
```

---

## Seed Data

### Seed Credentials

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `seed-user@example.com` |
| Password | `Password123!`          |

### Seed Commands

```bash
# Standard seed
npm run db:seed

# Preview without applying
npm run db:seed -- --dry-run

# Reset (truncate tables)
npm run db:seed -- --reset --yes
```

---

## Running Tests

### Unit Tests (Fast)

```bash
npm run test:browser
```

### E2E Tests (Slow)

```bash
# Ensure port 3000 is free
npm run test:ui
```

### All Tests

```bash
npm run test
```

---

## Test Patterns

### Server Wrapper Testing

```typescript
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({
    user: { id: "user-1", name: "Test User" }
  }))
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  }
}));

vi.mock("@/actions/transaction.actions", () => ({
  getTransactionHistory: vi.fn(async () => ({
    ok: true,
    transactions: []
  }))
}));
```

### Authenticated E2E Tests

```typescript
// Use seeded test user
const testUser = {
  email: "seed-user@example.com",
  password: "Password123!"
};

// Or use auth helper for session creation
import { createAuthenticatedSession } from "./helpers/auth";
```

---

## Best Practices

### DO

- Use web-first assertions (`expect().toHaveText()`, `expect().toBeVisible()`)
- Use `test.step()` to group interactions
- Mock external APIs (Plaid, Dwolla) in unit tests
- Use seeded users for E2E authentication

### DON'T

- Use hard-coded waits (`page.waitForTimeout()`)
- Use `.skip()` or `it.skip()` — fix or remove
- Access DB directly in E2E — use helpers
- Skip test isolation

---

## Verification Checklist

- [x] All 37 unit tests listed
- [x] All 10 E2E specs listed
- [x] Test helpers documented
- [x] Seed instructions included

---

## References

- `AGENTS.md` — Testing guidelines
- `tests/e2e/helpers/plaid.mock.ts` — Mock pattern exemplar
- `package.json` — Test scripts
