# Implementation Commands Reference

**Created:** 2026-05-05  
**Plan:** `integrate-demo-and-fix-auth.plan.md`  
**Purpose:** Exact commands to run at each implementation step, in order

---

## Pre-Implementation Verification

Before touching any code, verify the current state of the 4 confirmed violations:

```bash
# 1. Confirm DAL violation in dwolla.actions.ts
grep -n "from \"@/database/db\"" actions/dwolla.actions.ts

# 2. Confirm missing ownership check in recipient.actions.ts
grep -n "recipientDal.delete" actions/recipient.actions.ts

# 3. Confirm hardcoded identity in dropdown-profile.tsx
grep -n "John Doe\|john.doe@example.com\|shadcnstudio.com/ss-assets/avatar" \
  components/shadcn-studio/blocks/dropdown-profile.tsx

# 4. Confirm bistro content in home-server-wrapper.tsx
grep -n "bistro\|sampleMenudata\|ambiance\|dining" \
  components/home/home-server-wrapper.tsx
```

All 4 should return matches. If any returns empty, re-read the audit report before proceeding.

---

## Phase 1 Commands — Security Fixes

### Step 1.1 — Verify `recipientDal.findById` exists

```bash
grep -n "findById" dal/recipient.dal.ts
```

If not found, add the method before editing `recipient.actions.ts`.

### Step 1.2 — After editing `recipient.actions.ts`

Verify the ownership check is present:

```bash
grep -n "recipient.userId\|access denied\|not found" actions/recipient.actions.ts
```

### Step 1.3 — After editing `dwolla.dal.ts` (new methods)

Verify new methods exist:

```bash
grep -n "findByIdempotencyKey\|findByTransferUrl" dal/dwolla.dal.ts
```

### Step 1.4 — After editing `dwolla.actions.ts` (remove db import)

Verify violation is resolved:

```bash
grep -n "from \"@/database/db\"" actions/dwolla.actions.ts
# Should return NO results
```

### Step 1.5 — Run verify-rules after Phase 1

```bash
bun run verify:rules
```

Expected: no critical violations for `dwolla.actions.ts`.

---

## Phase 2 Commands — Landing Page

### Step 2.1 — Create avatar assets directory

```bash
mkdir -p public/avatars
```

### Step 2.2 — After creating avatars and editing `home-server-wrapper.tsx`

Verify no CDN URLs remain:

```bash
grep -rn "cdn.shadcnstudio.com" components/home/
# Should return NO results
```

Verify banking terms appear:

```bash
grep -n "transfer\|wallet\|account\|savings\|finance" \
  components/home/home-server-wrapper.tsx
```

---

## Phase 3 Commands — Admin Data

### Step 3.1 — After editing `admin-data.tsx`

Verify no CDN URLs remain:

```bash
grep -rn "cdn.shadcnstudio.com\|shadcnstudio.com" components/admin/
# Should return NO results
```

Verify no logistics terms remain:

```bash
grep -n "Shipped\|Damaged\|Delivery Slots\|Zipcar\|Bitbank" \
  components/admin/admin-data.tsx
# Should return NO results
```

Verify no `@shadcnstudio.com` emails remain:

```bash
grep -n "@shadcnstudio.com" components/admin/admin-data.tsx
# Should return NO results
```

---

## Phase 4 Commands — Profile Dropdown & Cache

### Step 4.1 — After editing `dropdown-profile.tsx`

Verify hardcoded identity removed:

```bash
grep -n "John Doe\|john.doe@example.com\|cdn.shadcnstudio.com" \
  components/shadcn-studio/blocks/dropdown-profile.tsx
# Should return NO results
```

Verify props interface exists:

```bash
grep -n "DropdownProfileProps\|name:\|email:\|avatarUrl" \
  components/shadcn-studio/blocks/dropdown-profile.tsx
```

### Step 4.2 — Verify parent layouts pass session props

```bash
grep -n "DropdownProfile\|session\." \
  components/layouts/RootLayoutWrapper.tsx \
  components/layouts/AdminLayoutWrapper.tsx
```

### Step 4.3 — After editing `wallet.actions.ts`

Verify all three revalidation paths are present:

```bash
grep -n "revalidatePath" actions/wallet.actions.ts
# Should show: "/", "/my-wallets", "/dashboard" for disconnectWallet
```

---

## Final Validation Sequence

Run in this exact order after all 4 phases are complete:

```bash
# 1. Format (auto-fixes style issues)
bun run format

# 2. Type check (catches TypeScript errors)
bun run type-check

# 3. Lint (catches code quality issues)
bun run lint:strict

# 4. Policy enforcement (catches DAL violations, env violations, etc.)
bun run verify:rules
```

**All 4 must pass with zero errors before committing.**

---

## Commit Sequence

```bash
# Phase 1
git add actions/recipient.actions.ts dal/recipient.dal.ts \
        dal/dwolla.dal.ts actions/dwolla.actions.ts middleware.ts
git commit -m "fix: add recipient ownership check, move dwolla db to DAL, gate demo pages"

# Phase 2
git add components/home/home-server-wrapper.tsx public/avatars/
git commit -m "fix: replace bistro demo content with banking testimonials on landing page"

# Phase 3
git add components/admin/admin-data.tsx public/avatars/
git commit -m "fix: replace admin static data with banking-appropriate fallback content"

# Phase 4
git add components/shadcn-studio/blocks/dropdown-profile.tsx \
        actions/wallet.actions.ts \
        components/layouts/payment-transfer-form.tsx \
        components/layouts/RootLayoutWrapper.tsx \
        components/layouts/AdminLayoutWrapper.tsx
git commit -m "fix: wire session data into profile dropdown, fix cache invalidation, hide test inputs"
```

---

## Rollback

If any phase breaks the build:

```bash
# Revert last commit
git revert HEAD --no-edit

# Or reset to before all changes (nuclear option)
git stash
```

Do not push broken commits to the remote branch.
