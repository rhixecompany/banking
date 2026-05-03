---
category: database
source: github-prompts
tags: [sql, postgresql, drizzle, code-review]
date: 2026-05-03
---

# SQL Code Review Prompt

Review SQL queries, Drizzle ORM code, and database patterns.

## When to Use

- Reviewing new database queries
- Checking Drizzle schema changes
- Optimizing slow queries

## Review Checklist

### Performance
- [ ] Index usage - are indexes being utilized?
- [ ] N+1 queries - are related records fetched efficiently?
- [ ] Batch operations - use IN clauses instead of loops
- [ ] Query complexity - avoid unnecessary joins

### Security
- [ ] Parameterized queries (Drizzle handles this)
- [ ] No raw SQL injection risks
- [ ] Proper data validation

### Best Practices
- [ ] Use Drizzle helpers over raw SQL
- [ ] Consistent naming conventions
- [ ] Proper TypeScript types
- [ ] Migrations for schema changes

### Banking-Specific
- [ ] Transaction handling for financial operations
- [ ] Proper decimal handling for money
- [ ] Audit trail considerations

## Example Review

```typescript
// ❌ Wrong - N+1 query
for (const user of users) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, user.id));
}

// ✅ Correct - Batch fetch
const userIds = users.map(u => u.id);
const orders = await db.select().from(ordersTable).where(inArray(ordersTable.userId, userIds));
```

For full SQL review patterns, see `.github/prompts/sql-code-review.prompt.md` and `.github/prompts/postgresql-code-review.prompt.md`