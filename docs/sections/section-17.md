# Section 17 — Database Migrations

- Prefer non-destructive migrations: add nullable columns, backfill, then change constraints.
- Use drizzle-kit tooling: `npm run db:generate` and `npm run db:push`.

Example:

```bash
npm run db:generate
npm run db:push
```
