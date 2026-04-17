---
description: Always enforce these repository rules
applyTo: "**"
lastReviewed: 2026-04-17
---

# Quick Start — Commands You Will Actually Run

1. Start dev server
   - npm run dev

2. Typecheck and lint (pre-PR)
   - npm run type-check
   - npm run lint:strict

3. Format
   - npm run format

4. Run tests
   - Fast unit tests: npm run test:browser
   - Full (Playwright E2E then Vitest): npm run test

5. Seed DB (careful)
   - npm run db:seed
   - Dry-run: npm run db:seed -- --dry-run

- Reset (destructive): npm run db:seed -- --reset (must set RUN_DESTRUCTIVE=true and --yes)

Quick safety

- Home page must remain static/public — no auth()/DAL/DB in app/page.tsx.
- Use app-config.ts or lib/env.ts for env access; seed runner is an exception.
- Run npm run verify:rules before PRs.

-- Canonicalized from docs/AGENTS-CANONICAL.md on 2026-04-17 as part of unify-agent-docs operation.
