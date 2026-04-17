import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import WalletCard from "@/components/layouts/wallet-card";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

import type { WalletWithDetails } from "@/types/wallet";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {WalletWithDetails}
 */
const mockWallet: WalletWithDetails = {
  accessToken: "MOCK",
  accountId: null,
  accountSubtype: "checking",
  accountType: "depository",
  balances: [
    {
      accountId: "a1",
      balances: {
        available: 100,
        current: 120,
        isoCurrencyCode: null,
        limit: null,
      },
    },
  ],
  createdAt: new Date(),
  fundingSourceUrl: null,
  id: "w1",
  institutionId: null,
  institutionName: "Test Bank",
  sharableId: "s1",
  transactions: [],
  updatedAt: new Date(),
  userId: "u1",
  // The WalletWithDetails type includes some optional properties that
  // our unit test does not rely on; cast to any when running in tests
} as any;

describe("WalletCard", () => {
  it("renders institution name and balance", () => {
    render(
      <WalletCard
        wallet={mockWallet}
        removeWallet={async () => ({ ok: true })}
      />,
    );
    expect(screen.getByText(/Test Bank/i)).toBeTruthy();
    // There are multiple places where the formatted balance appears; assert
    // on the formatted currency string instead to be precise.
    expect(screen.getAllByText(/\$120\.00/)[0]).toBeTruthy();
  });
});
