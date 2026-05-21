---
name: banking
version: 1
categories:
  - path: stack/frontend.md
    description: Next.js 16 frontend with React 19, Tailwind, shadcn/ui
    group: stack
  - path: stack/backend.md
    description: Server Actions, NextAuth, Drizzle ORM, PostgreSQL
    group: stack
  - path: stack/dependencies.md
    description: Approved npm packages and version constraints
    group: stack
  - path: architecture/structure.md
    description: Directory layout and server/client separation
    group: architecture
  - path: patterns/error-handling.md
    description: Error handling patterns for server actions
    group: patterns
  - path: patterns/logging.md
    description: Structured logging with pino and context
    group: patterns
  - path: patterns/validation.md
    description: Zod schema validation at action boundaries
    group: patterns
  - path: patterns/data-fetching.md
    description: Server Component data fetching patterns
    group: patterns
  - path: patterns/testing.md
    description: Unit and integration testing patterns
    group: patterns
  - path: style/naming.md
    description: File and identifier naming conventions
    group: style
  - path: style/imports.md
    description: Import organization and path aliases
    group: style
  - path: style/types.md
    description: TypeScript type definitions and usage
    group: style
  - path: components/ui.md
    description: shadcn/ui usage and composed components
    group: components
  - path: domain/concepts.md
    description: Domain entities, relationships, and value objects
    group: domain
  - path: ops/database.md
    description: Drizzle ORM schema and query patterns
    group: ops
---

# Banking Mind Model

This mind model captures the patterns, conventions, and constraints for the Banking application — a Next.js 16 fintech platform with PostgreSQL, Drizzle ORM, and Plaid/Dwolla integrations.

## Quick Reference

| Command               | Purpose               |
| --------------------- | --------------------- |
| `bun run dev`         | Start dev server      |
| `bun run type-check`  | TypeScript validation |
| `bun run lint:strict` | Strict ESLint         |

## Key Patterns

1. **Server Actions** — All mutations return `{ ok, error, ... }` with Zod validation
2. **DAL Classes** — Database logic in `src/dal/` with type-safe queries
3. **Server/Client Split** — Server Components fetch data; Client Components handle interaction
4. **Soft Delete** — Never hard delete user data; use `deletedAt` timestamp

## Directory Structure

```
src/
├── actions/        # Server-only operations
├── app/           # Next.js App Router
├── components/    # React components
├── dal/          # Data Access Layer
├── database/     # Drizzle schema
├── lib/          # Utilities
├── stores/       # Zustand state
└── types/        # TypeScript types
```
