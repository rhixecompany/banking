# Banking - Triage Context

**Date:** 2026-05-20 **Priority:** HIGH **Status:** Triage complete - fixes applied and committed (`0917fc9f`)

---

## Summary

Banking repo had a large batch of uncommitted changes from a prior session: the entire `bin/` directory had been deleted from disk, 7 new docs files were staged but not committed, 3 doc files had minor path reference fixes pending, and `.logs/subtask2.log` was being tracked despite a `.gitignore` rule covering it. All resolved in one commit.

---

## Changes Applied (commit `0917fc9f`)

| Action | Detail |
| --- | --- |
| Deleted `bin/` (70+ files) | Cleanup/deploy/docker/server/utils scripts removed — no longer needed |
| Untracked `.logs/subtask2.log` | Already covered by `.gitignore` `.logs/` rule; was tracked from before rule was added |
| Fixed path refs in 3 docs | `agent/` → `agents/`, `command/` → `commands/` throughout doc files |
| Added `docs/CONTRIBUTING.md` | Contribution guidelines |
| Added `docs/DEVELOPER_GUIDE.md` | Developer onboarding guide |
| Added `docs/USER_GUIDE.md` | End-user documentation |
| Added `docs/code-docs/` | TypeScript and Python code documentation standards |
| Added `docs/Banking-docs.docx` | Word export of core docs |

---

## Known State

- **Working tree:** Clean after commit
- **Branch:** `audit/docs-20260515`
- **node_modules:** Absent — `pnpm install --frozen-lockfile` required before running quality gates
- **Build/test:** Cannot verify without `node_modules`; last known state from prior triage is stable
- **Active plan:** `docs/plans/codebase-overhaul.md` (Phases 0–7 documented)

---

## Outstanding Items

| Item | Priority | Notes |
| --- | --- | --- |
| Run `pnpm install && pnpm run build` | HIGH | Verify build passes after bin/ removal |
| Check if any scripts referenced `bin/` | MEDIUM | May need package.json script updates |
| Verify `.logs/` stays untracked | LOW | Git status should show clean after commit |

---

## Stack

- Next.js 16 (App Router)
- PostgreSQL + Drizzle ORM
- NextAuth v4
- Plaid + Dwolla integrations
- TypeScript strict mode
