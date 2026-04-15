import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { disconnectWallet, getUserWallets } from "@/actions/wallet.actions";
import { auth } from "@/lib/auth";

// Default to unauthenticated for all tests unless a test overrides this
beforeEach(() => {
  // Use `null` rather than `undefined` to satisfy types expecting Session | null
  vi.mocked(auth).mockResolvedValue(null);
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
    // Provide the minimal required user shape expected by our auth typings.
    vi.mocked(auth).mockResolvedValue({
      user: { id: "test-user-id", isAdmin: false, isActive: true },
      // next-auth Session requires an expires ISO string
      expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    });
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
