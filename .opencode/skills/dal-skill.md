# Data Access Layer (DAL) Skill

This skill provides guidance for implementing the DAL pattern with Drizzle ORM, focusing on N+1 query prevention and efficient database access.

## Overview

The DAL pattern encapsulates all database operations in dedicated classes, making it easy to:

- Enforce query patterns
- Prevent N+1 queries
- Maintain consistent error handling
- Add caching layers

## N+1 Query Prevention

### The Problem

```typescript
// ❌ BAD - N+1 query pattern
const users = await db.select().from(users);

for (const user of users) {
  // Query for each user's profile - N+1!
  const [profile] = await db
    .select()
    .from(user_profiles)
    .where(eq(user_profiles.userId, user.id));

  user.profile = profile;
}
```

### The Solution: JOINs

```typescript
// ✅ GOOD - Single query with JOIN
const usersWithProfiles = await db
  .select({
    id: users.id,
    email: users.email,
    name: users.name,
    profile: {
      id: user_profiles.id,
      bio: user_profiles.bio,
      avatar: user_profiles.avatar
    }
  })
  .from(users)
  .leftJoin(user_profiles, eq(users.id, user_profiles.userId));
```

## DAL Pattern Implementation

### 1. Basic DAL Structure

```typescript
// lib/dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users, user_profiles } from "@/database/schema";

export class UserDal {
  /**
   * Find user by ID with profile - uses single JOIN query
   */
  async findByIdWithProfile(id: string) {
    const [result] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profile: {
          id: user_profiles.id,
          bio: user_profiles.bio
        }
      })
      .from(users)
      .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
      .where(eq(users.id, id));

    return result ?? null;
  }

  /**
   * Find multiple users with profiles - uses single JOIN query
   */
  async findAllWithProfiles(limit = 50) {
    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        profile: {
          id: user_profiles.id,
          bio: user_profiles.bio
        }
      })
      .from(users)
      .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
      .limit(limit);
  }
}

export const userDal = new UserDal();
```

### 2. Transaction for Related Inserts

```typescript
// lib/dal/user.dal.ts
export class UserDal {
  /**
   * Create user with profile atomically
   */
  async createWithProfile(data: {
    email: string;
    password: string;
    name?: string;
    profile?: Partial<typeof user_profiles.$inferInsert>;
  }) {
    let userId: string | undefined;

    await db.transaction(async tx => {
      // Insert user first
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          password: data.password
        })
        .returning();

      userId = user.id;

      // Insert profile if provided
      if (data.profile) {
        await tx.insert(user_profiles).values({
          userId: user.id,
          ...data.profile
        });
      }
    });

    // Fetch the complete result with profile
    if (!userId) return null;
    return this.findByIdWithProfile(userId);
  }
}
```

### 3. Eager Loading Relations

```typescript
// lib/dal/bank.dal.ts
export class BankDal {
  /**
   * Find bank by user ID with all related data
   */
  async findByUserIdWithRelations(userId: string) {
    return db
      .select({
        bank: banks,
        institution: {
          name: institutions.name,
          logo: institutions.logo
        }
      })
      .from(banks)
      .innerJoin(
        institutions,
        eq(banks.institutionId, institutions.id)
      )
      .where(eq(banks.userId, userId));
  }
}
```

### 4. Pagination with Cursor

```typescript
export class PostDal {
  /**
   * Paginate posts efficiently with cursor-based pagination
   */
  async paginate(cursor: string | null, limit = 10) {
    const conditions = cursor
      ? lt(posts.createdAt, new Date(cursor))
      : undefined;

    const posts = await db
      .select({
        id: posts.id,
        title: posts.title,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          name: users.name
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(conditions)
      .orderBy(desc(posts.createdAt))
      .limit(limit + 1); // Fetch one extra to determine next cursor

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    return {
      posts,
      nextCursor: hasMore
        ? posts[posts.length - 1].createdAt.toISOString()
        : null
    };
  }
}
```

## Common Patterns

### 1. Upsert Pattern

```typescript
export class SettingDal {
  async upsert(userId: string, key: string, value: string) {
    const [setting] = await db
      .insert(settings)
      .values({ userId, key, value })
      .onConflictDoUpdate({
        target: [settings.userId, settings.key],
        set: { value, updatedAt: new Date() }
      })
      .returning();

    return setting;
  }
}
```

### 2. Soft Delete Pattern

```typescript
export class UserDal {
  async softDelete(id: string) {
    const [user] = await db
      .update(users)
      .set({
        deletedAt: new Date(),
        isActive: false
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }
}
```

### 3. Count with Index

```typescript
export class PostDal {
  async countByAuthor(authorId: string) {
    const [result] = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.authorId, authorId));

    return result?.count ?? 0;
  }
}
```

## Query Optimization Checklist

- [ ] All related data fetched in single query using JOINs
- [ ] No queries inside loops (foreach, map, for)
- [ ] Indexes on frequently queried columns (foreign keys, dates)
- [ ] Pagination for large datasets
- [ ] Soft deletes for audit trails
- [ ] Transactions for related operations

## Best Practices

1. **Always JOIN related tables** instead of separate queries
2. **Use transactions** for related inserts/updates
3. **Limit result sets** with pagination
4. **Select only needed columns** (avoid `select().*`)
5. **Use indexes** on foreign keys and filter columns
6. **Name DAL classes** with PascalCase (e.g., `UserDal`)
7. **Export singleton instances** (e.g., `export const userDal = new UserDal()`)

## Example Prompts for This Skill

- "Query user with profile using JOIN instead of N+1"
- "Create a DAL method for paginating posts"
- "Add transaction for creating user with profile"
- "Optimize the getUserBanks query to prevent N+1"
- "Add proper indexes to the schema"
