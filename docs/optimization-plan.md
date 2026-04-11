# Production Readiness Optimization Plan

## Overview

This plan addresses Critical and High Priority issues to make the banking application production-ready.

---

## Phase 1: Critical Fixes

### 1. Delete Sentry Leftover Code

- **Issue**: `app/api/sentry-example-api/` folder still exists after Sentry removal
- **Action**: Delete `app/api/sentry-example-api/` folder
- **Status**: ✅ Complete

### 2. Fix Environment Variables

- **Issue**: Missing required validations and duplicate OAuth credentials
- **Actions**:
  - Make `DATABASE_URL` required in production
  - Require `NEXTAUTH_SECRET`
  - Remove duplicate `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` (keep `AUTH_GITHUB_*`)
  - Remove duplicate `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (keep `AUTH_GOOGLE_*`)
  - Add `PLAID_SECRET` required validation for bank features
  - Add `PLAID_BASE_URL` optional override
  - Add `DWOLLA_SECRET` required validation for transfers
  - Add `DWOLLA_BASE_URL` optional override
  - Add `ENCRYPTION_KEY` for token encryption
  - Add `REDIS_URL` for optional rate limiting
- **Status**: ⏳ In progress (env naming alignment pending)

---

## Phase 2: High Priority

### 3. Add Rate Limiting with Upstash Redis

- **Issue**: No rate limiting after middleware cleanup
- **Actions**:
  - Re-add `@upstash/ratelimit` import
  - Re-add `@upstash/redis` import
  - Add rate limit config for auth routes (sign-in, sign-up)
  - Keep existing auth redirect logic
- **Note**: Redis is already configured in `.env` (`REDIS_URL`)
- **Status**: ✅ Complete

### 4. Minimal Error Tracking

- **Issue**: No error monitoring after Sentry removal
- **Actions**:
  - Create `lib/error-tracking.ts` utility
  - Add `errors` table to database schema
  - Implement simple error logger that writes to database
  - No external service - keeps it minimal
- **Status**: ✅ Complete

### 5. Encrypt Access Tokens at Rest

- **Issue**: Access tokens stored in plain text in database
- **Actions**:
  - Create `lib/encryption.ts` with AES-256-GCM encryption
  - Add `ENCRYPTION_KEY` env var (32-byte key)
  - Replace `btoa`/`atob` in `lib/utils.ts` with real encryption
  - Modify `bank.dal.ts` to encrypt on create, decrypt on read
- **Status**: ✅ Complete

---

## New Files to Create

| File                    | Purpose                               |
| ----------------------- | ------------------------------------- |
| `lib/encryption.ts`     | AES-256-GCM encrypt/decrypt utilities |
| `lib/error-tracking.ts` | Simple error logging to database      |

## Files to Modify

| File | Changes |
| --- | --- |
| `app/api/sentry-example-api/` | DELETE entire folder |
| `lib/env.ts` | Add required validations, remove duplicates |
| `proxy.ts` | Add rate limiting back |
| `lib/utils.ts` | Replace btoa/atob with real encryption |
| `dal/bank.dal.ts` | Encrypt on write, decrypt on read |
| `database/schema.ts` | Add errors table |

---

## Implementation Order

1. ✅ Delete sentry-example-api folder
2. ✅ Fix env.ts (required vars)
3. ✅ Add encryption.ts
4. ✅ Update bank.dal.ts for encryption
5. ✅ Update utils.ts (remove btoa/atob)
6. ✅ Add rate limiting back to middleware
7. ✅ Create error tracking
8. ✅ Add errors table to schema
9. ⏳ Run npm audit fix (optional)

---

## Post-Implementation Tasks

- Run `npm run type-check`
- Run `npm run lint`
- Test rate limiting
- Test encryption/decryption
- Verify error tracking works
