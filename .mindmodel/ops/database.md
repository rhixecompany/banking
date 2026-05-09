# Database

## Rules

- Use Drizzle ORM with PostgreSQL for all database operations
- All tables MUST use `timestamps()` macro for `createdAt` and `updatedAt`
- Soft-delete via `deletedAt` timestamp — never hard delete user data
- Encrypt sensitive data before storage (SSN, access tokens)
- Use transactions for operations that must be atomic
- Add indexes on foreign keys and frequently queried columns

## Examples

### Table with Soft Delete

```typescript
// src/database/schema.ts
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at") // Soft delete
});
```

### Transaction for Atomic Operations

```typescript
// src/dal/user.dal.ts
async createWithProfile(data: CreateUserInput): Promise<UserWithProfile> {
  return db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(data).returning();
    const [profile] = await tx
      .insert(user_profiles)
      .values({ userId: user.id })
      .returning();
    return { ...user, profile };
  });
}
```

### Eager Loading with JOIN

```typescript
// src/dal/transaction.dal.ts
findByUserIdWithWallets(userId: string, limitVal = 50, offsetVal = 0) {
  return db
    .select({ transaction: transactions, senderWallet: wallets })
    .from(transactions)
    .leftJoin(wallets, eq(transactions.senderWalletId, wallets.id))
    .where(and(eq(transactions.userId, userId), isNull(transactions.deletedAt)))
    .orderBy(desc(transactions.createdAt))
    .limit(limitVal)
    .offset(offsetVal);
}
```

## Anti-patterns

### Don't Hard Delete

```typescript
// BAD: Permanent deletion of user data
await db.delete(users).where(eq(users.id, id)); // ❌

// GOOD: Soft delete preserves audit trail
await db
  .update(users)
  .set({ deletedAt: new Date() })
  .where(eq(users.id, id)); // ✓
```

### Don't Store Plain Text Sensitive Data

```typescript
// BAD: Plain text SSN
ssn: varchar("ssn", { length: 11 }).notNull(), // ❌

// GOOD: Encrypted SSN
ssnEncrypted: text("ssn_encrypted"), // ✓ encrypted at application layer
```
