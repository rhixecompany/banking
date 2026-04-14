import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { disconnectWallet, getUserWallets } from "@/actions/wallet.actions";
import { auth } from "@/lib/auth";

// Default to unauthenticated for all tests unless a test overrides this
beforeEach(() => {
  vi.mocked(auth).mockResolvedValue(undefined);
});

describe("getUserWallets", () => {
  it("should be a function", () => {
    expect(typeof getUserWallets).toBe("function");
  });

  it("should return ok: false when not authenticated", async () => {
    const result = await getUserWallets();
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});

describe("disconnectWallet", () => {
  it("should be a function", () => {
    expect(typeof disconnectWallet).toBe("function");
  });

  it("should return ok: false for invalid (non-UUID) walletId", async () => {
    // Simulate an authenticated session so validation runs
    vi.mocked(auth).mockResolvedValue({ user: { id: "test-user-id" } });
    const result = await disconnectWallet("not-a-uuid");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid wallet ID format");
  });

  it("should return ok: false when not authenticated (valid UUID)", async () => {
    const result = await disconnectWallet(
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });
});
