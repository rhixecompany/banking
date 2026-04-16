---
name: banking-agent-standards
description: Aligns agents with the Banking app codebase using Next.js 16 App Router, TypeScript (strict), Drizzle ORM, PostgreSQL, NextAuth v4, shadcn/ui, Tailwind CSS v4, Zod, Vitest, and Playwright. Enforces PR-blocking rules (no any, no N+1 queries, environment via lib/env.ts, mutations only through Server Actions). Use when working in this repository, changing files under app/, lib/, database/, or tests, or when the user asks to follow Banking standards or AGENTS.md.
---

# Banking agent standards

## When to apply

Use this skill for any task in this repository. Apply it especially when touching authentication, the data access layer, database schema, Server Actions, or automated tests.

## Read first

Open the repository root [AGENTS.md](../../../AGENTS.md) for the full command list, patterns, and examples. Prefer linking to AGENTS.md and `.cursor/rules` instead of copying long excerpts into chat.

## Non-negotiables (PR blocking)

Mirror of [Critical Rules in AGENTS.md](../../../AGENTS.md):

- No `any` types — use `unknown` and type guards.
- No N+1 queries — use eager loading for related data.
- No raw `process.env` in app code — use `app-config.ts` (preferred) or `lib/env.ts` (backward compat).
- All mutations via Server Actions — not API routes for writes.
- Zero TypeScript errors — `npm run type-check`.
- Zero ESLint warnings — `npm run lint:strict`.
- All tests pass — `npm run test`.

## Canonical rules (pointers)

- Rules index: [project-coding-standards.mdc](../../rules/project-coding-standards.mdc)
- Summary: [banking-coding-standards.mdc](../../rules/banking-coding-standards.mdc)
- Environment: [env-access-via-lib-env.mdc](../../rules/env-access-via-lib-env.mdc)
- Mutations: [mutations-via-server-actions.mdc](../../rules/mutations-via-server-actions.mdc)
- Query efficiency: [no-n-plus-one-queries.mdc](../../rules/no-n-plus-one-queries.mdc)
- Typing: [typescript-no-any.mdc](../../rules/typescript-no-any.mdc)
- Workflow index: [project-workflow-process.mdc](../../rules/project-workflow-process.mdc) → [workflow-and-steps.mdc](../../rules/workflow-and-steps.mdc)
- Tests: [project-testing-validation.mdc](../../rules/project-testing-validation.mdc), [kill-port-3000-before-tests.mdc](../../rules/kill-port-3000-before-tests.mdc)

## Validation

Before claiming work is done, run the narrowest checks needed, then broader gates as appropriate. Common commands (see AGENTS.md for the full set):

- `npm run validate` — format check, type-check, strict lint, full test suite
- `npm run type-check`
- `npm run lint:strict`
- `npm run test` (Vitest browser tests then Playwright)

For Playwright or Vitest, follow [kill-port-3000-before-tests.mdc](../../rules/kill-port-3000-before-tests.mdc) so nothing is listening on port 3000 before test commands.

## Anti-duplication

Do not paste large code blocks that already exist in AGENTS.md; cite the section instead.
