import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(undefined),
}));

import { getLoggedInUser, logoutAccount } from "@/lib/actions/user.actions";

describe("getLoggedInUser", () => {
  it("should be a function", () => {
    expect(typeof getLoggedInUser).toBe("function");
  });

  it("should return undefined when not authenticated", async () => {
    // No session is set up in unit test environment — auth() returns null
    const result = await getLoggedInUser();
    expect(result).toBeUndefined();
  });
});

describe("logoutAccount", () => {
  it("should be a function", () => {
    expect(typeof logoutAccount).toBe("function");
  });
});
