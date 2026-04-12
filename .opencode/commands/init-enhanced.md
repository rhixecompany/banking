# /init-enhanced — Initialize Banking Project Documentation

## Purpose

Comprehensive documentation sync for all agentic coding tools (OpenCode, Cursor, GitHub Copilot) operating in this Banking repository. This document is a reproducible checklist to bring documentation in sync with source code and to collect actionable issues for maintainers.

## When to Use

- Starting a new session after codebase changes
- Before major refactoring or feature work
- When documentation may have drifted from source truth
- After adding new integrations, commands, or dependencies
- When onboarding a new developer, reviewer, or QA

## Usage

```text
/init-enhanced
```

Note: This file is documentation only. The steps describe an agent or human-driven workflow — it is not an executable script in the repo. Use the recommended repository tools (Glob, Grep, Read) when examining files.

This checklist has six phases. Follow them sequentially and capture outputs where requested.

Phase 1 — Discovery & Verification

1. Collect authoritative sources of truth:
   - AGENTS.md
   - package.json (scripts)
   - app-config.ts and lib/env.ts (env validation)
   - database/schema.ts
   - types/next-auth.d.ts
   - .cursor/rules, .opencode/instructions, .opencode/skills, .github/instructions

2. Use the repository search tools (Glob + Grep + Read) instead of brittle shell parsing. Examples:
   - Glob: find files by pattern (fast & ordered)
   - Grep: search for code patterns (use ripgrep via project tooling)
   - Read: open files with context (avoid cat/awk/grep one-liners)

Phase 2 — Run Validation Commands

Run the standard validation sequence and capture outputs for audit:

- npm run format:check → capture output to format-check.txt
- npm run type-check → capture output to type-check.txt
- npm run lint:strict → capture output to lint-strict.txt
- npm run test:browser → capture output to test-browser.txt (Vitest)
- npm run test:ui → capture output to test-ui.txt (Playwright)

Execution notes:

- Run sequentially to avoid port conflicts.
- Free port 3000 before Playwright using the OS-appropriate command:
  - PowerShell (Windows): $p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select -ExpandProperty OwningProcess -Unique
    if ($p) { $p | ForEach-Object { Stop-Process -Id $\_ -Force } }
  - Bash (macOS/Linux): fuser -k 3000/tcp || true

Phase 3 — Analyze Outputs & Create Issue Catalog

1. Read the captured outputs and categorize issues into:
   - Format violations
   - TypeScript errors
   - ESLint warnings/errors
   - Unit test failures
   - E2E failures

2. Produce an Issue Catalog with severity (Critical/High/Medium/Low), file references, and suggested fixes.

Phase 4 — Documentation Updates (after creating a small checkpoint commit)

Checkpoint guidance:

```bash
# Stage only the plan/docs checkpoint
git add .opencode/commands/init-enhanced.md .cursor/plans/refactor-ui-audit_*.plan.md
git commit -m "chore(docs): checkpoint before documentation sync"
```

Priority doc updates (apply only when validated):

- AGENTS.md — canonical reference. Update only after audits and include a changelog entry and version/date bump.
- .cursor/rules — sync critical PR-blocking rules where they drift.
- .opencode/instructions & .opencode/skills — align with AGENTS.md and code patterns.
- .github/instructions — minor edits to reflect runtime and test behaviors.

Phase 5 — Code Audits and Small Fixes

Run targeted audits and make additive fixes in small commits:

- Database schema audit (docs/database/schema-audit.md): compare schema.ts against code usage and identify missing fields (e.g., sharableId, fundingSourceUrl, webhook tables).
- Actions/Zod/DAL audit (docs/actions-audit.md): ensure Zod schemas include .describe, validators have messages, protected actions call auth(), return shapes match Promise<{ok:boolean; error?:string}>.
- DAL audit: find N+1 patterns and replace with JOINs/IN queries; add transactional wrappers for multi-step writes.

Phase 6 — Report & Rollback

After changes, run the validation sequence again and produce a summary report including:

- Files changed and why (commit summary)
- DB migration notes and any backfill steps
- Test results and remaining risks

Rollback notes:

- Keep commits small. If a migration must be reverted, provide down migration or revert the migration commit and re-run db:push against a fresh DB.

Checklist (ready to run):

- [ ] Create local branch feature/refactor-ui-audit-<date>-<id>
- [ ] Add .cursor/plans/refactor-ui-audit\*.plan.md (this file accompanies the plan)
- [ ] Commit the init-enhanced update
- [ ] Run format/type-check/lint and capture outputs
- [ ] Produce docs audits under docs/
- [ ] Implement additive DB schema changes with migrations
- [ ] Fix Actions/Zod/DALs with tests
- [ ] Extract shared UI components incrementally
- [ ] Replace scripts with AST-safe Node implementations (support --dry-run)
- [ ] Run full test suite (Vitest then Playwright)

End of /init-enhanced
