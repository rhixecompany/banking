# Refactor Frontend UI — Implementation Plan

## Goals

- Implement the approved refactor work for the frontend UI per the user's task list. This plan prioritizes safe, incremental changes and includes verification steps.

## Scope

- Tasks addressed: 1-12 from the user request. Changes will be applied incrementally in small commits.
- Initial implementation will focus on the Plaid embed fix (task 10) and scaffolding for subsequent steps.

## Target Files (first wave)

- components/plaid-context/plaid-context.tsx — add single Script loader to ensure Plaid script is included once.
- docs/\* — already generated.

## Why a plan

- Changes touch multiple files and areas; repository conventions require a plan for changes touching more than 3 files.

## Implementation Steps (first wave)

1. Add this plan file to .opencode/plans/. (done)
2. Modify PlaidProvider to include next/script Script for single inclusion of Plaid script and set a runtime guard (window.\_\_plaid_link_script_loaded).
3. Run type-check and lint. If lint OOMs, run lint per-folder or increase Node memory for lint.
4. Run unit tests that are fast (Vitest) and report results.

## Validation

- TypeScript type-check must pass (npm run type-check).
- ESLint (lint:strict) should run; if it OOMs in this environment, recommend running locally with increased memory. CI will validate fully.
- Manually verify in browser that the duplicate Plaid script warning no longer appears when navigating to protected pages (app/(root)/\*).

## Risks & Mitigation

- Minimal risk for PlaidProvider change — small UI change contained in provider.
- If runtime errors occur, revert the single file commit.

## Next waves (after Plaid fix)

- Audit and draft schema changes (docs/schema-audit.md) — report only or generate migration drafts as requested.
- Audit actions, Zod schemas, and DALs; make minimal changes to ensure .describe() and validator messages present, add missing auth checks, and remove N+1 patterns.
- Create components/layouts with generic components and migrate existing components incrementally.
- Refactor scripts to be AST-safe and add dry-run flags.

## Rollback

- Revert single file commit for PlaidProvider if needed.

---

Date: 2026-04-11 Author: OpenCode (assistant)
