import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the db module to avoid touching a real DB in unit tests.
vi.mock("@/database/db", () => {
  const valuesMock = vi.fn().mockResolvedValue([
    {
      id: "err-1",
      message: "mocked error",
      createdAt: new Date().toISOString(),
    },
  ]);
  return {
    db: {
      insert: vi.fn().mockReturnValue({ values: valuesMock }),
    },
  };
});

import { errorsDal } from "@/dal/errors.dal";
import { db } from "@/database/db";

describe("ErrorsDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls db.insert and returns the inserted row", async () => {
    const result = await errorsDal.insertError({
      message: "test error",
      path: "/test",
      userId: "user-1",
    });

    // db.insert should have been called.
    expect(db.insert).toHaveBeenCalled();
    // The mock resolved value should be returned as the inserted row.
    expect(result).toHaveProperty("message", "mocked error");
    expect(result).toHaveProperty("id", "err-1");
  });
});
