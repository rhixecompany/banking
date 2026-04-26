import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { WalletWithDetails } from "@/types/wallet";

import WalletCard from "@/components/layouts/wallet-card";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardDescription: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  CardHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: ReactNode }) => (
    <button>{children}</button>
  ),
}));

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {WalletWithDetails}
 */
const mockWallet: WalletWithDetails = {
  accessToken: "MOCK",
  accountId: "acc-1",
  accountNumberEncrypted: "enc-account",
  accountSubtype: "checking",
  accountType: "depository",
  balances: [
    {
      accountId: "a1",
      balances: {
        available: 100,
        current: 120,
        isoCurrencyCode: "USD",
        limit: 0,
      },
    },
  ],
  createdAt: new Date(),
  customerUrl: "https://api.dwolla.com/customers/mock",
  deletedAt: new Date("2024-01-01T00:00:00.000Z"),
  fundingSourceUrl: "https://api.dwolla.com/funding-sources/mock",
  id: "w1",
  institutionId: "ins-1",
  institutionName: "Test Bank",
  routingNumber: "021000021",
  sharableId: "s1",
  transactions: [],
  updatedAt: new Date(),
  userId: "u1",
};

describe("WalletCard", () => {
  it("renders institution name and balance", () => {
    render(
      <WalletCard
        wallet={mockWallet}
        removeWallet={() => Promise.resolve({ ok: true })}
      />,
    );
    expect(screen.getByText(/Test Bank/i)).toBeTruthy();
    // There are multiple places where the formatted balance appears; assert
    // on the formatted currency string instead to be precise.
    expect(screen.getAllByText(/\$120\.00/)[0]).toBeTruthy();
  });
});
