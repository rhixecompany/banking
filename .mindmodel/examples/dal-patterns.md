# DAL Examples

## User DAL with Soft Delete

```typescript
// src/dal/user.dal.ts
import { and, eq, isNull } from "drizzle-orm";
import type {
  NewUserProfile,
  User,
  UserWithProfile
} from "@/types/user";
import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";

export class UserDal {
  /**
   * Finds a single user by email address.
   * Excludes soft-deleted users automatically.
   */
  async findByEmail(email: string): Promise<undefined | User> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);
    return user;
  }

  /**
   * Finds a user by ID along with their profile via JOIN.
   * No N+1 - single query with eager loading.
   */
  async findByIdWithProfile(
    id: string
  ): Promise<undefined | UserWithProfile> {
    const [result] = await db
      .select({
        createdAt: users.createdAt,
        email: users.email,
        id: users.id,
        profile: {
          address: user_profiles.address,
          city: user_profiles.city,
          phone: user_profiles.phone,
          ssnEncrypted: user_profiles.ssnEncrypted
        }
      })
      .from(users)
      .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);
    return result;
  }

  /**
   * Creates user with profile in a transaction.
   */
  async createWithProfile(data: {
    email: string;
    name: string;
    password: string;
    profile: { address?: string };
  }): Promise<UserWithProfile> {
    return db.transaction(async tx => {
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          password: data.password
        })
        .returning();
      const [profile] = await tx
        .insert(user_profiles)
        .values({ userId: user.id, address: data.profile.address })
        .returning();
      return { ...user, profile };
    });
  }
}

export const userDal = new UserDal();
```

## Transaction DAL with Eager Loading

```typescript
// src/dal/transaction.dal.ts
import { and, desc, eq, isNull } from "drizzle-orm";
import type { Transaction } from "@/types/transaction";
import { db } from "@/database/db";
import { transactions, wallets } from "@/database/schema";

export class TransactionDal {
  /**
   * Retrieves transactions with wallet metadata in single query.
   * Avoids N+1 when rendering transaction lists.
   */
  findByUserIdWithWallets(
    userId: string,
    limitVal = 50,
    offsetVal = 0
  ): Promise<
    (Transaction & {
      senderWallet?: Wallet;
      receiverWallet?: Wallet;
    })[]
  > {
    return db
      .select({
        transaction: transactions,
        senderWallet: {
          id: wallets.id,
          name: wallets.name,
          type: wallets.type
        },
        receiverWallet: {
          id: wallets.id,
          name: wallets.name,
          type: wallets.type
        }
      })
      .from(transactions)
      .leftJoin(wallets, eq(transactions.senderWalletId, wallets.id))
      .where(
        and(
          eq(transactions.userId, userId),
          isNull(transactions.deletedAt)
        )
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limitVal)
      .offset(offsetVal);
  }

  /**
   * Creates a new transaction record.
   */
  async createTransaction(data: {
    userId: string;
    senderWalletId?: string;
    receiverWalletId?: string;
    name?: string;
    amount: string;
    type?: "credit" | "debit";
    status?: "pending" | "processing" | "completed" | "failed";
    channel?: "online" | "in_store" | "other";
  }): Promise<Transaction> {
    const [txn] = await db
      .insert(transactions)
      .values(data)
      .returning();
    return txn;
  }
}

export const transactionDal = new TransactionDal();
```
