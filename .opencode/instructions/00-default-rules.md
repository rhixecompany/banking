---
description: Always enforce these repository rules
applyTo: "**"
lastReviewed: 2026-04-23
canonicalSource: AGENTS.md
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
- Prefer npm scripts (preserves NODE_OPTIONS and other flags).
- Destructive scripts must accept --dry-run and require explicit flags.
- Run npm run verify:rules before PRs.
