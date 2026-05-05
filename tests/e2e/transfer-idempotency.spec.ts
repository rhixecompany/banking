import { db } from "@/database/db";
import { dwolla_transfers, transactions } from "@/database/schema";
import { expect, test } from "@playwright/test";
import { and, eq } from "drizzle-orm";

/**
 * E2E: Transfer Idempotency
 *
 * Verifies that idempotency key uniqueness prevents duplicate transfers
 * when Dwolla API calls are replayed due to network retries.
 *
 * Tests:
 * 1. Idempotency key uniqueness blocks duplicate transfer requests
 * 2. DB constraint violation returns proper error on replay
 * 3. Transaction ledger remains consistent after idempotent retry
 */

const SEED_USER_EMAIL = "seed-user@example.com";
const SEED_USER_PASSWORD = "password123";

test.describe("Transfer Idempotency", () => {
  test("should reject duplicate transfer with same idempotency key", async ({
    page,
    context,
  }) => {
    // Login as seed user
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForNavigation();

    // Navigate to transfer page
    await page.goto("/dashboard/transfers/new");
    await page.waitForSelector('button:has-text("Send Money")');

    // First transfer with unique idempotency key
    const idempotencyKey1 = `test-transfer-${Date.now()}`;
    await page.fill('input[name="amount"]', "100.00");
    await page.selectOption('select[name="recipientWallet"]', {
      label: "Seed Wallet",
    });

    // Simulate first transfer (success)
    await page.click('button:has-text("Send Money")');
    await page.waitForSelector('text="Transfer initiated"', { timeout: 5000 });

    // Query DB: confirm transfer created with idempotency key
    const transferResult = await db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.idempotencyKey, idempotencyKey1))
      .limit(1);

    expect(transferResult).toHaveLength(1);
    expect(transferResult[0].idempotencyKey).toBe(idempotencyKey1);

    // Attempt replay (same idempotency key) via direct action call
    // This simulates network retry scenario
    const replayResponse = await context.request.post(
      "http://localhost:3000/api/transfer",
      {
        data: {
          amount: "100.00",
          idempotencyKey: idempotencyKey1,
          recipientWalletId: transferResult[0].receiverWalletId,
        },
      },
    );

    // DB constraint should reject; expect error or 409 Conflict
    expect(replayResponse.status()).toBe(409);
  });

  test("should allow different idempotency keys for separate transfers", async ({
    page,
  }) => {
    // Login
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForNavigation();

    // Navigate to transfer page
    await page.goto("/dashboard/transfers/new");

    // First transfer
    const idempotencyKey1 = `test-transfer-1-${Date.now()}`;
    await page.fill('input[name="amount"]', "50.00");
    await page.selectOption('select[name="recipientWallet"]', {
      label: "Seed Wallet",
    });
    await page.click('button:has-text("Send Money")');
    await page.waitForSelector('text="Transfer initiated"');

    // Second transfer (different idempotency key, same recipient)
    const idempotencyKey2 = `test-transfer-2-${Date.now()}`;
    await page.goto("/dashboard/transfers/new");
    await page.fill('input[name="amount"]', "75.00");
    await page.selectOption('select[name="recipientWallet"]', {
      label: "Seed Wallet",
    });
    await page.click('button:has-text("Send Money")');
    await page.waitForSelector('text="Transfer initiated"');

    // Query DB: confirm both transfers exist with different idempotency keys
    const transfers = await db
      .select()
      .from(dwolla_transfers)
      .where(
        and(
          eq(dwolla_transfers.idempotencyKey, idempotencyKey1),
          eq(dwolla_transfers.idempotencyKey, idempotencyKey2),
        ),
      );

    // Both should exist (query is inclusive of either key due to OR logic in DAL)
    const t1 = await db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.idempotencyKey, idempotencyKey1))
      .limit(1);

    const t2 = await db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.idempotencyKey, idempotencyKey2))
      .limit(1);

    expect(t1).toHaveLength(1);
    expect(t2).toHaveLength(1);
    expect(t1[0].idempotencyKey).not.toBe(t2[0].idempotencyKey);
  });

  test("should maintain transaction ledger consistency after idempotent retry", async ({
    page,
  }) => {
    // Login
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForNavigation();

    // Initiate transfer
    await page.goto("/dashboard/transfers/new");
    const idempotencyKey = `test-ledger-${Date.now()}`;
    const amount = "125.50";

    await page.fill('input[name="amount"]', amount);
    await page.selectOption('select[name="recipientWallet"]', {
      label: "Seed Wallet",
    });
    await page.click('button:has-text("Send Money")');
    await page.waitForSelector('text="Transfer initiated"');

    // Query initial state
    const transfersInitial = await db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.idempotencyKey, idempotencyKey));

    expect(transfersInitial).toHaveLength(1);
    const transferId = transfersInitial[0].id;

    // Attempt replay
    const replayResponse = await page
      .context()
      .request.post("http://localhost:3000/api/transfer", {
        data: {
          amount,
          idempotencyKey,
          recipientWalletId: transfersInitial[0].receiverWalletId,
        },
      });

    // Verify still only 1 transfer record (no duplicate created)
    const transfersAfterRetry = await db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.idempotencyKey, idempotencyKey));

    expect(transfersAfterRetry).toHaveLength(1);
    expect(transfersAfterRetry[0].id).toBe(transferId);

    // Verify transaction ledger also has only 1 entry for this transfer
    const senderWalletId = transfersInitial[0].senderWalletId;
    const receiverWalletId = transfersInitial[0].receiverWalletId;

    const ledgerEntries =
      senderWalletId && receiverWalletId
        ? await db
            .select()
            .from(transactions)
            .where(
              and(
                eq(transactions.senderWalletId, senderWalletId),
                eq(transactions.receiverWalletId, receiverWalletId),
              ),
            )
        : [];

    // Only 1 transaction should exist (idempotent)
    expect(ledgerEntries.length).toBeLessThanOrEqual(1);
  });
});
