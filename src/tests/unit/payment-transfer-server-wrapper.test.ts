import { describe, expect, it, vi } from "vitest";

// Mock auth to return a fake session
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({ user: { id: "user-pt-1", name: "PT User" } })),
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
vi.mock("@/actions/recipient.actions", () => ({
  getRecipients: vi.fn(async () => ({ ok: true, recipients: [] })),
}));
vi.mock("@/actions/dwolla.actions", () => ({
  createTransfer: vi.fn(async () => ({ ok: true, id: "tx-1" })),
}));

import { PaymentTransferServerWrapper } from "@/components/payment-transfer/payment-transfer-server-wrapper";
import { auth } from "@/lib/auth";

import { extractPropsFromElement } from "../utils/serverWrapperTestUtils";

describe("PaymentTransferServerWrapper", () => {
  it("returns a JSX element when authenticated", async () => {
    const res = await PaymentTransferServerWrapper();
    expect(res).toBeDefined();
    const props = extractPropsFromElement(res);
    expect(props).toMatchObject({
      wallets: [],
      recipients: [],
    });
    expect(typeof props.createTransfer).toBe("function");
  });

  it("redirects to sign-in when unauthenticated", async () => {
    // Override the mocked auth to simulate no session
    (auth as any).mockImplementationOnce(async () => null);
    await expect(PaymentTransferServerWrapper()).rejects.toThrow(
      /REDIRECT:\/sign-in/,
    );
  });
});
