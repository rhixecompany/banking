# Plan: Phase 1 Refactor — Banking App

**TL;DR:** Six targeted tracks to clean up dead code, fix type unsafety, enforce DAL consistency, cache the N+1 Plaid balance loop, and add missing store and admin test coverage. No new features. No UI changes. All tracks are independently executable except Track D (layout type safety), which depends on Track C (DAL cleanup) being stable first.

---

## Do Not Re-Touch

These files were intentionally left as-is or fixed in a prior session. Do not modify them:

- `lib/actions/updateProfile.ts` — direct `db` calls are acceptable here due to password-verification complexity (user decision)
- `lib/auth-config.ts` — does not exist; debt #6 is pre-resolved, nothing to delete
- `proxy.ts` — middleware placement is a separate concern (debt #5), out of scope
- `app/middleware.ts` — already deleted in a prior session, do not recreate
- `eslint.config.mts` — already finalized, do not touch
- `opencode.json` + `.opencode/mcp-runner.ts` — infrastructure, out of scope

---

## Discoveries

### Dead Code

| File | Issue |
| --- | --- |
| `lib/dal/base.dal.ts` | Three standalone utility fns (`findById`, `findAll`, `deleteById`) — never called |
| `lib/dal/index.ts` | Re-exports `base.dal.ts` — becomes dead after file is deleted |
| `tests/unit/HelloWorld.test.tsx` | `expect(true).toBe(true)` placeholder — no real coverage |

### Type Safety Issues

| File | Issue |
| --- | --- |
| `app/(root)/layout.tsx` | Calls `getLoggedInUser()` → `{ name?, email? } \| undefined`, then casts `as unknown as User` |
| `lib/actions/admin.actions.ts` | Calls `db.update(users).set({ isAdmin })` directly, bypassing `userDal.update()` |

### Metadata Bugs

| File | Issue |
| --- | --- |
| `app/(root)/dashboard/page.tsx` | Title is `"Dashboard \| Banking"` — missing "Horizon" |
| `app/(root)/page.tsx` | No `export const metadata` at all |

### N+1 Issue

| File | Issue |
| --- | --- |
| `lib/actions/plaid.actions.ts` | `getAllBalances()` calls `getBalance()` per bank in a `Promise.all` loop — no caching |

### Missing Test Coverage

| Gap                 | Target                                |
| ------------------- | ------------------------------------- |
| No store unit tests | 4 stores: UI, Transfer, Filter, Toast |
| No admin E2E spec   | Admin dashboard access control        |

---

## Track A — Quick Fixes

No dependencies. Run first or in parallel with Track B.

### A1 — Fix dashboard page title

**File:** `app/(root)/dashboard/page.tsx`

```ts
// Before
export const metadata: Metadata = {
  title: "Dashboard | Banking"
};

// After
export const metadata: Metadata = {
  title: "Dashboard | Horizon Banking"
};
```

### A2 — Add missing metadata to home page

**File:** `app/(root)/page.tsx`

Add at the top of the file (after imports):

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Horizon Banking",
  description: "Your personal banking dashboard"
};
```

### A3 — Delete placeholder test file

**File:** `tests/unit/HelloWorld.test.tsx` — delete entirely.

### A4 — Remove JSDoc placeholder stubs

Search all files listed below for the string `"Description placeholder"` and delete only those stub strings (the `/** Description placeholder */` comment lines). Do not add new JSDoc. Leave all other comments intact.

Files to scan:

- `lib/actions/user.actions.ts`
- `lib/actions/bank.actions.ts`
- `lib/actions/transaction.actions.ts`
- `lib/actions/recipient.actions.ts`
- `lib/actions/dwolla.actions.ts`
- `lib/actions/register.ts`
- `lib/dal/bank.dal.ts`
- `lib/dal/transaction.dal.ts`
- `lib/dal/recipient.dal.ts`
- `lib/dal/dwolla.dal.ts`

---

## Track B — shadcn-studio Prune

No dependencies. Run in parallel with Track A.

### B1 — Delete all root-level wrapper files

Delete every file in `components/shadcn-studio/` matching these patterns:

- `*-server-wrapper.tsx` (12 files)
- `*-client-wrapper.tsx` (12 files)

These are 100% unused in production. Full list:

```text
components/shadcn-studio/accordion-client-wrapper.tsx
components/shadcn-studio/accordion-server-wrapper.tsx
components/shadcn-studio/alert-dialog-client-wrapper.tsx
components/shadcn-studio/alert-dialog-server-wrapper.tsx
components/shadcn-studio/avatar-client-wrapper.tsx
components/shadcn-studio/avatar-server-wrapper.tsx
components/shadcn-studio/badge-client-wrapper.tsx
components/shadcn-studio/badge-server-wrapper.tsx
components/shadcn-studio/breadcrumb-client-wrapper.tsx
components/shadcn-studio/breadcrumb-server-wrapper.tsx
components/shadcn-studio/button-client-wrapper.tsx
components/shadcn-studio/button-server-wrapper.tsx
components/shadcn-studio/calendar-client-wrapper.tsx
components/shadcn-studio/calendar-server-wrapper.tsx
components/shadcn-studio/card-client-wrapper.tsx
components/shadcn-studio/card-server-wrapper.tsx
components/shadcn-studio/carousel-client-wrapper.tsx
components/shadcn-studio/carousel-server-wrapper.tsx
components/shadcn-studio/chart-client-wrapper.tsx
components/shadcn-studio/chart-server-wrapper.tsx
components/shadcn-studio/checkbox-client-wrapper.tsx
components/shadcn-studio/checkbox-server-wrapper.tsx
```

### B2 — Delete unused block files

Delete the following block files — confirmed unused in all production pages:

```text
components/shadcn-studio/blocks/login-page-01/
components/shadcn-studio/blocks/register-01/
components/shadcn-studio/blocks/blog-component-01/
components/shadcn-studio/blocks/footer-component-01/
components/shadcn-studio/blocks/navbar-component-01/
components/shadcn-studio/blocks/account-settings-01/account-settings-01.tsx
components/shadcn-studio/blocks/account-settings-01/content/email-password.tsx
components/shadcn-studio/blocks/account-settings-01/content/personal-info.tsx
components/shadcn-studio/blocks/logo.tsx
components/shadcn-studio/blocks/data-table/data-table-04.tsx
```

**Do NOT delete:**

- `components/shadcn-studio/blocks/menu-dropdown.tsx` — transitively used via `hero-section-41/header.tsx` which is active in production
- `components/shadcn-studio/blocks/menu-navigation.tsx` — same reason

---

## Track C — DAL Consistency

No dependencies. Run in parallel with Tracks A and B.

### C1 — Fix admin actions to use userDal

**File:** `lib/actions/admin.actions.ts`

Replace direct `db.update()` calls with `userDal.update()`:

```ts
// Before — toggleAdmin action body
await db
  .update(users)
  .set({ isAdmin: parsed.data.makeAdmin })
  .where(eq(users.id, parsed.data.userId));

// After
await userDal.update(parsed.data.userId, {
  isAdmin: parsed.data.makeAdmin
});
```

```ts
// Before — setActive action body
await db
  .update(users)
  .set({ isActive: parsed.data.isActive })
  .where(eq(users.id, parsed.data.userId));

// After
await userDal.update(parsed.data.userId, {
  isActive: parsed.data.isActive
});
```

After both replacements, remove the now-unused imports: `db`, `users`, `eq`.

Add import if not already present:

```ts
import { userDal } from "@/lib/dal";
```

### C2 — Delete base.dal.ts

**File:** `lib/dal/base.dal.ts` — delete entirely.

The three standalone utility functions (`findById<T>`, `findAll<T>`, `deleteById<T>`) are never called by any DAL class, action, or test. The `UserDal` class in `lib/dal/user.dal.ts` extends `BaseDal` from its own internal class — not these functions.

### C3 — Remove base.dal.ts re-export from index

**File:** `lib/dal/index.ts`

Remove the line that re-exports `base.dal.ts`. Keep all other exports unchanged.

```ts
// Remove this line (exact wording may vary):
export * from "./base.dal";
```

---

## Track D — Layout Type Safety

**Depends on:** Track C complete and stable.

### D1 — Replace unsafe cast in layout

**File:** `app/(root)/layout.tsx`

1. Replace the `getLoggedInUser()` call with `getUserWithProfile()`.
2. Remove the `as unknown as User` cast.
3. Update the import — `getUserWithProfile` is exported from `lib/actions/user.actions.ts`.
4. Update the type annotation from `User` to `UserWithProfile` (from `@/types/user`).

```ts
// Before
import { getLoggedInUser } from "@/lib/actions/user.actions";
import type { User } from "@/types";

const user = await getLoggedInUser();
if (!user) redirect("/sign-in");

// passed to Sidebar and MobileNav as:
<Sidebar user={user as unknown as User} ... />
<MobileNav user={user as unknown as User} ... />

// After
import { getUserWithProfile } from "@/lib/actions/user.actions";
import type { UserWithProfile } from "@/types/user";

const result = await getUserWithProfile();
if (!result.ok || !result.user) redirect("/sign-in");
const user: UserWithProfile = result.user;

<Sidebar user={user} ... />
<MobileNav user={user} ... />
```

### D2–D4 — Verify component prop types

After D1, check that `Sidebar`, `MobileNav`, and `Footer` accept `UserWithProfile` without type errors. If `SidebarProps`, `MobileNavProps`, or `FooterProps` in `types/index.d.ts` reference the legacy `User` interface with mismatched fields, update those prop type definitions to use `UserWithProfile` from `@/types/user`.

Files to check:

- `components/sidebar/sidebar.tsx`
- `components/mobile-nav/mobile-nav.tsx`
- `components/footer/footer.tsx`

Run `npm run type-check` after D1 to surface any prop mismatch — fix only what type-check reports.

---

## Track E — Plaid N+1 Cache Fix

No dependencies. Run in parallel with Tracks A, B, C.

### E1 — Wrap getAllBalances with "use cache"

**File:** `lib/actions/plaid.actions.ts`

Extract the loop body of `getAllBalances()` into a new cached helper, or add the `"use cache"` directive with `cacheLife` and `cacheTag` directly to the function.

```ts
// Before
export async function getAllBalances(): Promise<{
  ok: boolean;
  balances?: Record<string, PlaidBalance[]>;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const result = await getUserBanks();
  if (!result.ok || !result.banks)
    return { ok: false, error: result.error };

  const entries = await Promise.all(
    result.banks.map(async bank => {
      const bal = await getBalance({ bankId: bank.id });
      return [bank.id, bal.ok ? (bal.balances ?? []) : []] as const;
    })
  );

  return { ok: true, balances: Object.fromEntries(entries) };
}

// After — add "use cache" block at function top
export async function getAllBalances(): Promise<{
  ok: boolean;
  balances?: Record<string, PlaidBalance[]>;
  error?: string;
}> {
  "use cache";
  const { cacheLife } =
    await import("next/dist/server/use-cache/cache-life");
  const { cacheTag } =
    await import("next/dist/server/use-cache/cache-tag");

  const session = await auth();
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  cacheLife("minutes");
  cacheTag(`balances-${session.user.id}`);

  const result = await getUserBanks();
  if (!result.ok || !result.banks)
    return { ok: false, error: result.error };

  const entries = await Promise.all(
    result.banks.map(async bank => {
      const bal = await getBalance({ bankId: bank.id });
      return [bank.id, bal.ok ? (bal.balances ?? []) : []] as const;
    })
  );

  return { ok: true, balances: Object.fromEntries(entries) };
}
```

### E2 — Invalidate balances cache on bank mutations

**File:** `lib/actions/plaid.actions.ts`

In `exchangePublicToken()` and `removeBank()`, after the mutation succeeds, add:

```ts
import { unstable_updateTag as updateTag } from "next/cache";

// After successful bank add or remove:
updateTag(`balances-${session.user.id}`);
```

---

## Track F — Test Coverage

Run last — validates all changes from Tracks A–E are type-correct and behaviorally sound.

### F1 — UI store unit tests

**New file:** `tests/unit/stores/ui-store.test.ts`

Cover:

- Default state: `sidebarOpen: false`, `activeModal: null`, `drawerOpen: false`
- `setSidebarOpen(true)` / `setSidebarOpen(false)`
- `toggleSidebar()` flips the value
- `openModal("transfer")` sets `activeModal`
- `closeModal()` sets `activeModal` to `null`
- `setDrawerOpen(true)` / `toggleDrawer()`

### F2 — Transfer store unit tests

**New file:** `tests/unit/stores/transfer-store.test.ts`

Cover:

- Default state: step index 0, empty `formData`, `status: "idle"`
- `nextStep()` advances index; does not exceed last step
- `prevStep()` decrements index; does not go below 0
- `goToStep(n)` jumps to step `n`
- `updateFormData({ amount: "100" })` merges into `formData`
- `setStatus("loading")` updates status
- `setError("msg")` sets `errorMessage`
- `setTransferUrl("http://...")` sets `transferUrl`
- `reset()` returns all state to defaults

### F3 — Filter store unit tests

**New file:** `tests/unit/stores/filter-store.test.ts`

Cover:

- Default state: no date range, no category, empty `searchQuery`, `page: 1`, `pageSize: 20`
- `setDateRange(range)` updates range
- `setCategory("Food")` updates category
- `setSearchQuery("rent")` updates query
- `setPage(3)` updates page
- `setPageSize(50)` updates pageSize
- Setting any filter (`setCategory`, `setDateRange`, `setSearchQuery`) resets `page` to 1
- `reset()` returns all state to defaults

### F4 — Toast store unit tests

**New file:** `tests/unit/stores/toast-store.test.ts`

Cover:

- Default state: `toasts: []`
- `addToast({ title: "Done", type: "success" })` adds entry with auto-generated id
- `addToast({ id: "x", title: "Done" })` uses provided id
- `removeToast("x")` removes matching toast by id
- `clearToasts()` empties array
- Adding multiple toasts produces independent entries

### F5 — Admin E2E spec

**New file:** `tests/e2e/admin.spec.ts`

Cover:

- Unauthenticated request to `/admin` redirects to `/sign-in`
- Non-admin authenticated user redirected away from `/admin`
- Admin user can load `/admin` and sees the admin dashboard content

---

## Execution Order

```text
Track A (quick fixes)    ─┐
Track B (dead UI files)  ─┤─► Track C (DAL cleanup) ─► Track D (layout types)
Track E (Plaid cache)    ─┘

Track F (tests) ─► runs last, after all above tracks complete
```

Tracks A, B, C, and E have no inter-dependencies and can be executed in parallel. Track D must wait for Track C to be complete. Track F must run after all other tracks.

---

## Relevant Files

### Modified

- `app/(root)/dashboard/page.tsx` — A1
- `app/(root)/page.tsx` — A2
- `app/(root)/layout.tsx` — D1
- `lib/actions/admin.actions.ts` — C1
- `lib/actions/plaid.actions.ts` — E1, E2
- `lib/dal/index.ts` — C3
- `components/sidebar/sidebar.tsx` — D2 (verify only)
- `components/mobile-nav/mobile-nav.tsx` — D3 (verify only)
- `components/footer/footer.tsx` — D4 (verify only)
- `types/index.d.ts` — D2–D4 (update prop types if type-check fails)

### Deleted

- `tests/unit/HelloWorld.test.tsx` — A3
- `lib/dal/base.dal.ts` — C2
- `components/shadcn-studio/*-server-wrapper.tsx` (12 files) — B1
- `components/shadcn-studio/*-client-wrapper.tsx` (12 files) — B1
- `components/shadcn-studio/blocks/login-page-01/` — B2
- `components/shadcn-studio/blocks/register-01/` — B2
- `components/shadcn-studio/blocks/blog-component-01/` — B2
- `components/shadcn-studio/blocks/footer-component-01/` — B2
- `components/shadcn-studio/blocks/navbar-component-01/` — B2
- `components/shadcn-studio/blocks/account-settings-01/account-settings-01.tsx` — B2
- `components/shadcn-studio/blocks/account-settings-01/content/email-password.tsx` — B2
- `components/shadcn-studio/blocks/account-settings-01/content/personal-info.tsx` — B2
- `components/shadcn-studio/blocks/logo.tsx` — B2
- `components/shadcn-studio/blocks/data-table/data-table-04.tsx` — B2

### Created

- `tests/unit/stores/ui-store.test.ts` — F1
- `tests/unit/stores/transfer-store.test.ts` — F2
- `tests/unit/stores/filter-store.test.ts` — F3
- `tests/unit/stores/toast-store.test.ts` — F4
- `tests/e2e/admin.spec.ts` — F5

### Scanned for JSDoc stubs (A4)

- `lib/actions/user.actions.ts`
- `lib/actions/bank.actions.ts`
- `lib/actions/transaction.actions.ts`
- `lib/actions/recipient.actions.ts`
- `lib/actions/dwolla.actions.ts`
- `lib/actions/register.ts`
- `lib/dal/bank.dal.ts`
- `lib/dal/transaction.dal.ts`
- `lib/dal/recipient.dal.ts`
- `lib/dal/dwolla.dal.ts`

---

## Validation

Run in order after all tracks complete. All must pass before done.

```bash
npm run type-check
npm run lint:strict
npm run test:browser
npm run test:ui
```
