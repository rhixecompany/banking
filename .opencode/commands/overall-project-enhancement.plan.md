# Comprehensive Implementation Plan: Pages, Components, Scripts & Tests Overhaul

## Overview

Multi-session effort to triage all Next.js pages, create/refactor reusable components, harden tests, consolidate scripts, and update documentation.

---

## Phase 1: Route Discovery & Triaging ✓

### App Route Mapping

| Route Group | Layout | Routes | Auth Required |
| --- | --- | --- | --- |
| `(auth)` | `(auth)\layout.tsx` | `/sign-in`, `/sign-up` | No |
| `(admin)` | `(admin)\layout.tsx` | `/admin` | Yes (Admin) |
| `(root)` | `(root)\layout.tsx` | `/dashboard`, `/my-wallets`, `/payment-transfer`, `/settings`, `/transaction-history` | Yes |
| `app\page.tsx` | Root layout | `/` | No |

### Associated Files (explored)

**(auth)** - 6 components, 3 actions (`auth.signin.ts`, `auth.signup.ts`, `register.ts`), `user.dal.ts`, tests **(admin)** - 3 components, 2 actions, `admin.dal.ts`, tests **(root)** - 5 pages × components + actions + DAL + tests **Stores** - 5 Zustand stores

---

## Phase 2: Generic Reusable Components

### New to Create in `components/layouts/`

```
form/         - Form root + field components
data-table/   - TanStack Table integration
modal/        - Dialog-based modal
card/         - Reusable card
skeleton/    - Loading skeleton
stats-card/   - Stats display card
```

### Refactor Existing

| Current                     | Target        |
| --------------------------- | ------------- |
| `payment-transfer-form.tsx` | `form/`       |
| `transfer-summary.tsx`      | `card/`       |
| `transaction-list.tsx`      | `data-table/` |

**Verification**: Run type-check + component tests after each group

---

## Phase 3: Page-by-Page Hardening

Process: `(auth)` → `(admin)` → `(root)` → `app\page.tsx`

### Per Page

1. Review server/client wrappers
2. Extract patterns → reusable components
3. Verify Zod validation
4. Run page tests
5. Update `docs/test-context.md`

### After Each Page Group

```bash
npm run type-check && npm run lint:strict && npm run test:browser
```

---

## Phase 4: Script Consolidation

### Current → Target

| Category   | Current    | Target                     |
| ---------- | ---------- | -------------------------- |
| CI Helpers | 8 TS files | `scripts/ts/ci-helpers.ts` |
| Cleanup    | 3× formats | `scripts/ts/cleanup.ts`    |
| Deploy     | 3× formats | `scripts/ts/deploy.ts`     |
| Docker     | 4× formats | `scripts/ts/docker.ts`     |

### Actions

1. Bash/PowerShell/Bat → orchestrators calling TS
2. One TS file per category with subcommands
3. All support `--dry-run`
4. Use ts-morph for AST-safe transforms
5. Update package.json

---

## Phase 5: Test Hardening

### Current: ~40 Vitest + ~10 Playwright, some skipped/non-deterministic

### Actions

1. **Remove completely** skipped/non-deterministic tests
2. Standardize assertions
3. Deterministic auth using seeded user (`seed-user@example.com` / `Password123!`)
4. Add `createAuthenticatedSession(page)` helper

---

## Phase 6: Documentation

Update `docs/test-context.md` with full per-route documentation for each route group.

---

## Execution Order

| Session | Focus                                  |
| ------- | -------------------------------------- |
| 1       | Auth group + script consolidation      |
| 2       | Admin group + component refactoring    |
| 3-7     | Protected root group (5 pages)         |
| 8       | Finalization (tests + docs + validate) |

---

## Success Criteria

| Phase | Criteria                  |
| ----- | ------------------------- |
| 1     | All routes mapped ✓       |
| 2     | 10+ reusable components   |
| 3     | All pages functional      |
| 4     | All scripts consolidated  |
| 5     | No skipped tests          |
| 6     | Full test docs            |
| Final | `npm run validate` passes |

---

## Status

- [x] Plan created
- [ ] Phase 1-6 implementation
- [ ] Final validation
