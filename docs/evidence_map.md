<!-- Evidence map linking review claims to file:line locations for reviewers. -->

# Evidence Map

This file maps claims in AGENTS.md and review-comments.md to concrete file:line locations found during the audit.

- Claim: Many Zod schemas use metadata that must be `.describe()` instead of `.meta()` (lint rule)
  - Evidence:
    - actions/plaid.actions.ts: CreateLinkTokenSchema `.meta(...)` (lines 21-27)
    - actions/register.ts: RegisterSchema uses `.meta(...)` across fields (lines 12-60)
    - actions/updateProfile.ts: UpdateProfileSchema uses `.meta(...)` (lines 12-46)

- Claim: Protected Server Actions should check auth() before parsing inputs
  - Evidence:
    - actions/plaid.actions.ts: exchangePublicToken calls safeParse() then auth() (lines 149-162)
    - actions/plaid.actions.ts: getAccounts safeParse() then auth() (lines 252-269)
    - actions/wallet.actions.ts: disconnectWallet parses input before auth() (lines 30-41)

- Claim: DALs should filter soft-deleted rows in SQL, not in JS
  - Evidence:
    - dal/wallet.dal.ts: findByUserId filters deletedAt in JS `.filter(wallet => wallet.deletedAt === null)` (lines 51-61)

- Claim: Many Server Actions return `unknown` or `any` in their return types
  - Evidence:
    - actions/register.ts: registerUser returns user?: unknown (lines 79-119)
    - actions/plaid.actions.ts: several functions return `transactions?: unknown[]` (e.g., getTransactions return type lines 316-364)

Use this map to quickly navigate to the offending lines when applying fixes.
