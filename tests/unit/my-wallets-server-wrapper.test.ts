import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "user-1", name: "Test User" } })),
}));

vi.mock("@/actions/plaid.actions", () => ({
  getAllWalletsWithDetails: vi.fn(async () => ({
    ok: true,
    walletsWithDetails: [],
    totalBalance: 0,
  })),
  removeWallet: vi.fn(async () => ({ ok: true })),
}));

import { MyWalletsServerWrapper } from "@/components/my-wallets/my-wallets-server-wrapper";
import { auth } from "@/lib/auth";
import {
  extractPropsFromElement,
  mockRedirectThrow,
} from "../utils/serverWrapperTestUtils";

vi.mock("next/navigation", () => mockRedirectThrow());

describe("MyWalletsServerWrapper", () => {
  it("returns a JSX element when authenticated", async () => {
    const res = await MyWalletsServerWrapper();
    expect(res).toBeDefined();
    const props = extractPropsFromElement(res);
    expect(props).toMatchObject({
      walletsWithDetails: [],
      totalBalance: 0,
    });
    expect(typeof props.removeWallet).toBe("function");
  });

  it("redirects to sign-in when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(async () => null);
    await expect(MyWalletsServerWrapper()).rejects.toThrow(
      /REDIRECT:\/sign-in/,
    );
  });
});
