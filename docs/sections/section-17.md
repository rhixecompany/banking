# Section 17 — Database Migrations

- Prefer non-destructive migrations: add nullable columns, backfill, then change constraints.
- Use drizzle-kit tooling: `bun run db:generate` and `bun run db:push`.

Example:

```bash
bun run db:generate
bun run db:push
```
