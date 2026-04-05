import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined),
}));

import { disconnectBank, getUserBanks } from "@/lib/actions/bank.actions";

describe("getUserBanks", () => {
  it("should be a function", () => {
    expect(typeof getUserBanks).toBe("function");
  });

  it("should return ok: false when not authenticated", async () => {
    // No session in unit test environment — auth() returns null
    const result = await getUserBanks();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});

describe("disconnectBank", () => {
  it("should be a function", () => {
    expect(typeof disconnectBank).toBe("function");
  });

  it("should return ok: false for invalid (non-UUID) bankId", async () => {
    const result = await disconnectBank("not-a-uuid");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid bank ID format");
  });

  it("should return ok: false when not authenticated (valid UUID)", async () => {
    // Valid UUID format but no session set up
    const result = await disconnectBank("550e8400-e29b-41d4-a716-446655440000");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});
