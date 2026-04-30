---
name: simplify
description: Simplifies code for clarity without changing behavior. Use for readability, maintainability, and complexity reduction after behavior is understood.
lastReviewed: 2026-04-29
applyTo: "**/*.{ts,tsx,js,jsx}"
platforms:
  - opencode
  - cursor
  - copilot
---

# Simplify - Code Clarity Patterns

## Overview

This skill provides comprehensive guidelines for simplifying code while preserving behavior. It covers refactoring patterns, readability improvements, and complexity reduction.

## Multi-Agent Commands

### OpenCode

```bash
# Find complex functions
grep -r "function.*(" --include="*.ts" | wc -l

# Check complexity
npx complexity-reporter src/
```

### Cursor

```
@simplify
Simplify the transaction service
```

### Copilot

```
/simplify refactor auth module
```

## Simplification Principles

### 1. Single Responsibility

```typescript
// BEFORE - Multiple responsibilities
class UserService {
  async createUser(data: UserData) {
    // Validation
    if (!data.email.includes('@')) throw new Error();
    // Creation
    const user = await db.users.insert(data);
    // Email
    await sendWelcomeEmail(user.email);
    // Logging
    await log('user_created', user.id);
    return user;
  }
}

// AFTER - Single responsibility each
class UserValidator {
  validate(data: UserData): ValidatedData { ... }
}

class UserCreator {
  async create(data: ValidatedData): Promise<User> { ... }
}

class WelcomeEmailService {
  async send(user: User): Promise<void> { ... }
}
```

### 2. Early Returns

```typescript
// BEFORE - Nested conditions
function getUser(id: string) {
  if (id) {
    if (id.length > 0) {
      const user = db.findUser(id);
      if (user) {
        return user;
      }
    }
  }
  return null;
}

// AFTER - Early returns
function getUser(id: string) {
  if (!id || id.length === 0) return null;

  const user = db.findUser(id);
  if (!user) return null;

  return user;
}
```

### 3. Extract Complex Logic

```typescript
// BEFORE - Complex inline logic
function calculateFee(amount: number, type: string) {
  if (type === "transfer") {
    if (amount < 1000) return amount * 0.01;
    else if (amount < 5000) return amount * 0.005;
    else return amount * 0.001;
  } else if (type === "withdraw") {
    if (amount < 500) return 5;
    else return amount * 0.01;
  }
  return 0;
}

// AFTER - Extracted to clear function
function calculateTransferFee(amount: number): number {
  if (amount < 1000) return amount * 0.01;
  if (amount < 5000) return amount * 0.005;
  return amount * 0.001;
}

function calculateWithdrawFee(amount: number): number {
  if (amount < 500) return 5;
  return amount * 0.01;
}
```

## Refactoring Patterns

### Rename for Clarity

```typescript
// BEFORE - Cryptic names
function p(u: string) {
  return u.split("@")[0];
}

// AFTER - Descriptive names
function getUsernameFromEmail(email: string): string {
  return email.split("@")[0];
}
```

### Remove Dead Code

```typescript
// BEFORE - Unused code
function processData(data: unknown) {
  // Old validation - no longer used
  // if (data.old) return null;

  // Current logic
  return transform(data);
}

// AFTER - Clean code
function processData(data: Data): ProcessedData {
  return transform(data);
}
```

### Simplify Conditionals

```typescript
// BEFORE - Complex boolean
if (
  user.isActive &&
  user.hasVerifiedEmail &&
  (!user.isBlocked || user.isAdmin)
) {
  // Do something
}

// AFTER - Extracted with clear name
function canAccessSystem(user: User): boolean {
  return (
    user.isActive &&
    user.hasVerifiedEmail &&
    (user.isAdmin || !user.isBlocked)
  );
}

if (canAccessSystem(user)) {
  // Do something
}
```

## Banking-Specific Simplifications

### Transaction Processing

```typescript
// BEFORE - Complex transaction logic
async function processTransaction(tx: Transaction) {
  if (tx.type === "transfer") {
    if (tx.amount > 0) {
      if (tx.fromUserId === tx.toUserId) {
        return { error: "Cannot transfer to self" };
      }
      const fromWallet = await getWallet(tx.fromUserId);
      if (fromWallet.balance >= tx.amount) {
        await deductBalance(fromWallet, tx.amount);
        await addBalance(tx.toUserId, tx.amount);
        return { success: true };
      }
      return { error: "Insufficient funds" };
    }
    return { error: "Invalid amount" };
  }
  // ... more types
}

// AFTER - Simplified with clear functions
async function processTransaction(tx: Transaction): Promise<Result> {
  if (!isValidAmount(tx.amount)) {
    return { error: "Invalid amount" };
  }

  if (tx.type === "transfer") {
    return await processTransfer(tx);
  }

  if (tx.type === "withdraw") {
    return await processWithdraw(tx);
  }

  return { error: "Unknown transaction type" };
}

async function processTransfer(
  tx: TransferTransaction
): Promise<Result> {
  if (isSameUser(tx.fromUserId, tx.toUserId)) {
    return { error: "Cannot transfer to self" };
  }

  const hasSufficientFunds = await checkSufficientFunds(
    tx.fromUserId,
    tx.amount
  );
  if (!hasSufficientFunds) {
    return { error: "Insufficient funds" };
  }

  await executeTransfer(tx);
  return { success: true };
}
```

### Wallet Connection

```typescript
// BEFORE - Nested callbacks
async function connectWallet(userId: string, publicToken: string) {
  const accessToken = await exchangeToken(publicToken);
  if (accessToken) {
    const account = await getAccountInfo(accessToken);
    if (account) {
      const wallet = await createWallet(userId, accessToken, account);
      if (wallet) {
        await syncTransactions(wallet.id);
        return wallet;
      }
    }
  }
  return null;
}

// AFTER - Flat async/await
async function connectWallet(
  userId: string,
  publicToken: string
): Promise<Wallet> {
  const accessToken = await exchangeToken(publicToken);
  if (!accessToken) throw new Error("Token exchange failed");

  const account = await getAccountInfo(accessToken);
  if (!account) throw new Error("Account not found");

  const wallet = await createWallet(userId, accessToken, account);
  await syncTransactions(wallet.id);

  return wallet;
}
```

## Code Smells to Fix

### 1. Long Functions

```typescript
// Split into smaller functions
// BEFORE: 100+ lines
// AFTER: Functions < 20 lines each
```

### 2. Magic Numbers

```typescript
// BEFORE
if (amount > 10000) { ... }

// AFTER
const MAX_TRANSFER_AMOUNT = 10000;
if (amount > MAX_TRANSFER_AMOUNT) { ... }
```

### 3. Nested Callbacks

```typescript
// BEFORE - Callback hell
getData(data => {
  processData(data, result => {
    saveData(result, saved => {
      // More nesting
    });
  });
});

// AFTER - Async/await
const data = await getData();
const result = await processData(data);
const saved = await saveData(result);
```

### 4. Duplicate Code

```typescript
// BEFORE - Repeated logic
function validateUser(user: User) {
  if (!user.email.includes("@")) return false;
  if (!user.name) return false;
  return true;
}

function validateAdmin(admin: Admin) {
  if (!admin.email.includes("@")) return false;
  if (!admin.name) return false;
  return true;
}

// AFTER - Shared validation
function validateEmail(email: string): boolean {
  return email.includes("@");
}

function validatePerson(person: Person): boolean {
  return validateEmail(person.email) && !!person.name;
}
```

## Testing After Simplification

### Preserve Behavior

```typescript
// Ensure simplified code produces same results
describe("simplified processTransaction", () => {
  it("should return error for invalid amount", async () => {
    const result = await processTransaction({
      amount: -100,
      type: "transfer"
    });
    expect(result.error).toBe("Invalid amount");
  });

  it("should return error for insufficient funds", async () => {
    const result = await processTransaction({
      amount: 10000,
      type: "transfer",
      fromUserId: "user1"
    });
    expect(result.error).toBe("Insufficient funds");
  });
});
```

## Best Practices

### 1. Test Before and After

```bash
# Run tests to verify behavior
npm test -- --grep "processTransaction"
```

### 2. Make Small Changes

```bash
# Commit after each simplification
git commit -m "refactor: simplify validation logic"
```

### 3. Document Complex Decisions

```typescript
// Keep comments for complex logic
// This complex formula is based on:
// - Industry standard fee structure
// - Regulatory requirements for reporting
const fee = calculateFee(amount, type);
```

### 4. Use TypeScript

```typescript
// Leverage types for clarity
type TransactionResult =
  | { success: true; transactionId: string }
  | { error: string };
```

## Cross-References

- **refactor**: For refactoring patterns
- **code-philosophy**: For internal logic
- **testing-skill**: For testing patterns

## Validation Commands

```bash
# Check function length
npx tsc --noEmit | grep "Function"

# Find code duplication
npx duplicate-checker src/

# Complexity check
npx eslint --max-lines-per-function 50
```

## Performance Tips

1. Simplify before optimizing
2. Profile before refactoring
3. Keep functions under 20 lines
4. Use meaningful names
