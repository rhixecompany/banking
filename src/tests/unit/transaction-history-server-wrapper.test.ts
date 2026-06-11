import { describe, expect, it, vi } from "vitest";

// Mock auth to return a fake session
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "user-th-1", name: "TH User" } })),
}));

// Mock redirect for unauthenticated checks
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
}));

// Mock actions to return stable shapes
vi.mock("@/actions/transaction.actions", () => ({
  getTransactionHistory: vi.fn(async () => ({ ok: true, transactions: [] })),
}));

import { TransactionHistoryServerWrapper } from "@/components/transaction-history/transaction-history-server-wrapper";
import { auth } from "@/lib/auth";

import { extractPropsFromElement } from "../utils/serverWrapperTestUtils";

describe("TransactionHistoryServerWrapper", () => {
  it("returns a JSX element when authenticated", async () => {
    const res = await TransactionHistoryServerWrapper();
    expect(res).toBeDefined();
    const props = extractPropsFromElement(res);
    expect(props).toMatchObject({ transactions: [] });
  });

  it("redirects to sign-in when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(async () => null);
    await expect(TransactionHistoryServerWrapper()).rejects.toThrow(
      /REDIRECT:\/sign-in/,
    );
  });
});
