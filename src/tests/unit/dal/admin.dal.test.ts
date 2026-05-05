import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ count: 10 }]),
      }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  transactions: { amount: "amount", createdAt: "createdAt", id: "id" },
  users: { id: "id" },
  wallets: { id: "id" },
}));

vi.mock("@/lib/logger", () => ({
  error: vi.fn(),
}));

import { adminDal } from "@/dal/admin.dal";
import { db } from "@/database/db";

describe("AdminDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStats", () => {
    it("returns stats with counts", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockResolvedValue([{ count: 5 }]);

      const result = await adminDal.getStats();
      expect(result).toBeDefined();
      expect(result.totalUsers).toBeDefined();
    });

    it("returns zero counts on error", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("DB error"),
      );

      const result = await adminDal.getStats();
      expect(result.totalUsers).toBe(0);
    });
  });
});
