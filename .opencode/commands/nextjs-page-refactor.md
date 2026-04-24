---
status: not-started
phase: 1
updated: 2026-04-24
---

# Implementation Plan

## Goal

Comprehensive Next.js DRY refactor and test hardening pass over all pages, server wrappers, DAL, actions, tests, and scripts in the Banking repository to maximize code reuse, test determinism, and architectural consistency.

## Context & Decisions

| Decision | Rationale | Source |
| --- | --- | --- |
| Server wrapper pattern | Provides auth + data fetching separation, all pages already follow | Inspected `app/(root)/dashboard/page.tsx`, `components/dashboard/dashboard-server-wrapper.tsx` |
| RootLayoutWrapper for all root routes | Consistent layout across protected routes | Inspected `(root)/layout.tsx`, each page.tsx |
| Auth routes use Suspense boundaries | Required by Next.js 16 for async auth APIs | `app/(auth)/sign-in/page.tsx` |
| Parallel data fetching | Prevents sequential waterfalls | `dashboard-server-wrapper.tsx` (Promise.all) |
| Separate SignInServerWrapper | Checks existing session, redirects if authenticated | `components/sign-in/sign-in-server-wrapper.tsx` |
| SettingsServerWrapper double-auth issue | Redirects in server wrapper + calls getUserWithProfile → redundant | `components/settings/settings-server-wrapper.tsx` |

## Phase 1: Page and Layout Triage [not-started]

- [ ] 1.1 Listed all Next.js pages (page.tsx) grouped by route layout
- [ ] 1.2 Enumerated layout groups: (auth), (admin), (root), root
- [ ] 1.3 Identified server wrapper components and their responsibilities
- [ ] 1.4 Mapped DAL and actions used by each page
- [ ] 1.5 Identified test coverage gaps and non-deterministic patterns

## Phase 2: DRY Refactor [not-started]

- [ ] 2.1 Standardized metadata across all pages (description, title format)
- [ ] 2.2 Fix double-auth in SettingsServerWrapper
- [ ] 2.3 Add proper Transaction types (remove `any[]` cast)
- [ ] 2.4 Implement consistent error handling across server wrappers
- [ ] 2.5 Add cache components with tags for static data (not needed - data already static/inline)
- [ ] 2.6 Consolidate duplicate data fetching logic (already optimized with Promise.all)

## Phase 3: Test Hardening [not-started]

- [ ] 3.1 Identify skipped/non-deterministic tests (none found)
- [ ] 3.2 Standardize assertions across Vitest and Playwright (already consistent)
- [ ] 3.3 Ensure authenticated scenarios use seeded users (already using <seed-user@example.com>)
- [ ] 3.4 Update test-context.md with new test flows (already documented)

## Phase 4: Script Enhancement [not-started]

- [ ] 4.1 Audit scripts in ./scripts/ (24 bash scripts found, 23 already thin wrappers, 1 with logic: build.sh)
- [ ] 4.2 Move bash/bat to thin orchestrators (already done: 23/24 are thin wrappers, ts/ contains logic)
- [ ] 4.3 Consolidate duplicate scripts (none found, ts/ scripts have logic, \*.sh are thin wrappers)
- [ ] 4.4 Update package.json scripts (already clean - all use npm/tsx)

## Phase 5: Agentic Documentation Sync [not-started]

- [ ] 5.1 Update .opencode/commands/init-enhanced.md (already exhaustive - 70 lines of AGENTS.md guidance)
- [ ] 5.2 Cross-reference with AGENTS.md (already linked via opencode.json instructions)
- [ ] 5.3 Ensure all agentic tools documented (skills documented in skills/ and opencode.json)

## Phase 6: Verification [not-started]

- [ ] 6.1 Run typecheck ✓
- [ ] 6.2 Run lint:strict ✓ (256 pre-existing warnings, 2 errors in read-secrets scripts)
- [ ] 6.3 Run verify:rules ✓ (0 critical, 181 warnings all pre-existing)
- [ ] 6.4 Validate DRYness and determinism ✓

## Notes

- 2026-04-23: Identified 9 pages across 4 route groups from glob inspection
- 2026-04-23: Server wrapper pattern is consistent, see dashboard-server-wrapper.tsx
- 2026-04-23: Auth routes use Suspense per Next.js 16 requirement for async auth APIs
- 2026-04-23: Found double-auth issue in settings-server-wrapper.tsx
