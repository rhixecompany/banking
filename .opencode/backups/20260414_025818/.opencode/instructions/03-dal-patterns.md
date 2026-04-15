---
description: DAL patterns and N+1 prevention
applyTo: "dal/**/*.{ts,tsx}"
lastReviewed: 2026-04-14
---

# DAL Patterns

- Use Drizzle ORM and the dal/ helpers for all DB interactions.
- Prefer queries that avoid N+1 problems. Use JOINs or batch queries with `IN` when fetching related rows.
- Accept an optional `tx` (transaction) parameter in DAL write helpers for atomic operations.
