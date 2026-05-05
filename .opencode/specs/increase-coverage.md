# Spec: increase-coverage

Scope: feature

# Feature: Increase Test Coverage

## Overview

Add test coverage to 5 low-coverage modules: user.dal.ts, wallet.dal.ts, plan-ensure.ts, encryption.ts, Settings content components.

## Test File Structure

### 1. tests/unit/dal/user.dal.test.ts

```typescript
describe("userDal", () => {
  // findById tests - mock eq(user.id, id)
  // findByEmail tests - mock eq(user.email, email)
  // findAll tests - mock without where
  // create tests - mock db.insert().values()
  // update tests - mock db.update().set().where()
  // delete tests - mock db.delete().where()
  // findWithProfile tests - mock join
  // updateProfile tests
});
```

### 2. tests/unit/dal/wallet.dal.test.ts

```typescript
describe("walletDal", () => {
  // createWithUser tests
  // findByUserId tests
  // findById tests
  // updateBalance tests
  // findByPlaidItemId tests
  // delete tests
});
```

### 3. tests/unit/scripts/plan-ensure.test.ts

```typescript
describe("planEnsure", () => {
  // parseArgs tests
  // readPlan tests
  // writePlan tests
  // validation tests
});
```

### 4. tests/unit/lib/encryption.test.ts

```typescript
describe("encryption", () => {
  // encrypt/decrypt tests with known vectors
  // hash tests
  // error handling tests
});
```

### 5. tests/unit/components/settings-content.test.tsx

```typescript
describe("SettingsContent", () => {
  // EditAccountForm render
  // DangerZone render
  // SocialUrl render
});
```

## Current vs Target

| Module           | Current | Target |
| ---------------- | ------- | ------ |
| user.dal.ts      | 36%     | 80%    |
| wallet.dal.ts    | 90%     | 95%    |
| plan-ensure.ts   | 15%     | 60%    |
| encryption.ts    | 18%     | 60%    |
| Settings content | 13%     | 60%    |
