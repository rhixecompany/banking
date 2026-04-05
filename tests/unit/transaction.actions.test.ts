import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined),
}));

import {
  getRecentTransactions,
  getTransactionHistory,
} from "@/lib/actions/transaction.actions";

describe("getRecentTransactions", () => {
  it("should be a function", () => {
    expect(typeof getRecentTransactions).toBe("function");
  });

  it("should return ok: false when not authenticated", async () => {
    // No session in unit test environment — auth() returns null
    const result = await getRecentTransactions();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});

describe("getTransactionHistory", () => {
  it("should be a function", () => {
    expect(typeof getTransactionHistory).toBe("function");
  });

  it("should return ok: false when not authenticated", async () => {
    const result = await getTransactionHistory();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("should return ok: false when not authenticated with custom pagination", async () => {
    const result = await getTransactionHistory(2, 10);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});
