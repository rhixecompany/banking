import { db } from "@/database/db";
import { transactions, users, wallets } from "@/database/schema";
import { expect, test } from "@playwright/test";
import { and, eq, isNull } from "drizzle-orm";

/**
 * E2E: Soft Delete Edge Cases
 *
 * Verifies that soft-deleted records (users, wallets, transactions)
 * are properly filtered at the DB level using isNull(deletedAt).
 * Ensures deleted data doesn't leak into active queries.
 *
 * Tests:
 * 1. Deleted user is excluded from active user queries
 * 2. Deleted wallet is excluded from active wallet queries
 * 3. Deleted transaction is excluded from active transaction queries
 */

const SEED_USER_EMAIL = "seed-user@example.com";
const SEED_USER_PASSWORD = "password123";

test.describe("Soft Delete Edge Cases", () => {
  test("should exclude soft-deleted user from active user queries", async () => {
    // Query initial user count (active only)
    const activeUsersBefore = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));

    const beforeCount = activeUsersBefore.length;
    expect(beforeCount).toBeGreaterThan(0);

    // Soft-delete a test user
    const testUserId = crypto.randomUUID();
    await db.insert(users).values({
      id: testUserId,
      email: `deleted-test-${Date.now()}@example.com`,
      role: "user",
    });

    // Verify insertion succeeded
    const insertedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));
    expect(insertedUser).toHaveLength(1);

    // Soft-delete the user
    const now = new Date();
    await db
      .update(users)
      .set({ deletedAt: now })
      .where(eq(users.id, testUserId));

    // Query active users again
    const activeUsersAfter = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));

    // Count should be same as before (deleted user excluded)
    expect(activeUsersAfter.length).toBe(beforeCount);

    // Verify deleted user still exists (soft delete, not hard delete)
    const deletedUserAll = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));
    expect(deletedUserAll).toHaveLength(1);
    expect(deletedUserAll[0].deletedAt).not.toBeNull();
  });

  test("should exclude soft-deleted wallet from active wallet queries", async ({
    page,
  }) => {
    // Login as seed user
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForNavigation();

    // Get seed user ID from DB (via email)
    const seedUserResult = await db
      .select()
      .from(users)
      .where(eq(users.email, SEED_USER_EMAIL))
      .limit(1);
    expect(seedUserResult).toHaveLength(1);
    const seedUserId = seedUserResult[0].id;

    // Query active wallets for seed user
    const activeWalletsBefore = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.userId, seedUserId), isNull(wallets.deletedAt)));

    const beforeCount = activeWalletsBefore.length;

    // Create a test wallet
    const testWalletId = crypto.randomUUID();
    await db.insert(wallets).values({
      id: testWalletId,
      userId: seedUserId,
      sharableId: `test-wallet-${Date.now()}`,
      accessToken: "test-token",
      accountType: "depository",
      accountSubtype: "checking",
    });

    // Verify insertion
    const insertedWallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, testWalletId));
    expect(insertedWallet).toHaveLength(1);

    // Soft-delete the wallet
    const now = new Date();
    await db
      .update(wallets)
      .set({ deletedAt: now })
      .where(eq(wallets.id, testWalletId));

    // Query active wallets again
    const activeWalletsAfter = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.userId, seedUserId), isNull(wallets.deletedAt)));

    // Count should be same (deleted wallet excluded)
    expect(activeWalletsAfter.length).toBe(beforeCount);

    // Verify deleted wallet still exists in DB
    const deletedWalletAll = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, testWalletId));
    expect(deletedWalletAll).toHaveLength(1);
    expect(deletedWalletAll[0].deletedAt).not.toBeNull();
  });

  test("should exclude soft-deleted transaction from active transaction queries", async ({
    page,
  }) => {
    // Login
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForNavigation();

    // Get seed user ID
    const seedUserResult = await db
      .select()
      .from(users)
      .where(eq(users.email, SEED_USER_EMAIL))
      .limit(1);
    const seedUserId = seedUserResult[0].id;

    // Query active transactions for user
    const activeTransactionsBefore = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, seedUserId),
          isNull(transactions.deletedAt),
        ),
      );

    const beforeCount = activeTransactionsBefore.length;

    // Create a test transaction
    const testTransactionId = crypto.randomUUID();
    await db.insert(transactions).values({
      id: testTransactionId,
      userId: seedUserId,
      amount: "50.00",
      currency: "USD",
      type: "debit",
      status: "completed",
    });

    // Verify insertion
    const insertedTransaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, testTransactionId));
    expect(insertedTransaction).toHaveLength(1);

    // Soft-delete the transaction
    const now = new Date();
    await db
      .update(transactions)
      .set({ deletedAt: now })
      .where(eq(transactions.id, testTransactionId));

    // Query active transactions again
    const activeTransactionsAfter = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, seedUserId),
          isNull(transactions.deletedAt),
        ),
      );

    // Count should be same (deleted transaction excluded)
    expect(activeTransactionsAfter.length).toBe(beforeCount);

    // Verify deleted transaction still exists
    const deletedTransactionAll = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, testTransactionId));
    expect(deletedTransactionAll).toHaveLength(1);
    expect(deletedTransactionAll[0].deletedAt).not.toBeNull();
  });
});
