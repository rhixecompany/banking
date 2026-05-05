# Spec: wallet-dal-tests

Scope: repo

# Coverage: wallet.dal

## Current State

- wallet.dal.ts at 90% Statements, 96.15% Lines
- Test file exists with all 9 methods having at least one test
- All public methods are covered but edge cases may be missing

## Target Coverage: 95%+ (almost there, add edge cases)

## Functions to Cover (all 9 actual methods - note corrections)

1. findById - decrypt access token on retrieve
2. findByUserId - with soft-delete awareness (filters deletedAt IS NULL)
3. findBySharableId - decrypt access token (NOTE: NOT findByPlaidItemId)
4. findByAccountId - decrypt access token on retrieve
5. createWallet - encrypt accessToken at rest, return plaintext token (NOTE: NOT createWithUser)
6. softDelete - sets deletedAt timestamp
7. hardDelete - permanent removal
8. softDeleteByUserId - bulk soft-delete
9. hardDeleteByUserId - bulk hard-delete

## Test Pattern

- Test all public functions thoroughly
- Cover edge cases: encryption/decryption, bulk operations
- Mock @/lib/encryption (encrypt/decrypt helpers)
- Focus on createWallet: verify token is encrypted before save but plaintext in return value
- Test bulk delete methods with multiple wallets

## Critical Notes

- Method `createWithUser` does NOT exist → actual method is `createWallet`
- Method `findByPlaidItemId` does NOT exist → use `findBySharableId` or `findByAccountId`
- Method `updateBalance` does NOT exist (if mentioned elsewhere, verify it exists)
- Wallet DAL is already well-covered; focus on reaching 95%+ by adding edge case tests
