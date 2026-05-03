---
category: documentation
description: Key context for Banking app AI agents
---

# Banking App Memory Bank

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with React Compiler
- **PostgreSQL** + Drizzle ORM
- **NextAuth v4** with JWT
- **Bun** package manager

## Key Conventions

### Environment
- Use `app-config.ts` - never `process.env` directly
- Exceptions: `proxy.ts`, `scripts/seed/run.ts`

### Database
- Use DAL helpers - never import DB in `app/` or `components/`
- Batch queries to avoid N+1

### Server Actions
- Return shape: `{ ok: boolean; error?: string; ...payload }`
- Validate with Zod
- Use for all mutations (not API routes)

### Home Page
- `app/page.tsx` must be static + public (no auth/DB/env access)

## Commands Reference

- `.opencode/commands/` - Planning, testing, workflow prompts
- `.opencode/rules/` - Code quality rules

## Test Credentials

- E2E User: `seed-user@example.com` / `password123`
- Mock tokens: start with `seed-`, `mock-`, `mock_`

## Key Files

- `AGENTS.md` - Single source of truth for all guidance
- `exemplars.md` - Code patterns
- `database/schema.ts` - DB schema