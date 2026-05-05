# Spec: Seed Users

**Scope:** Feature spec — test & development seed data  
**Plan:** `integrate-demo-and-fix-auth.plan.md`  
**Status:** Reference only — existing seed user is already configured

---

## Overview

This spec documents the canonical seed user accounts used across E2E tests, development, and demo flows. All seed users use mock access tokens to bypass live Plaid/Dwolla API calls.

---

## Canonical Seed User

| Field      | Value                   |
| ---------- | ----------------------- |
| Email      | `seed-user@example.com` |
| Password   | `password123`           |
| Role       | `user`                  |
| `isActive` | `true`                  |
| `isAdmin`  | `false`                 |

**Source:** `scripts/seed/run.ts` + `tests/e2e/global-setup.ts`

---

## Seed User Wallets

The seed user should have at least one wallet pre-linked with a mock Plaid access token:

| Field         | Value                                   |
| ------------- | --------------------------------------- |
| `accessToken` | `seed-access-token` (encrypted at rest) |
| `plaidItemId` | `seed-item-id`                          |
| `accountId`   | `seed-account-001`                      |
| Institution   | `"First National Bank (Mock)"`          |

Mock tokens starting with `seed-` are detected by `isMockAccessToken()` in `lib/plaid.ts` and skip all live API calls.

---

## Seed Admin User

| Field      | Value                    |
| ---------- | ------------------------ |
| Email      | `seed-admin@example.com` |
| Password   | `password123`            |
| Role       | `admin`                  |
| `isActive` | `true`                   |
| `isAdmin`  | `true`                   |

Used by E2E tests that exercise `(admin)/` routes. Must be seeded alongside the regular seed user.

---

## Mock Token Convention

All seed/test access tokens must follow one of these prefixes to trigger mock mode:

| Prefix  | Context                     |
| ------- | --------------------------- |
| `seed-` | DB seed data                |
| `mock-` | Unit/integration tests      |
| `mock_` | Legacy Plaid sandbox format |

Detection: `lib/plaid.ts → isMockAccessToken(token: string): boolean`

---

## E2E Test Behavior

When E2E tests run with `PLAYWRIGHT_PREPARE_DB=true`:

1. `bun run db:push` — applies latest schema
2. `bun run db:seed -- --reset` — wipes and reseeds all tables
3. Seed users above are created fresh each run
4. Mock Plaid init script is injected per `tests/e2e/helpers/plaid.mock.ts`

---

## Seed Data Not in Scope

- Real Plaid sandbox credentials — use environment variables, never hardcode
- Production user data — never seed from production dumps
- Dwolla customer IDs — generated dynamically in `dwolla.actions.ts`; mock path used in tests via mock token detection
