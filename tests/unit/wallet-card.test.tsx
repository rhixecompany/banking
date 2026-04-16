import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import WalletCard from "@/components/layouts/wallet-card";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));

import type { WalletWithDetails } from "@/types/wallet";

const mockWallet: WalletWithDetails = {
  id: "w1",
  userId: "u1",
  accessToken: "MOCK",
  sharableId: "s1",
  institutionName: "Test Bank",
  institutionId: null,
  accountId: null,
  accountType: "depository",
  accountSubtype: "checking",
  fundingSourceUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
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
  transactions: [],
};

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
