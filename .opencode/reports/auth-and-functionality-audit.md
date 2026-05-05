# Auth & Functionality Audit Report

**Date:** 2026-05-05  
**Scope:** Full read-only codebase audit — auth, DAL, actions, components, demo content  
**Auditor:** code-reviewer agent

---

## 1. Executive Summary

The application is a Next.js 16 fintech banking app with a solid architectural foundation. Core patterns (Server Actions, DAL layer, soft-delete, Zod validation, mock token detection) are consistently applied. However, several gaps exist that must be addressed before the app is production-ready:

1. **Demo/placeholder content** is live in production paths (restaurant imagery in landing page, hardcoded avatar CDN URLs in admin dashboard)
2. **Two direct `db` imports** exist in Server Action files, violating the DAL pattern
3. **`dropdown-profile.tsx`** uses hardcoded "John Doe" credentials instead of live session data
4. **Documentation stubs** (`Description placeholder`) remain throughout layout wrapper components
5. **`createTransfer` action** has significant complexity/duplication that warrants refactoring

---

## 2. Auth System Audit

### 2.1 Configuration (`lib/auth-options.ts`)

- ✅ NextAuth v4 with `DrizzleAdapter` for session storage
- ✅ JWT strategy with `id`, `isAdmin`, `isActive` in token
- ✅ Supports Credentials + GitHub + Google OAuth providers
- ✅ `authorize()` callback verifies `isActive` flag before granting session
- ⚠️ **Direct `db` import** in `lib/auth-options.ts` — known DAL violation; NextAuth adapters typically require direct DB access, but should be documented as an explicit exception in `app-config.ts` or `AGENTS.md`

### 2.2 Session Helper (`lib/auth.ts`)

- ✅ `auth()` helper wraps `getServerSession(authOptions)` correctly
- ✅ Used consistently across all protected routes and actions

### 2.3 Route Protection

| Route Group | Protection Method | Status |
| --- | --- | --- |
| `(auth)/` sign-in, sign-up | `AuthLayoutWrapper` redirects logged-in users to `/dashboard` | ✅ Correct |
| `(root)/` dashboard, wallets, transfers, history, settings | `RootLayoutWrapper` calls `auth()` + redirects to `/sign-in` | ✅ Correct |
| `(admin)/` admin | `AdminLayoutWrapper` checks `user.isAdmin` + redirects non-admin to `/dashboard` | ✅ Correct |
| `app/page.tsx` (landing) | No auth — purely static | ✅ Correct per AGENTS.md rule |
| `app/demo/**` | No auth protection | ⚠️ **Gap** — demo routes are publicly accessible; they should either be gated or removed in production |

### 2.4 Middleware (`middleware.ts`)

- ✅ Uses `withAuth` from NextAuth
- ✅ `callbacks.authorized` correctly gates `(root)` and `(admin)` route groups
- ✅ Auth and public paths explicitly excluded

### 2.5 Server Action Auth Patterns

All protected Server Actions call `auth()` as first operation:

- ✅ `plaid.actions.ts` — all 9 actions check `session?.user?.id`
- ✅ `wallet.actions.ts` — `disconnectWallet`, `getUserWallets` check session
- ✅ `transaction.actions.ts` — `getRecentTransactions`, `getTransactionHistory` check session
- ✅ `dwolla.actions.ts` — all actions check session
- ✅ `recipient.actions.ts` — all 4 actions check session
- ✅ `updateProfile.ts` — checks session, resolves userId from session only (never from client input)
- ✅ `admin.actions.ts` — checks session + `isAdmin`
- ✅ `register.ts` — no auth required (public registration)

---

## 3. DAL Pattern Violations

### 3.1 Direct `db` Imports in Server Actions

| File | Violation | Severity |
| --- | --- | --- |
| `actions/dwolla.actions.ts` line 7 | `import { db } from "@/database/db"` | **High** |
| `lib/auth-options.ts` | `import { db } from "@/database/db"` | Medium (likely unavoidable for NextAuth adapter, but undocumented) |

`dwolla.actions.ts` uses `db` directly for:

1. Idempotency check: `db.select().from(dwolla_transfers).where(eq(dwolla_transfers.idempotencyKey, idempotencyKey))`
2. Post-transfer verification: `db.select().from(dwolla_transfers).where(eq(dwolla_transfers.transferUrl, transferUrl))`

These queries should move into `DwollaDal` methods.

### 3.2 No UI/Component DB Import Violations Found

- ✅ No `app/` pages import `db` directly
- ✅ No `components/` files import `db` directly
- ✅ All component data-fetching goes through server wrappers → DAL

---

## 4. Demo / Placeholder Content Inventory

### 4.1 Landing Page (`components/home/home-server-wrapper.tsx`)

**Severity: High — affects production landing page**

```
sampleMenudata images from cdn.shadcnstudio.com:
  - bistro/image-18.png  (restaurant plate photo)
  - bistro/image-19.png  (restaurant plate photo)
  - bistro/image-20.png  (restaurant plate photo)

sampleMenudata avatars from cdn.shadcnstudio.com:
  - avatar-56.png, avatar-46.png, avatar-57.png

sampleMenudata comments:
  - "The ambiance is perfect and the food is absolutely delicious."
  - "Best dining experience in town. The staff is friendly."
  - "Every dish is crafted with care. This place never disappoints!"
```

These are **restaurant testimonials** from a bistro template. They have no relevance to a banking application and undermine credibility.

### 4.2 Admin Dashboard Static Data (`components/admin/admin-data.tsx`)

**Severity: Medium — used as fallback only (live data takes precedence)**

```
statisticsCardData: "Shipped Orders", "Damaged Returns", "Missed Delivery Slots" (logistics domain, not banking)
earningData: Zipcar, Bitbank platforms (placeholder companies)
transactionData: 25 fake transactions with hardcoded CDN avatar URLs
```

Admin dashboard shows `"Sample metrics shown until live data is available."` when no live data exists. The static fallback domain language (shipping/logistics) is wrong for a fintech app. Live data overwrites these when stats are available — but they should still be replaced with banking-appropriate defaults.

### 4.3 Profile Dropdown (`components/shadcn-studio/blocks/dropdown-profile.tsx`)

**Severity: High — used in production navigation**

Hardcoded:

```tsx
<AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" alt="John Doe" />
<span>John Doe</span>
<span>john.doe@example.com</span>
```

This dropdown appears to be used in layout navigation. It must receive live session data as props.

### 4.4 Demo Pages (`app/demo/**`)

**Severity: Low — demo namespace is isolated**

Eight demo pages exist under `/demo/` route prefix:

- `application-shell-01`, `dashboard-shell-01`, `hero-section-41`, `onboarding-feed-01`, etc.

These are functional shadcn-studio block demos. They are not behind auth. They should either be:

- Removed in production build, OR
- Gated behind an `ENABLE_DEMO_PAGES` env flag, OR
- Placed behind `(admin)` auth protection

### 4.5 JSDoc Stubs (`components/layouts/AdminLayoutWrapper.tsx`, `AuthLayoutWrapper.tsx`)

**Severity: Low — cosmetic only**

All JSDoc comments read `"Description placeholder"` and `@author Adminbot`. These should be replaced with real descriptions.

---

## 5. Code Quality Issues

### 5.1 `actions/dwolla.actions.ts` — Complexity & Duplication (Cyclomatic complexity > 15)

The `createTransfer` action contains ~200 lines with:

- Duplicated ledger insertion logic (mock path vs. real DB transaction path are nearly identical)
- `VITEST_DEBUG` global guard (test-environment leak in production code)
- Multiple nested try/catch blocks
- `dataAny` cast to `Record<string, unknown>` to bypass TypeScript — signals a type design gap

**Recommendation:** Extract `insertLedgerAndDwollaTransfer(tx, data)` helper; unify mock/real paths; move the `VITEST_DEBUG` branch to test fixtures only.

### 5.2 `actions/user.actions.ts` — Zod No-Op Pattern

```typescript
const NoInput = z.undefined();
const _v = NoInput.safeParse(undefined);
```

This satisfies a `verify-rules` linter requirement but adds noise. Actions with no input should use `z.void()` or a comment explaining the no-op to future readers.

### 5.3 `components/layouts/payment-transfer-form.tsx` — Test-Only Inputs in Production UI

```tsx
<input data-testid="recipient-email" id="recipient-email" placeholder="Recipient email" />
<input data-testid="sharable-id" id="sharable-id" placeholder="Sharable ID" />
```

These unregistered, uncontrolled inputs exist purely for E2E test targeting. They:

- Are visible in the UI (not `sr-only` / `hidden`)
- Have placeholder text visible to users
- Are not bound to `react-hook-form`

They should use `className="sr-only"` or `aria-hidden` to hide from visual users while remaining testable.

### 5.4 Documentation Stubs

The following files have `"Description placeholder"` JSDoc in every function/interface:

- `components/layouts/AdminLayoutWrapper.tsx`
- `components/layouts/AuthLayoutWrapper.tsx`
- `components/layouts/payment-transfer-form.tsx`
- `actions/plaid.actions.ts` (`processInBatches`)
- `actions/dwolla.actions.ts` (`CreateLedgerSchema`)

---

## 6. Security Review

### 6.1 Sensitive Data Handling

- ✅ `accessToken` and `accountNumberEncrypted` are encrypted at rest via `lib/encryption.ts`
- ✅ `DwollaDal` correctly decrypts on read and encrypts on write
- ✅ Password hashing uses bcrypt with cost factor 12
- ✅ SSN field in `CreateCustomerSchema` is passed to Dwolla but not stored locally

### 6.2 Authorization — Ownership Checks

- ✅ All wallet operations verify `wallet.userId === session.user.id` before mutations
- ✅ `updateProfile` resolves `userId` exclusively from session — cannot be spoofed
- ✅ `deleteRecipient` does not verify recipient ownership before deleting — **GAP**

```typescript
// actions/recipient.actions.ts — no ownership check
await recipientDal.delete(parsed.data.id);
```

An authenticated user can delete any recipient by guessing its ID. Should verify `recipient.userId === session.user.id` first.

### 6.3 Input Validation

- ✅ All Server Actions use Zod `.safeParse()` before processing
- ✅ No raw `req.json()` without schema validation
- ⚠️ `createTransfer` uses `dataAny = parsed.data as unknown as Record<string, unknown>` to access `createLedger` — this field is not in `TransferSchema`, bypassing validation for the ledger sub-object

### 6.4 Environment Variables

- ✅ `app-config.ts` is the canonical env accessor — Zod-validated
- ✅ No direct `process.env` reads in `app/`, `components/`, or `lib/` (except `lib/auth-options.ts` which reads `process.env.NEXTAUTH_SECRET` indirectly via adapter)
- ✅ Documented exceptions: `proxy.ts`, `scripts/seed/run.ts`

---

## 7. Performance Observations

### 7.1 N+1 Prevention

- ✅ `TransactionDal.findByUserIdWithWallets` correctly batches wallet lookups via OR conditions (not `inArray` but functionally equivalent)
- ✅ `getAllBalances` and `getAllWalletsWithDetails` use `processInBatches` to rate-limit Plaid API calls

### 7.2 Parallel Data Fetching

- ✅ `DashboardServerWrapper` uses `Promise.all` for wallets + accounts + transactions
- ✅ `getWalletWithDetails` fetches balance + transactions in parallel

### 7.3 Cache Revalidation

- ✅ `revalidatePath` called after wallet add/remove
- ✅ `revalidateTag("balances", "minutes")` + `updateTag("balances")` used consistently
- ⚠️ `disconnectWallet` only calls `revalidatePath("/")` — should also revalidate `/my-wallets` and `/dashboard`

---

## 8. Issues Priority Matrix

| # | Issue | Severity | File(s) | Type |
| --- | --- | --- | --- | --- |
| 1 | Hardcoded "John Doe" in navigation dropdown | **High** | `components/shadcn-studio/blocks/dropdown-profile.tsx` | Demo content |
| 2 | Restaurant content on landing page | **High** | `components/home/home-server-wrapper.tsx` | Demo content |
| 3 | `deleteRecipient` missing ownership check | **High** | `actions/recipient.actions.ts` | Security |
| 4 | `db` direct import in `dwolla.actions.ts` | **High** | `actions/dwolla.actions.ts` | DAL violation |
| 5 | Demo pages not gated by auth | Medium | `app/demo/**` | Security/Config |
| 6 | Admin fallback data uses logistics domain language | Medium | `components/admin/admin-data.tsx` | Demo content |
| 7 | `createTransfer` complexity/duplication | Medium | `actions/dwolla.actions.ts` | Code quality |
| 8 | Test-only inputs visible in production UI | Medium | `components/layouts/payment-transfer-form.tsx` | UX |
| 9 | `disconnectWallet` incomplete cache invalidation | Low | `actions/wallet.actions.ts` | Performance |
| 10 | JSDoc stubs throughout layout wrappers | Low | `components/layouts/**` | Documentation |
| 11 | Zod no-op pattern in `user.actions.ts` | Low | `actions/user.actions.ts` | Code quality |
