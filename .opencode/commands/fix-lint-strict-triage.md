# Lint Triage Summary

## Phase 1: Audit & Triage Results

**Generated:** 2026-04-23  
**Total findings:** 224  
**Critical:** 13  
**Warning:** 211

---

## Critical Findings (Require Action)

### Bucket A: Production-Critical

| File | Line | Check | Severity | Recommended Fix |
| --- | --- | --- | --- | --- |
| lib/env.ts | 41 | process.env-usage | **critical** | Intentional - lib/env.ts is the backward-compat helper for process.env reads (per AGENTS.md and .cursor rules). OK. |
| lib/env.ts | 49 | process.env-usage | **critical** | Intentional - lib/env.ts backward-compat (per repo rules). OK. |
| lib/env.ts | 52 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 55 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 56 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 61 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 62 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 70 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 96 | process.env-usage | **critical** | Intentional. OK. |
| lib/env.ts | 98 | process.env-usage | **critical** | Intentional. OK. |
| actions/auth.signin.ts | 1 | server-action-auth | **critical** | FIX NEEDED: Add auth() check at start |
| actions/auth.signup.ts | 1 | server-action-auth | **critical** | FIX NEEDED: Add auth() check at start |
| actions/register.ts | 1 | server-action-auth | **critical** | FIX NEEDED: Add auth() check at start (or confirm it's intentionally public) |

**Actions for Critical:**

- [ ] lib/env.ts: **No action needed** — lib/env.ts is the intentional backward-compat helper per AGENTS.md and .cursor rules
- [ ] actions/auth.signin.ts + auth.signup.ts + register.ts: Add `auth()` call at start

---

## Warning Findings (By Bucket)

### Bucket A: Production-Warn (app/, lib/, dal/, actions/, components/)

| File | Count | Check | Notes |
| --- | --- | --- | --- |
| app-config.ts | 24 | process.env-usage | **Intentional** — app-config.ts reads process.env for Zod validation (per AGENTS.md) |
| drizzle.config.ts | 5 | process.env, any | Config file — needs env helper? Review. |
| next-sitemap.config.ts | 1 | process.env | Config file — acceptable? |
| proxy.ts | 2 | process.env | **Intentional** — proxy.ts is the documented exception per AGENTS.md |
| actions/admin-stats.actions.ts | 11 | any | FIX: Replace any with explicit types |
| actions/auth.signin.ts | 1 | any | FIX: Replace any with explicit type |
| database/db.ts | 1 | process.env-usage | DB config — review |
| lib/logger.ts | 5 | any | FIX: Replace any with unknown + type guard |

### Bucket B: Components-Warn

| File | any Count | Notes |
| --- | --- | --- |
| components/ui/\* (25 files) | ~300+ | **shadcn/ui components** — many use `any`. These are generated/referenced UI components. Option: document as acceptable or apply targeted fixes. |
| components/layouts/payment-transfer-form.tsx | 1 | Review |
| components/layouts/settings-profile-form.tsx | 4 | Review |
| components/shared/wallets-overview.tsx | 1 | Review |

### Bucket C: Scripts-Infra (warn)

| File | Count | Type | Notes |
| --- | --- | --- | --- |
| scripts/mcp-runner.ts | 7 | process.env, any | Review |
| scripts/plan-ensure.ts | 1 | process.env | Review |
| scripts/export-data.ts | 2 | any, process.env | Review |
| scripts/seed/run.ts | 7 | process.env, any | **Intentional** — AGENTS.md marks seed runner as exception |
| scripts/ts/build.ts | 30+ | process.env | Build script — acceptable? Review |
| scripts/generate/\* | 5 | any, process.env | Generator scripts |
| scripts/utils/io.ts | 3 | process.env, any | Review |

### Bucket D: Tests-JSDoc (warn, Documented Acceptable)

| File | Count | Notes |
| --- | --- | --- |
| tests/unit/\* (30+ files) | ~70+ | **Acceptable** — test fixtures with any are standard |
| tests/e2e/\* | 10+ | E2E helpers— acceptable |
| tests/mocks/\* | 5+ | Mock handlers — acceptable |

**Bucket D classification:** These are test files. Per Option B (from your answer), test/JSDoc warnings are acceptable to document. No fixes required.

---

## Summary: What Needs Action

### Fixed Required (Action Items)

| Priority | File | Issue | Fix Type |
| --- | --- | --- | --- |
| HIGH | actions/auth.signin.ts | server-action-auth (critical) | Add auth() at start |
| HIGH | actions/auth.signup.ts | server-action-auth (critical) | Add auth() at start |
| HIGH | actions/register.ts | server-action-auth (critical) | Add auth() at start OR confirm public |
| MEDIUM | actions/admin-stats.actions.ts | any (11 occurrences) | Replace with explicit types |
| MEDIUM | lib/logger.ts | any (5 occurrences) | Replace with unknown + type guard |
| LOW | drizzle.config.ts | process.env-usage (4), any (1) | Review: config needs env access |
| LOW | next-sitemap.config.ts | process.env (1) | Review: config acceptable? |

### No Action Needed (Intentionally Approved)

| File | Why Approved |
| --- | --- |
| app-config.ts | Canonical env validation (AGENTS.md requirement) |
| lib/env.ts | Backward-compat helper for process.env reads (per AGENTS.md + .cursor) |
| proxy.ts | Explicitly documented exception in AGENTS.md |
| scripts/seed/run.ts | Explicitly documented exception in AGENTS.md |
| tests/\* | Per Option B — test/JSDoc warnings documented as acceptable |

---

## Auto vs Manual Fixes

### Auto-fixable (eslint --fix)

- Empty blocks, useless escapes, fallthrough in scripts
- console.log → logger calls (done in prior work)

### Manual Fixes Required

- server-action-auth: Add auth() to 3 server action files
- Replace any with explicit types in actions/admin-stats.actions.ts
- Replace any in lib/logger.ts with unknown + type guard

### Documentation Fixes (Bucket D - Optional)

- Test files: Document acceptable warnings
- JSDoc: Document or suppress where needed

---

## Next Steps

1. **[COMPLETE]** Phase 1: Audit & Triage — Done
2. **[NEXT]** Phase 2: Production Fixes - Start with server-action-auth critical fixes

The critical findings in lib/env.ts and app-config.ts are intentional per the repo rules — no action needed. The 3 server-action violations in actions/ need fixing.
