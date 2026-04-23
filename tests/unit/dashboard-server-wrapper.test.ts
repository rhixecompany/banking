import { describe, expect, it, vi } from "vitest";

// Mock auth to return a fake session
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "user-1", name: "Test User" } })),
}));

// Mock redirect for unauthenticated checks
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
}));

// Mock actions to return stable shapes
vi.mock("@/actions/wallet.actions", () => ({
  getUserWallets: vi.fn(async () => ({ ok: true, wallets: [] })),
}));
vi.mock("@/actions/plaid.actions", () => ({
  getAllAccounts: vi.fn(async () => ({ ok: true, accounts: [] })),
}));
vi.mock("@/actions/transaction.actions", () => ({
  getRecentTransactions: vi.fn(async () => ({ ok: true, transactions: [] })),
}));

import { DashboardServerWrapper } from "@/components/dashboard/dashboard-server-wrapper";
import { auth } from "@/lib/auth";

import { extractPropsFromElement } from "../utils/serverWrapperTestUtils";

describe("DashboardServerWrapper", () => {
  it("returns a JSX element when authenticated", async () => {
    const res = await DashboardServerWrapper();
    expect(res).toBeDefined();
    const props = extractPropsFromElement(res);
    expect(props).toMatchObject({
      wallets: [],
      accounts: [],
      transactions: [],
    });
  });

  it("redirects to sign-in when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(async () => null);
    await expect(DashboardServerWrapper()).rejects.toThrow(
      /REDIRECT:\/sign-in/,
    );
  });
});
