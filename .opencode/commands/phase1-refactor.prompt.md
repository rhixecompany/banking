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

---

---

# Phase 1 & 2 — Frontend UI + Infrastructure Refactor Plan

**Version:** 1.0 | **Date:** 2026-04-04 | **Status:** Approved

---

## Table of Contents

<!-- markdownlint-disable MD012 -->

1. [Prerequisites & Pending Work](#1-prerequisites--pending-work)
2. [Documentation Fetch](#2-documentation-fetch)
3. [Frontend UI Optimization](#3-frontend-ui-optimization)
4. [Playwright E2E Optimization](#4-playwright-e2e-optimization)
5. [Infrastructure Documentation Fetch](#5-infrastructure-documentation-fetch)
6. [Dockerfiles — All Services](#6-dockerfiles--all-services)
7. [Dockerfile Optimization — Dev vs Production](#7-dockerfile-optimization--dev-vs-production)
8. [Environment Variables & Secrets](#8-environment-variables--secrets)
9. [Traefik on Docker Swarm](#9-traefik-on-docker-swarm)
10. [GitHub Actions](#10-github-actions)
11. [Performance Review](#11-performance-review)
12. [Final Project Review](#12-final-project-review)
13. [Summary Report](#13-summary-report)
14. [Deployment Pipeline](#14-deployment-pipeline)
15. [Documentation](#15-documentation)

---

## Decisions Log

| Question | Answer |
| --- | --- |
| Deployment target | Self-hosted VPS/server |
| Domain | Localhost / internal DNS only (self-signed TLS) |
| Registry | GitHub Container Registry (`ghcr.io`) |
| Deploy mechanism | SSH + `docker stack deploy` to remote Swarm |
| UI goal | All: a11y + performance + visual polish |
| React-Bits | Not installed — want to add it |
| ShadCN-Studio | Keep remaining files, optimize what's left |
| Secrets | Docker Swarm secrets + `.env` files |
| Swarm nodes | Single node Swarm |
| Observability | Prometheus + Grafana |
| Playwright external APIs | Real Plaid/Dwolla sandbox |
| Performance scope | All layers (frontend + DB + cache) |
| Report format | `docs/reports/*.md` |

---

## 1. Prerequisites & Pending Work

Complete before starting any other task.

### Checklist

- [ ] Fix all `lint:strict` errors in source `.ts`/`.tsx` files
- [ ] Verify `npm run type-check` passes with zero errors
- [ ] Commit all ~82 staged/unstaged changes: `refactor: complete D1/B2/F5 type system and test cleanup`
- [ ] Confirm `npm run test:browser` passes after commit

### Known Lint Issues to Fix

| File | Rule | Fix |
| --- | --- | --- |
| `app/(auth)/layout.tsx:17` | `better-tailwindcss/enforce-consistent-class-order` | Reorder `font-inter` Tailwind classes |
| `app/(root)/layout.tsx:25` | `better-tailwindcss/enforce-consistent-class-order` | Same as above |
| `app/global-error.tsx:22` | `jsx-a11y/html-has-lang` | Add `lang="en"` to `<html>` |
| `app/(admin)/layout.tsx:107` | `jsx-a11y/anchor-is-valid` | Replace `<a href="#">` with `<button>` or valid `<Link>` |
| `providers/*-store-provider.tsx` (4 files) | TBD lines ~45–46 | Re-run lint to identify after above fixes |

```bash
# Verify after each fix
npm run lint:strict 2>&1 | grep -E "\.(ts|tsx):" | grep -v node_modules
```

---

## 2. Documentation Fetch

**Goal:** Fetch official docs for all key integrations and save as Markdown in `docs/`.

### Output Structure

```text
docs/
├── plaid/
│   ├── quickstart.md
│   ├── link-guide.md
│   └── transactions.md
├── dwolla/
│   ├── quickstart.md
│   └── transfers.md
├── react-bits/
│   └── overview.md
├── shadcn/
│   ├── components.md
│   └── theming.md
└── nextjs/
    ├── app-router-caching.md
    └── use-cache-directive.md
```

### Fetch URLs

```text
Plaid:
  https://plaid.com/docs/quickstart/
  https://plaid.com/docs/link/
  https://plaid.com/docs/transactions/

Dwolla:
  https://developers.dwolla.com/docs
  https://developers.dwolla.com/docs/balance/transfer-money-between-users

React-Bits:
  https://www.react-bits.dev/docs/introduction

shadcn/ui:
  https://ui.shadcn.com/docs/components
  https://ui.shadcn.com/docs/theming

Next.js 16:
  https://nextjs.org/docs/app/building-your-application/caching
  https://nextjs.org/docs/app/api-reference/directives/use-cache
```

**Tool:** Use `MCP_DOCKER_fetch` to retrieve each URL, then `MCP_DOCKER_write_file` to save.

### Checklist

- [ ] Create `docs/` directory structure
- [ ] Fetch and save Plaid docs (3 files)
- [ ] Fetch and save Dwolla docs (2 files)
- [ ] Fetch and save React-Bits docs (1 file)
- [ ] Fetch and save shadcn/ui docs (2 files)
- [ ] Fetch and save Next.js 16 cache docs (2 files)
- [ ] Create `docs/README.md` index linking all files

---

## 3. Frontend UI Optimization

**Persona:** Reviewer — audit every page, then apply fixes using shadcn MCP tools.

### Pages Inventory

| Route | File | Group |
| --- | --- | --- |
| `/` | `app/page.tsx` | root redirect |
| `/dashboard` | `app/(root)/dashboard/page.tsx` | protected |
| `/my-banks` | `app/(root)/my-banks/page.tsx` | protected |
| `/payment-transfer` | `app/(root)/payment-transfer/page.tsx` | protected |
| `/settings` | `app/(root)/settings/page.tsx` | protected |
| `/transaction-history` | `app/(root)/transaction-history/page.tsx` | protected |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | auth |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | auth |
| `/admin` | `app/(admin)/admin/page.tsx` | admin |
| `404` | `app/not-found.tsx` | error |
| `500` | `app/global-error.tsx` | error |

### 3a — Accessibility (a11y) Fixes

```tsx
// app/global-error.tsx — Fix missing lang prop
// BEFORE
<html>
// AFTER
<html lang="en">

// app/(admin)/layout.tsx:107 — Fix invalid anchor
// BEFORE
<a href="#">Dashboard</a>
// AFTER
<button type="button">Dashboard</button>
```

- [ ] Fix `html-has-lang` on `app/global-error.tsx`
- [ ] Fix `anchor-is-valid` on `app/(admin)/layout.tsx`
- [ ] Add `aria-label` to all icon-only buttons across all pages
- [ ] Verify color contrast meets WCAG AA on all pages
- [ ] Confirm all form inputs have associated `<label>` elements via `htmlFor`

### 3b — Performance (Suspense + Lazy Loading)

```tsx
// Pattern: wrap heavy sections in Suspense
import { Suspense } from "react";
import { TransactionTableSkeleton } from "@/components/transaction-history";

export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={<TransactionTableSkeleton />}>
      <TransactionHistoryClientWrapper />
    </Suspense>
  );
}
```

```tsx
// Pattern: lazy-load chart components
import dynamic from "next/dynamic";

const DoughnutChart = dynamic(
  () => import("@/components/doughnut-chart/doughnut-chart"),
  { ssr: false }
);
```

- [ ] Verify `loading.tsx` skeletons are content-accurate for each route
- [ ] Add `Suspense` boundaries around heavy components in `dashboard/page.tsx`
- [ ] Use `next/dynamic` with `{ ssr: false }` for chart and Plaid components
- [ ] Verify `"use cache"` directive is on all read-heavy DAL functions
- [ ] Confirm `cacheTag` + `updateTag` pairing exists for all mutations

### 3c — Visual Polish (shadcn/ui Consistency)

Use `shadcn_search_items_in_registries` and `shadcn_view_items_in_registries` to audit.

- [ ] Replace any raw HTML `<table>` with shadcn `<Table>` component
- [ ] Replace any raw `<select>` with shadcn `<Select>`
- [ ] Standardize button variants: `default`, `outline`, `ghost`, `destructive`
- [ ] Fix all remaining Tailwind class order warnings (`better-tailwindcss`)
- [ ] Verify all cards use `<Card>`, `<CardHeader>`, `<CardContent>`
- [ ] Optimize `components/shadcn-studio/datatable-transaction.tsx` to use `<DataTable>` from `components/ui/data-table/`
- [ ] Optimize `components/shadcn-studio/dropdown-profile.tsx` to use `<DropdownMenu>` from `components/ui/`

### 3d — React-Bits Integration

```bash
# Install React-Bits
npm install react-bits
```

- [ ] Install `react-bits` and verify TypeScript types resolve
- [ ] Add `AnimatedNumber` to `components/animated-counter/` for balance display
- [ ] Add `FadeIn` for page-level entry transitions
- [ ] Document usage in `docs/react-bits/overview.md`

---

## 4. Playwright E2E Optimization

**Scope:** Real Plaid/Dwolla sandbox — tests run against sandbox credentials.

### Test File Inventory

```text
tests/e2e/
├── admin.spec.ts              ← F5 fix applied (expect.soft → expect)
├── auth.spec.ts
├── bank-linking.spec.ts
├── dashboard.spec.ts
├── my-banks.spec.ts
├── payment-transfer.spec.ts
├── settings.spec.ts
├── transaction-history.spec.ts
├── global-setup.ts
├── global-teardown.ts
└── helpers/
    ├── auth.ts
    └── db.ts
```

### New Helper — Plaid Sandbox (`tests/e2e/helpers/plaid.ts`)

```typescript
import type { Page } from "@playwright/test";

export async function completePlaidFlow(page: Page): Promise<void> {
  await page.click('[data-testid="plaid-link-button"]');
  const frame = page.frameLocator('[title="Plaid Link"]');
  await frame.locator('button:has-text("Continue")').click();
  await frame.locator('[name="username"]').fill("user_good");
  await frame.locator('[name="password"]').fill("pass_good");
  await frame.locator('button:has-text("Submit")').click();
  await frame.locator('button:has-text("Continue")').click();
}
```

### New Helper — Dwolla Sandbox (`tests/e2e/helpers/dwolla.ts`)

```typescript
import type { Page } from "@playwright/test";

export async function completeDwollaTransfer(
  page: Page,
  amount: string
): Promise<void> {
  await page.fill('[data-testid="transfer-amount"]', amount);
  await page.click('[data-testid="transfer-submit"]');
  await page.waitForSelector('[data-testid="transfer-success"]');
}
```

### Playwright Config Improvements (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry"
  },
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["html", { open: "on-failure" }]]
});
```

### Checklist

- [ ] Add `data-testid` attributes to all interactive elements missing them
- [ ] Create `tests/e2e/helpers/plaid.ts` with Plaid sandbox flow
- [ ] Create `tests/e2e/helpers/dwolla.ts` with Dwolla sandbox flow
- [ ] Add `PLAID_SANDBOX_USERNAME`, `PLAID_SANDBOX_PASSWORD` to `.env.example`
- [ ] Add `PLAYWRIGHT_BASE_URL` support to `playwright.config.ts`
- [ ] Set `retries: 2` in CI environment
- [ ] Add `screenshot`, `video` on-failure config
- [ ] Add GitHub Actions reporter
- [ ] Verify `admin.spec.ts` passes after `expect.soft` → `expect` fix
- [ ] Run `npm run test:ui` — fix all failures

---

## 5. Infrastructure Documentation Fetch

Same approach as Task 2 using `MCP_DOCKER_fetch`.

### Fetch URLs

```text
Docker Swarm:
  https://docs.docker.com/engine/swarm/
  https://docs.docker.com/engine/swarm/secrets/
  https://docs.docker.com/engine/swarm/stack-deploy/

Traefik:
  https://doc.traefik.io/traefik/providers/docker/
  https://doc.traefik.io/traefik/user-guides/docker-compose/acme-tls/
  https://doc.traefik.io/traefik/operations/dashboard/
  https://doc.traefik.io/traefik/middlewares/overview/

Postgres / Redis:
  https://hub.docker.com/_/postgres
  https://hub.docker.com/_/redis
```

### Output Structure

```text
docs/
├── docker/
│   ├── swarm-overview.md
│   ├── secrets.md
│   └── stack-deploy.md
└── traefik/
    ├── quickstart.md
    ├── docker-swarm.md
    ├── https-tls.md
    ├── dashboard.md
    └── middlewares.md
```

### Checklist

- [ ] Fetch and save 3 Docker Swarm docs
- [ ] Fetch and save 4 Traefik docs
- [ ] Fetch and save Postgres + Redis Docker Hub pages
- [ ] Update `docs/README.md` index

---

## 6. Dockerfiles — All Services

### Service Map

| Service | Dockerfile | Base Image |
| --- | --- | --- |
| Next.js app (prod) | `compose/production/node/Dockerfile` | `gcr.io/distroless/nodejs22-debian12:nonroot` |
| Next.js app (dev) | `compose/development/node/Dockerfile` | `node:22-alpine` |
| Next.js app (local) | `compose/local/node/Dockerfile` | `node:22-alpine` |
| PostgreSQL | Official | `postgres:17-alpine` |
| Redis | Official | `redis:7-alpine` |
| Traefik | Official (new) | `traefik:v3.3` |
| Prometheus | Official (new) | `prom/prometheus:latest` |
| Grafana | Official (new) | `grafana/grafana:latest` |

### New Files to Create

```text
compose/production/traefik/
├── traefik.yml
└── dynamic/
    ├── tls.yml
    └── middlewares.yml

stacks/
├── app.stack.yml
├── traefik.stack.yml
└── monitoring.stack.yml

scripts/
├── read-secrets.sh
├── gen-certs.sh
└── server-setup.sh
```

### Checklist

- [ ] Create `compose/production/traefik/` directory
- [ ] Create `stacks/` directory with all 3 stack files
- [ ] Create `scripts/` helper scripts

---

## 7. Dockerfile Optimization — Dev vs Production

### Differences

| Concern | Development | Production |
| --- | --- | --- |
| Base image | `node:22-alpine` (full Node) | `distroless/nodejs22-debian12:nonroot` |
| Dev dependencies | Installed | Pruned after build |
| Source code | Bind-mounted (hot reload) | Copied — standalone output |
| Build step | None — runs `npm run dev` | `npm run build:standalone` |
| User | root | `nonroot` UID 65532 |
| Image size | ~800 MB | ~200 MB |
| Cache mounts | `--mount=type=cache` | `--mount=type=cache` |
| Security | `no-new-privileges` | `no-new-privileges` + distroless |

### Production Dockerfile Additions

```dockerfile
# Pin exact Node version
FROM node:22.13.1-alpine AS builder

# OCI labels
LABEL org.opencontainers.image.source="https://github.com/YOUR_ORG/banking"
LABEL org.opencontainers.image.description="Banking App"

# HEALTHCHECK in image
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
```

### Development Dockerfile Fix

```dockerfile
# REMOVE unnecessary native build deps (not needed for Next.js)
# RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
```

### Checklist

- [ ] Pin exact Node version in all 3 Dockerfiles
- [ ] Add OCI `LABEL` metadata to production Dockerfile
- [ ] Remove unused `apk` native build deps from dev Dockerfile
- [ ] Add `HEALTHCHECK` instruction to production image
- [ ] Update entrypoint to `scripts/read-secrets.sh` in production
- [ ] Document differences in `docs/docker/dev-vs-prod.md`

---

## 8. Environment Variables & Secrets

### Current Files

```text
.envs/local/.env.local             ← development
.envs/production/.env.production   ← production template (never commit real values)
.env.example                       ← public template
```

### Secrets Strategy

Sensitive values use Docker Swarm secrets. Non-sensitive values use `.env` files.

```bash
# Create Swarm secrets on the server (run once)
echo "your-encryption-key" | docker secret create banking_encryption_key -
echo "your-nextauth-secret" | docker secret create banking_nextauth_secret -
echo "postgresql://..." | docker secret create banking_database_url -
echo "your-plaid-secret" | docker secret create banking_plaid_secret -
echo "your-dwolla-secret" | docker secret create banking_dwolla_secret -
```

### Secrets Entrypoint (`scripts/read-secrets.sh`)

```bash
#!/bin/sh
set -e

load_secret() {
  local name="$1"
  local file_var="${name}_FILE"
  eval local file_path="\${$file_var:-}"
  if [ -f "$file_path" ]; then
    export "$name=$(cat "$file_path")"
  fi
}

load_secret ENCRYPTION_KEY
load_secret NEXTAUTH_SECRET
load_secret DATABASE_URL
load_secret PLAID_SECRET
load_secret DWOLLA_SECRET

exec "$@"
```

### Stack Secret Config (`stacks/app.stack.yml` excerpt)

```yaml
services:
  app:
    secrets:
      - banking_encryption_key
      - banking_nextauth_secret
      - banking_database_url
    environment:
      ENCRYPTION_KEY_FILE: /run/secrets/banking_encryption_key
      NEXTAUTH_SECRET_FILE: /run/secrets/banking_nextauth_secret
      DATABASE_URL_FILE: /run/secrets/banking_database_url

secrets:
  banking_encryption_key:
    external: true
  banking_nextauth_secret:
    external: true
  banking_database_url:
    external: true
```

### Checklist

- [ ] Create `scripts/read-secrets.sh`
- [ ] Update production `Dockerfile` entrypoint to `read-secrets.sh`
- [ ] Create `stacks/app.stack.yml` with `secrets:` block
- [ ] Document all vars in `docs/env-vars.md` (sensitive vs plain)
- [ ] Verify `.envs/production/.env.production` is in `.gitignore`
- [ ] Update `.env.example` with `_FILE` variants documented
- [ ] Create `docs/secrets-management.md` with all `docker secret create` commands

---

## 9. Traefik on Docker Swarm

**Target:** Single-node Swarm, self-signed TLS (internal DNS), Prometheus metrics, secured dashboard, HTTP→HTTPS redirect.

### Static Config (`compose/production/traefik/traefik.yml`)

```yaml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
  websecure:
    address: ":443"
    http:
      tls: {}
  traefik:
    address: ":8080"

metrics:
  prometheus:
    addEntryPointsLabels: true
    addServicesLabels: true
    addRoutersLabels: true
    entryPoint: traefik

log:
  level: INFO
  format: json

accessLog:
  format: json

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    swarmMode: true
    network: traefik-public
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

### Middlewares (`compose/production/traefik/dynamic/middlewares.yml`)

```yaml
http:
  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 50
    security-headers:
      headers:
        stsSeconds: 31536000
        stsIncludeSubdomains: true
        forceSTSHeader: true
        contentTypeNosniff: true
        browserXssFilter: true
        referrerPolicy: "strict-origin-when-cross-origin"
    dashboard-auth:
      basicAuth:
        usersFile: /run/secrets/traefik_dashboard_users
    compress:
      compress: {}
```

### TLS Config (`compose/production/traefik/dynamic/tls.yml`)

```yaml
tls:
  options:
    default:
      minVersion: VersionTLS12
      cipherSuites:
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
        - TLS_AES_256_GCM_SHA384
  stores:
    default:
      defaultCertificate:
        certFile: /certs/cert.pem
        keyFile: /certs/key.pem
```

### Generate Self-Signed Certs (`scripts/gen-certs.sh`)

```bash
#!/bin/bash
set -euo pipefail
mkdir -p compose/production/traefik/certs
openssl req -x509 -nodes -days 3650 -newkey rsa:4096 \
  -keyout compose/production/traefik/certs/key.pem \
  -out compose/production/traefik/certs/cert.pem \
  -subj "/CN=banking.internal" \
  -addext "subjectAltName=DNS:banking.internal,DNS:traefik.banking.internal,DNS:grafana.banking.internal,DNS:prometheus.banking.internal"
echo "Certs generated in compose/production/traefik/certs/"
```

### Init Commands (run once on server)

```bash
docker swarm init
docker network create --driver overlay --attachable traefik-public
echo "admin:$(openssl passwd -apr1 'your-password')" | \
  docker secret create traefik_dashboard_users -
echo "your-grafana-password" | docker secret create grafana_admin_password -
docker stack deploy -c stacks/traefik.stack.yml traefik
docker stack deploy -c stacks/app.stack.yml banking
```

### Checklist

- [ ] Create `compose/production/traefik/traefik.yml`
- [ ] Create `compose/production/traefik/dynamic/middlewares.yml`
- [ ] Create `compose/production/traefik/dynamic/tls.yml`
- [ ] Create `compose/production/traefik/prometheus.yml`
- [ ] Create `stacks/traefik.stack.yml` (Traefik + Prometheus + Grafana)
- [ ] Create `stacks/app.stack.yml` with Traefik labels on app service
- [ ] Create `scripts/gen-certs.sh`
- [ ] Add `compose/production/traefik/certs/` to `.gitignore`
- [ ] Add Grafana dashboard JSON for Traefik metrics to `compose/production/traefik/grafana/`
- [ ] Document Swarm init steps in `docs/traefik/swarm-setup.md`

---

## 10. GitHub Actions

### Current Workflow State

| Workflow | State |
| --- | --- |
| `.github/workflows/ci.yml` | Solid — test + playwright + docker-build jobs |
| `.github/workflows/deploy.yml` | Stub `echo` deploy steps — needs real SSH deploy |
| `.github/workflows/docker-security.yml` | Exists — verify Trivy config |

### Deploy Step (replaces stub in `deploy.yml`)

```yaml
- name: Deploy to production via SSH
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      set -e
      cd /opt/banking
      export APP_IMAGE=ghcr.io/${{ github.repository }}:${{ github.sha }}
      docker stack deploy \
        --with-registry-auth \
        --resolve-image always \
        -c stacks/app.stack.yml \
        banking
      docker service ps banking_app --no-trunc
```

### Required Secrets

```text
DEPLOY_HOST           — VPS IP or hostname
DEPLOY_USER           — SSH user (e.g. deploy)
DEPLOY_SSH_KEY        — Private SSH key (PEM)
NEXT_PUBLIC_SITE_URL  — Production URL
```

### Checklist

- [ ] Add `appleboy/ssh-action` step to `deploy-production` job
- [ ] Add `appleboy/ssh-action` step to `deploy-staging` job
- [ ] Add `provenance: true` and `sbom: true` to `docker/build-push-action` in CI
- [ ] Add Docker image size budget check (fail if > 300 MB)
- [ ] Add `docker service ps` verification after deploy
- [ ] Set up GitHub environment `production` with required reviewer
- [ ] Set up GitHub environment `staging` without required reviewer
- [ ] Document all required secrets in `docs/github-actions.md`

---

## 11. Performance Review

### 11a — Frontend Bundle

```bash
npm run build:analyze
# Opens bundle analyzer at localhost:8888
```

- [ ] Run bundle analyzer — document top-10 largest modules
- [ ] Implement `next/dynamic` for `chart.js`, `recharts`, `react-plaid-link`
- [ ] Verify `next/font` with `display: 'swap'` in `app/layout.tsx`
- [ ] Add `<link rel="preconnect">` for Plaid and Dwolla API domains
- [ ] Verify all images use `next/image` with explicit `width` and `height`

### 11b — Database Query Performance

```typescript
// Fix N+1 in lib/actions/plaid.actions.ts — wrap with "use cache"
"use cache";
cacheLife("minutes");
cacheTag(`balance-${bankId}`);
export async function getCachedBalance(
  bankId: string,
  accessToken: string
) {
  return plaidClient.accountsBalanceGet({
    access_token: accessToken
  });
}
```

- [ ] Profile slow queries via `npm run db:studio` with `EXPLAIN ANALYZE`
- [ ] Fix N+1 in `lib/actions/plaid.actions.ts:getAllBalances()` (Debt #4)
- [ ] Add DB indexes for `transactions.userId`, `transactions.createdAt`, `banks.userId`
- [ ] Generate migration: `npm run db:generate && npm run db:migrate`

### 11c — Cache Layer

- [ ] Verify Redis connection health in production
- [ ] Add Redis cache for Plaid balance responses (TTL: 5 min)
- [ ] Monitor cache hit ratio via Grafana after deployment

### Checklist

- [ ] Run bundle analyzer and document results
- [ ] Implement `next/dynamic` for chart and Plaid components
- [ ] Fix N+1 in `getAllBalances`
- [ ] Add DB indexes
- [ ] Add Redis caching for balance data
- [ ] Measure Core Web Vitals before and after

---

## 12. Final Project Review

### Checklist

- [ ] `npm run type-check` → 0 errors
- [ ] `npm run lint:strict` → 0 warnings
- [ ] `npm run test` → all green
- [ ] `docker build -f compose/production/node/Dockerfile .` → success
- [ ] `docker stack deploy -c stacks/traefik.stack.yml traefik` → success
- [ ] `docker stack deploy -c stacks/app.stack.yml banking` → success
- [ ] All pages load without console errors (Playwright smoke test)
- [ ] Security headers present on all responses
- [ ] `curl http://localhost:3000/api/health` → `200 OK`
- [ ] Fix health endpoint stub: `app/api/health/route.ts` (Debt #7)
- [ ] Address middleware protection: `app/middleware.ts` (Debt #5)
- [ ] Resolve `auth-options.ts` vs `auth-config.ts` conflict (Debt #6)

---

## 13. Summary Report

**Output:** `docs/reports/phase1-phase2-refactor-report.md`

```markdown
# Phase 1 & 2 Refactor Report

**Date:** YYYY-MM-DD

## Changes Made

### Frontend UI

- ...

### Docker / Infrastructure

- ...

### GitHub Actions

- ...

## Metrics

| Metric            | Before | After |
| ----------------- | ------ | ----- |
| Docker image size | ?      | ?     |
| Lighthouse score  | ?      | ?     |
| Bundle size (JS)  | ?      | ?     |
| Test count        | ?      | ?     |
| Lint warnings     | ?      | 0     |

## Remaining Issues

| #   | Issue | Severity | File |
| --- | ----- | -------- | ---- |

## Recommendations

...
```

### Checklist

- [ ] Create `docs/reports/` directory
- [ ] Capture Lighthouse screenshot before and after
- [ ] Capture bundle analyzer screenshot
- [ ] Fill all `Before` / `After` metric cells
- [ ] Link all new documentation files in report

---

## 14. Deployment Pipeline

### Pipeline Flow

```text
git push
  → CI (lint + typecheck + unit tests + playwright + docker build)
    → docker/build-push-action → ghcr.io/$repo:sha
      → Trivy scan (CRITICAL/HIGH)
        → deploy-staging (auto, SSH + docker stack deploy)
          → manual approval (GitHub environment protection)
            → deploy-production (SSH + docker stack deploy)
              → health check + rollback on failure
```

### Server Setup (`scripts/server-setup.sh`)

```bash
#!/bin/bash
set -euo pipefail
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
docker swarm init --advertise-addr "$(hostname -I | awk '{print $1}')"
docker network create --driver overlay --attachable traefik-public
mkdir -p /opt/banking/{stacks,compose,scripts}
```

### Rollback Command

```bash
docker service rollback banking_app
```

### Checklist

- [ ] Create `scripts/server-setup.sh`
- [ ] Add rolling update config to `stacks/app.stack.yml`
- [ ] Document rollback command in `docs/github-actions.md`
- [ ] Set up GitHub environment `production` with required reviewer
- [ ] Test pipeline with a staging deployment end-to-end

---

## 15. Documentation

### Files to Create

```text
docs/
├── README.md                               ← index of all docs
├── env-vars.md                             ← all 24 vars + _FILE Docker variants
├── secrets-management.md                  ← docker secret create commands
├── github-actions.md                      ← CI/CD setup + required secrets
└── reports/
    └── phase1-phase2-refactor-report.md   ← filled after all tasks done
```

### Checklist

- [ ] Create `docs/README.md` with all section links
- [ ] Create `docs/env-vars.md` (24 vars table + secret vs plain classification)
- [ ] Create `docs/secrets-management.md`
- [ ] Create `docs/github-actions.md`
- [ ] Update `AGENTS.md` sync checklist after all changes
- [ ] Update `README.md` Quick Start with Docker Swarm section
- [ ] Add `compose/production/traefik/certs/` to `.gitignore`
- [ ] Add `stacks/` and `scripts/` to version control

---

## Overall Execution Checklist

### Phase 1

- [ ] **Task 0** — Fix lint errors + commit ~82 pending changes
- [ ] **Task 1** — Fetch and save all integration docs (Plaid, Dwolla, React-Bits, shadcn, Next.js)
- [ ] **Task 2** — UI optimization (a11y + performance + shadcn + React-Bits)
- [ ] **Task 3** — Playwright E2E optimization (sandbox helpers + config improvements)

### Phase 2

- [ ] **Task 4** — Fetch infrastructure docs (Docker Swarm, Traefik, Postgres, Redis)
- [ ] **Task 5** — Create Dockerfiles for all services + Swarm stack files
- [ ] **Task 6** — Optimize Dockerfiles (dev vs prod — pin versions, remove cruft)
- [ ] **Task 7** — Docker Swarm secrets + entrypoint script + `.env` docs
- [ ] **Task 8** — Traefik Swarm stack (self-signed TLS + Prometheus + Grafana)
- [ ] **Task 9** — GitHub Actions deploy jobs (SSH + `docker stack deploy`)
- [ ] **Task 10** — Performance review (bundle + DB indexes + Redis cache)
- [ ] **Task 11** — Final project review (all debt items, health check, security headers)
- [ ] **Task 12** — Summary report → `docs/reports/phase1-phase2-refactor-report.md`
- [ ] **Task 13** — Deployment pipeline documentation + server setup script
- [ ] **Task 14** — Full documentation pass (`docs/README.md`, `env-vars.md`, `AGENTS.md`)
