# Refactor Context Documentation

## Overview

This document captures the current state of the Banking project codebase, identifying all pages, components, tests, configurations, and any inconsistencies or issues found during analysis.

**Last Updated:** April 5, 2026  
**Version:** 2.0  
**Status:** Mostly Complete - Documentation Updates Pending

---

## Table of Contents

1. [Architecture Summary](#1-architecture-summary)
2. [Pages Inventory](#2-pages-inventory)
3. [Components Inventory](#3-components-inventory)
4. [Actions & DAL Inventory](#4-actions--dal-inventory)
5. [Database Schema](#5-database-schema)
6. [Test Infrastructure](#6-test-infrastructure)
7. [Issues & Inconsistencies](#7-issues--inconsistencies)
8. [Recommendations](#8-recommendations)

---

## 1. Architecture Summary

### Tech Stack

| Technology      | Version  | Purpose                           |
| --------------- | -------- | --------------------------------- |
| Next.js         | 16.2.2   | App Router, RSC, Cache Components |
| React           | 19       | UI (React Compiler enabled)       |
| TypeScript      | 6.0.2    | Strict mode, typed routes         |
| PostgreSQL      | via Neon | Relational database               |
| Drizzle ORM     | 0.45.2   | Type-safe SQL + schema management |
| NextAuth.js     | v4.24.13 | JWT sessions, OAuth, credentials  |
| shadcn/ui       | latest   | Accessible UI components          |
| Tailwind CSS    | v4       | CSS-based config                  |
| React Hook Form | latest   | Form state management             |
| Zod             | v4.3.6   | Runtime validation                |
| Vitest          | 4.1.2    | Unit/integration testing          |
| Playwright      | 1.59.1   | E2E browser automation            |

### Integrations

| Service       | Purpose                                       |
| ------------- | --------------------------------------------- |
| Plaid         | Wallet account linking, transaction retrieval |
| Dwolla        | ACH transfers, payment processing             |
| Upstash Redis | Rate limiting (optional)                      |

### Project Structure

```text
app/
├── (auth)/                    # Unauthenticated routes
├── (root)/                    # Protected routes
│   ├── dashboard/
│   ├── my-wallets/            # ✅ Renamed from my-banks
│   ├── payment-transfer/
│   └── transaction-history/
├── (admin)/                   # Admin routes
components/
├── ui/                        # 46 shadcn/ui components
├── my-wallets/                # ✅ Renamed from my-banks
├── dashboard/
├── sidebar/
├── wallet-card/               # ✅ Renamed from bank-card
└── shadcn-studio/             # Demo blocks
actions/                        # 9 server actions (✅ wallet.actions.ts)
dal/                           # 6 DAL files (✅ wallet.dal.ts)
lib/                           # 10 utilities
database/
├── db.ts
└── schema.ts                  # 10 tables (wallets table)
types/
└── index.d.ts                 # ~50 types (wallet types)
tests/
├── unit/                      # 21 tests (wallet.*.test.ts)
├── e2e/                       # 8 tests (my-wallets.spec.ts)
└── fixtures/pages/            # 7 page objects
```

---

## 2. Pages Inventory

### All Pages

| Route | File | UI Approach |
| --- | --- | --- |
| / | app/page.tsx | shadcn + raw HTML |
| /sign-in | app/(auth)/sign-in/page.tsx | shadcn + AuthForm |
| /sign-up | app/(auth)/sign-up/page.tsx | shadcn + AuthForm |
| /dashboard | app/(root)/dashboard/page.tsx | shadcn Card |
| /my-wallets | app/(root)/my-wallets/page.tsx | ✅ Updated |
| /transaction-history | app/(root)/transaction-history/page.tsx | datatable |
| /payment-transfer | app/(root)/payment-transfer/page.tsx | shadcn Card + Select |
| /settings | app/(root)/settings/page.tsx | shadcn + shadcn-studio |
| /admin | app/(admin)/admin/page.tsx | shadcn Card + shadcn-studio |

### Page Wrapper Pattern

All pages follow: Page (Server) → ServerWrapper → ClientWrapper

### Non-Shadcn Patterns

| Element | Usage           | Recommendation                    |
| ------- | --------------- | --------------------------------- |
| div     | Layout wrappers | Create Container component        |
| section | Page sections   | Create Section component          |
| header  | Page headers    | Use semantic header or PageHeader |
| h1-h3   | Headings        | Continue (semantic HTML)          |
| p       | Paragraphs      | Continue (semantic HTML)          |

---

## 3. Components Inventory

### Summary

| Category         | Count |
| ---------------- | ----- |
| Total Components | 105   |
| shadcn/ui        | 46    |
| Custom           | 59    |
| Full JSDoc       | ~40+  |
| Partial JSDoc    | ~30   |
| No JSDoc         | ~35   |

### Key Custom Components

#### Navigation

| Component  | Path                                 | JSDoc   |
| ---------- | ------------------------------------ | ------- |
| sidebar    | components/sidebar/sidebar.tsx       | Full    |
| footer     | components/footer/footer.tsx         | Full    |
| mobile-nav | components/mobile-nav/mobile-nav.tsx | Full    |
| nav-user   | components/nav-user/nav-user.tsx     | Partial |

#### Dashboard

| Component | Path | JSDoc |
| --- | --- | --- |
| total-balance-box | components/total-balance-box/total-balance-box.tsx | Full |
| doughnut-chart | components/doughnut-chart/doughnut-chart.tsx | Full |
| animated-counter | components/animated-counter/animated-counter.tsx | Full |
| right-sidebar | components/right-sidebar/right-sidebar.tsx | Full |
| section-cards | components/section-cards/section-cards.tsx | Full |

#### Wallets

| Component    | Path                                     | JSDoc |
| ------------ | ---------------------------------------- | ----- |
| wallet-card  | components/wallet-card/wallet-card.tsx   | Full  |
| custom-input | components/custom-input/custom-input.tsx | Full  |
| auth-form    | components/auth-form/auth-form.tsx       | Full  |
| header-box   | components/header-box/header-box.tsx     | Full  |
| plaid-link   | components/plaid-link/plaid-link.tsx     | Full  |

---

## 4. Actions & DAL Inventory

### Server Actions (9 files)

| File | Status |
| --- | --- |
| actions/plaid.actions.ts | Complete |
| actions/wallet.actions.ts | Complete (✅ renamed from bank.actions.ts) |
| actions/recipient.actions.ts | Complete |
| actions/dwolla.actions.ts | Complete |
| actions/admin.actions.ts | Complete |
| actions/transaction.actions.ts | Complete |
| actions/user.actions.ts | Complete |
| actions/register.ts | Complete |
| actions/updateProfile.ts | Complete |

### DAL (6 files)

| File                   | Status                                 |
| ---------------------- | -------------------------------------- |
| dal/user.dal.ts        | Complete                               |
| dal/wallet.dal.ts      | Complete (✅ renamed from bank.dal.ts) |
| dal/transaction.dal.ts | Complete                               |
| dal/recipient.dal.ts   | Complete                               |
| dal/dwolla.dal.ts      | Complete                               |
| dal/index.ts           | Complete                               |

**All 25 files have full implementations - no TODOs or stubs.**

---

## 5. Database Schema

### Tables (10)

| Table             | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| users             | Core authentication                            |
| account           | OAuth provider links                           |
| session           | NextAuth sessions                              |
| verificationToken | Email verification                             |
| authenticator     | WebAuthn credentials                           |
| user_profiles     | Extended user data                             |
| wallets           | ✅ Linked wallet accounts (renamed from banks) |
| transactions      | Financial transactions                         |
| recipients        | Saved recipients                               |
| errors            | Error logging                                  |

### Enums

| Enum | Values |
| --- | --- |
| userRole | user, admin, moderator |
| transactionStatus | pending, processing, completed, failed, cancelled |
| transactionType | credit, debit |
| transactionChannel | online, in_store, other |

---

## 6. Test Infrastructure

### Configuration

| File                 | Purpose                   |
| -------------------- | ------------------------- |
| vitest.config.ts     | Vitest (unit/integration) |
| playwright.config.ts | Playwright (E2E)          |
| tests/setup.ts       | Global setup              |

### Unit Tests (21)

| Category    | Files |
| ----------- | ----- |
| Auth        | 4     |
| Actions     | 5     |
| DAL         | 2     |
| Integration | 2     |
| Stores      | 4     |
| Components  | 4     |

### E2E Tests (8)

| File                        | Purpose                        |
| --------------------------- | ------------------------------ |
| auth.spec.ts                | Authentication                 |
| dashboard.spec.ts           | Dashboard                      |
| my-wallets.spec.ts          | ✅ Wallet management (renamed) |
| wallet-linking.spec.ts      | ✅ Wallet connection (renamed) |
| payment-transfer.spec.ts    | Transfers                      |
| transaction-history.spec.ts | Transactions                   |
| settings.spec.ts            | Settings                       |
| admin.spec.ts               | Admin panel                    |

### Page Objects (7)

| File                        | Page       |
| --------------------------- | ---------- |
| base.page.ts                | Base POM   |
| sign-in.page.ts             | Sign-in    |
| sign-up.page.ts             | Sign-up    |
| dashboard.page.ts           | Dashboard  |
| my-wallets.page.ts          | My Wallets |
| payment-transfer.page.ts    | Transfer   |
| transaction-history.page.ts | History    |

### Test Fixtures

| File                           | Purpose                  |
| ------------------------------ | ------------------------ |
| tests/fixtures/auth.ts         | Auth test helpers        |
| tests/fixtures/wallets.ts      | ✅ Wallet test data      |
| tests/fixtures/transactions.ts | ✅ Transaction test data |

---

## 7. Issues & Inconsistencies

### Naming Issues ✅ RESOLVED

| Issue | Status | Notes |
| --- | --- | --- |
| Route folder my-banks → my-wallets | ✅ Resolved | `app/(root)/my-wallets/` |
| Component folder my-banks → my-wallets | ✅ Resolved | `components/my-wallets/` |
| Test files bank._.test.ts → wallet._.test.ts | ✅ Resolved | Renamed files |

### JSDoc Status ✅ IMPROVED

| Status  | Count | Action      |
| ------- | ----- | ----------- |
| Full    | ~40+  | ✅ Enhanced |
| Partial | ~30   | ✅ Updated  |
| None    | ~35   | ✅ Reduced  |

### Test Organization ✅ COMPLETE

| Issue             | Status      | Notes                       |
| ----------------- | ----------- | --------------------------- |
| Page Object Model | ✅ Complete | 7 page objects created      |
| Test fixtures     | ✅ Complete | wallets.ts, transactions.ts |
| Feature folders   | Partial     | Can be implemented later    |

---

## 8. Recommendations

### Completed

1. ✅ Rename my-banks to my-wallets
2. ✅ Add JSDoc to components
3. ✅ Rename test files
4. ✅ Create test fixtures
5. ✅ Implement Page Object Model

### Pending / Future Work

#### Low Priority

1. Create semantic components (Container, PageHeader)
2. Reorganize test files into feature folders
3. Complete README snippets update
4. Sync remaining documentation

---

## Changelog

### v2.0 (April 5, 2026)

- **Full Refresh**: Updated all outdated references
- **Naming Issues**: All resolved - my-banks → my-wallets
- **Documentation**: README.md updated with wallet terminology
- **Test Infrastructure**: Complete with POM and fixtures

### v1.0 (Initial)

- Initial analysis documented

---
