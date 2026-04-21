import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the DB to throw so we can test defensive fallbacks
vi.mock("@/database/db", () => ({
  // The dal uses db.select(...).from(...).where(...), but mocking a function that throws
  select: vi.fn(() => {
    throw new Error("simulated db failure");
  }),
}));

import { adminDal } from "@/dal/admin.dal";
import * as logger from "@/lib/logger";

describe("AdminDal defensive fallbacks", () => {
  let errSpy: any;

  beforeEach(() => {
    errSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns zeros for getStats when DB fails", async () => {
    const res = await adminDal.getStats();
    expect(res.totalUsers).toBe(0);
    expect(res.totalWallets).toBe(0);
    expect(errSpy).toHaveBeenCalled();
  });

  it("returns empty status counts on getTransactionStatusStats failure", async () => {
    const res = await adminDal.getTransactionStatusStats();
    expect(res.completed).toBe(0);
    expect(res.pending).toBe(0);
    expect(errSpy).toHaveBeenCalled();
  });

  it("returns credit/debit zeros on getTransactionTypeStats failure", async () => {
    const res = await adminDal.getTransactionTypeStats();
    expect(res.credit).toBe(0);
    expect(res.debit).toBe(0);
    expect(errSpy).toHaveBeenCalled();
  });

  it("returns [] for getRecentTransactions on failure", async () => {
    const res = await adminDal.getRecentTransactions();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(0);
    expect(errSpy).toHaveBeenCalled();
  });

  it("returns empty paginated users on getUsersPaginated failure", async () => {
    const res = await adminDal.getUsersPaginated({ page: 1, pageSize: 10 });
    expect(res.pagination.totalItems).toBe(0);
    expect(res.users.length).toBe(0);
    expect(errSpy).toHaveBeenCalled();
  });
});
