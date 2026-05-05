import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "error-1",
            message: "Test error",
          },
        ]),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  errors: {
    id: "id",
    message: "message",
    path: "path",
    severity: "severity",
    stack: "stack",
    userId: "userId",
    createdAt: "createdAt",
  },
}));

import { errorsDal } from "@/dal/errors.dal";
import { db } from "@/database/db";

describe("ErrorsDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("insertError", () => {
    it("inserts error record", async () => {
      const result = await errorsDal.insertError({
        message: "Test error",
      });
      expect(db.insert).toHaveBeenCalled();
    });
  });

  it("inserts error with full data", async () => {
    const result = await errorsDal.insertError({
      message: "Full error",
      path: "/api/test",
      severity: "critical",
      stack: "Error stack",
      userId: "user-1",
    });
    expect(db.insert).toHaveBeenCalled();
  });
});

describe("getRecentErrors", () => {
  it("gets recent errors with defaults", async () => {
    const result = await errorsDal.getRecentErrors();
    expect(db.select).toHaveBeenCalled();
  });

  it("gets recent errors with custom params", async () => {
    const result = await errorsDal.getRecentErrors(48, 100);
    expect(db.select).toHaveBeenCalled();
  });
});

describe("clearOldErrors", () => {
  it("clears old errors with defaults", async () => {
    await errorsDal.clearOldErrors();
    expect(db.delete).toHaveBeenCalled();
  });

  it("clears old errors with custom days", async () => {
    await errorsDal.clearOldErrors(7);
    expect(db.delete).toHaveBeenCalled();
  });
});
