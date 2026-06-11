import { describe, expect, it, vi } from "vitest";

// Force auth to succeed for this test but make the DAL throw to validate
// that the action returns a stable error shape.
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: "user-1" } }),
}));

vi.mock("@/dal", async () => {
  const actual = await vi.importActual<typeof import("@/dal")>("@/dal");
  return {
    ...actual,
    transactionDal: {
      ...actual.transactionDal,
      findByUserId: vi.fn().mockImplementation(() => {
        throw new Error("DB is down");
      }),
    },
  };
});

import {
  getRecentTransactions,
  getTransactionHistory,
} from "@/actions/transaction.actions";

describe("transaction actions - DAL error handling", () => {
  it("getRecentTransactions returns stable error when DAL throws", async () => {
    const res = await getRecentTransactions(5);
    expect(res.ok).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("getTransactionHistory returns stable error when DAL throws", async () => {
    const res = await getTransactionHistory(1, 10);
    expect(res.ok).toBe(false);
    expect(res.error).toBeDefined();
  });
});
