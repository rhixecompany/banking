# Section 17 — Database Migrations

- Prefer non-destructive migrations: add nullable columns, backfill, then make non-null.
- Use drizzle migration tooling (`npm run db:generate`).

Example migration command:

```bash
npm run db:generate
npm run db:push
```
