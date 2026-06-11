# Copilot Instructions

Project-wide guidance for the Banking app.

## Source of truth

- `projects/Banking/AGENTS.md`
- `README.md`
- `package.json`
- `src/database/`
- `src/actions/`

## Commands

Run from the project root:

```bash
bun run dev
bun run build
bun run db:studio
bun run db:push
bun run db:generate
bun run db:migrate
bun run format
bun run lint:strict
bun run type-check
bun run test
bun run test:unit
bun run test:e2e
```

## Architecture

- Next.js 16 App Router frontend with PostgreSQL and Drizzle ORM.
- Server Actions handle mutations; API routes are for reads/integration only.
- DAL classes encapsulate typed database access.
- Plaid and Dwolla integrations are part of the core domain.

## Conventions

- Use `auth()` first in protected server actions.
- Validate inputs with Zod before database writes.
- Keep `updatedAt` in sync on every mutation.
- Use `dot.camelCase` naming for actions and DAL files.
- Prefer strict, typed query builders over raw SQL.

