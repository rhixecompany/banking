# Plan: Integrate Demo Content & Fix Auth/DAL Issues

**Created:** 2026-05-05  
**Based on:** `.opencode/reports/auth-and-functionality-audit.md`  
**Specs:** `.opencode/specs/demo-integration.spec.md`, `.opencode/specs/seed-users.spec.md`

---

## Overview

This plan resolves all High and Medium issues identified in the auth & functionality audit. It is divided into 4 phases that must be executed in order. Each phase is independently committable.

**Files affected: 11 (requires a plan per AGENTS.md policy)**

---

## Phase 1 — Security Fixes (no UI changes)

**Goal:** Close the two security gaps before any demo content work begins.

### 1.1 Fix `deleteRecipient` ownership check

**File:** `actions/recipient.actions.ts`

Add ownership verification before deletion:

```typescript
// After auth() check, before dal.delete():
const recipient = await recipientDal.findById(parsed.data.id);
if (!recipient || recipient.userId !== session.user.id) {
  return { ok: false, error: "Recipient not found or access denied" };
}
await recipientDal.delete(parsed.data.id);
```

Requires: `recipientDal.findById(id)` method — verify it exists in `dal/recipient.dal.ts`; add if missing.

### 1.2 Move `db` import out of `dwolla.actions.ts`

**Files:** `dal/dwolla.dal.ts`, `actions/dwolla.actions.ts`

Add two DAL methods to `dwolla.dal.ts`:

- `findByIdempotencyKey(key: string)` — replaces inline idempotency check
- `findByTransferUrl(url: string)` — replaces inline post-transfer verification

Remove `import { db } from "@/database/db"` from `actions/dwolla.actions.ts`.

### 1.3 Gate demo pages behind env flag

**File:** `middleware.ts` (or `app/demo/layout.tsx`)

Add guard: if `process.env.ENABLE_DEMO_PAGES !== "true"`, return 404 for `/demo/**` routes.  
Alternatively, wrap in `app/(admin)/demo/` route group (preferred — reuses existing auth infrastructure).

**Commit after Phase 1:** `fix: add recipient ownership check, move dwolla db to DAL, gate demo pages`

---

## Phase 2 — Replace Landing Page Demo Content

**Goal:** Replace bistro restaurant content with banking-appropriate content.

**File:** `components/home/home-server-wrapper.tsx`

Replace `sampleMenudata` array (3 items with restaurant images + bistro comments) with banking-themed testimonials:

```typescript
const testimonials = [
  {
    name: "Sarah M.",
    role: "Small Business Owner",
    comment:
      "Managing multiple accounts has never been easier. The transfer flow is seamless.",
    avatar: "/avatars/avatar-1.png" // local asset, not CDN
  },
  {
    name: "James T.",
    role: "Freelancer",
    comment:
      "I moved my savings here after the Plaid integration made linking accounts effortless.",
    avatar: "/avatars/avatar-2.png"
  },
  {
    name: "Maria L.",
    role: "Personal Finance Enthusiast",
    comment:
      "The transaction history and real-time balance updates keep me on top of my finances.",
    avatar: "/avatars/avatar-3.png"
  }
];
```

Add 3 placeholder avatar PNGs to `public/avatars/` (can be initials-based SVGs generated at build time).

**Commit after Phase 2:** `fix: replace bistro demo content with banking testimonials on landing page`

---

## Phase 3 — Replace Admin Static Data

**Goal:** Replace logistics/shipping-themed admin fallback data with banking-appropriate data.

**File:** `components/admin/admin-data.tsx`

#### 3.1 Replace `statisticsCardData`

Current titles: "Shipped Orders", "Damaged Returns", "Missed Delivery Slots"  
Replace with: "Total Transfers", "Active Wallets", "Linked Accounts", "Pending Transactions"

Use Lucide icons already imported: `ArrowLeftRight`, `Wallet`, `Link`, `Clock`

#### 3.2 Replace `earningData`

Current: Zipcar, Bitbank with CDN avatars  
Replace with fictional banking platforms using initials avatars or local SVGs:

- "NovaPay" — Direct Deposit
- "ClearBank" — Savings Transfer
- "TrustVault" — Investment Account

Remove all `cdn.shadcnstudio.com` URLs.

#### 3.3 Replace `transactionData`

25 hardcoded transactions with `@shadcnstudio.com` emails and CDN avatars.  
Replace with ~10 seed-realistic entries using `seed-user@example.com` domain and local avatars.

**Commit after Phase 3:** `fix: replace admin static data with banking-appropriate fallback content`

---

## Phase 4 — Fix Profile Dropdown & Cache Invalidation

**Goal:** Wire live session data into navigation dropdown; fix incomplete cache invalidation.

### 4.1 Fix `dropdown-profile.tsx`

**File:** `components/shadcn-studio/blocks/dropdown-profile.tsx`

Change component signature to accept session props:

```typescript
interface DropdownProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function DropdownProfile({
  name,
  email,
  avatarUrl
}: DropdownProfileProps) {
  // replace hardcoded "John Doe" / "john.doe@example.com" with props
}
```

Update all parent components that render `<DropdownProfile />` to pass session data.

### 4.2 Fix `disconnectWallet` cache invalidation

**File:** `actions/wallet.actions.ts`

Add missing revalidation paths after `disconnectWallet`:

```typescript
revalidatePath("/my-wallets");
revalidatePath("/dashboard");
revalidatePath("/"); // already present
```

### 4.3 Hide test-only inputs in payment transfer form

**File:** `components/layouts/payment-transfer-form.tsx`

Add `className="sr-only"` to `#recipient-email` and `#sharable-id` inputs so they remain testable but are visually hidden.

**Commit after Phase 4:** `fix: wire session data into profile dropdown, fix cache invalidation, hide test inputs`

---

## Files Changed (11 total)

| # | File | Phase | Change Type |
| --- | --- | --- | --- |
| 1 | `actions/recipient.actions.ts` | 1 | Security fix |
| 2 | `dal/recipient.dal.ts` | 1 | New DAL method |
| 3 | `dal/dwolla.dal.ts` | 1 | New DAL methods (×2) |
| 4 | `actions/dwolla.actions.ts` | 1 | Remove direct `db` import |
| 5 | `middleware.ts` or `app/demo/layout.tsx` | 1 | Gate demo pages |
| 6 | `components/home/home-server-wrapper.tsx` | 2 | Replace demo content |
| 7 | `public/avatars/` (new dir + 3 files) | 2 | Add local avatars |
| 8 | `components/admin/admin-data.tsx` | 3 | Replace all static data |
| 9 | `components/shadcn-studio/blocks/dropdown-profile.tsx` | 4 | Accept session props |
| 10 | `actions/wallet.actions.ts` | 4 | Cache invalidation fix |
| 11 | `components/layouts/payment-transfer-form.tsx` | 4 | Hide test inputs |

---

## Out of Scope (defer to separate plan)

- `createTransfer` refactor (complexity/duplication) — complexity reduction only, no behavior change
- JSDoc stub replacement throughout layout wrappers — cosmetic only
- `user.actions.ts` Zod no-op pattern — cosmetic only
- `lib/auth-options.ts` direct `db` import — likely required by NextAuth adapter; document as exception

---

## Pre-Commit Checklist

After all phases:

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
```
