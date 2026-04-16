import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/// <reference types="vitest" />
import { MyWalletsClientWrapper } from "@/components/my-wallets/my-wallets-client-wrapper";

// Mock PlaidLinkButton to a simple component that renders its children so tests
// don't depend on Plaid provider behavior.
vi.mock("@/components/plaid-link-button/plaid-link-button", () => ({
  PlaidLinkButton: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { toast } from "sonner";

describe("MyWalletsClientWrapper", () => {
  it("calls removeWallet server action when remove button is clicked", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ ok: true });

    const wallets = [
      {
        accountSubtype: "Standard",
        accountType: "Checking",
        balances: [
          {
            accountId: "acc1",
            balances: { available: 100, current: 100, limit: null },
          },
        ],
        id: "w1",
        institutionName: "Mock Bank",
        transactions: [],
      },
    ];

    render(
      <MyWalletsClientWrapper
        walletsWithDetails={wallets as any}
        totalBalance={100}
        userId="user1"
        removeWallet={mockRemove}
      />,
    );

    // Find the remove button by aria label
    const btn = screen.getByLabelText("Remove Mock Bank");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalled();
    });
  });

  it("renders empty state when no wallets are present", () => {
    const mockRemove = vi.fn();

    render(
      <MyWalletsClientWrapper
        walletsWithDetails={[] as any}
        totalBalance={0}
        userId="user1"
        removeWallet={mockRemove}
      />,
    );

    expect(screen.getByText(/No wallets linked/i)).toBeTruthy();
    // Empty state contains a PlaidLinkButton with child text "Link Your First Wallet"
    expect(screen.getByText(/Link Your First Wallet/i)).toBeTruthy();
  });

  it("renders Add Wallet button in header", () => {
    const mockRemove = vi.fn();
    const wallets = [
      {
        accountSubtype: "Standard",
        accountType: "Checking",
        balances: [
          {
            accountId: "acc1",
            balances: { available: 100, current: 100, limit: null },
          },
        ],
        id: "w1",
        institutionName: "Mock Bank",
        transactions: [],
      },
    ];

    render(
      <MyWalletsClientWrapper
        walletsWithDetails={wallets as any}
        totalBalance={100}
        userId="user1"
        removeWallet={mockRemove}
      />,
    );

    expect(screen.getByText(/Add Wallet/i)).toBeTruthy();
  });

  it("shows toast error when removeWallet fails", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ error: "Boom", ok: false });

    const wallets = [
      {
        accountSubtype: "Standard",
        accountType: "Checking",
        balances: [
          {
            accountId: "acc1",
            balances: { available: 100, current: 100, limit: null },
          },
        ],
        id: "w1",
        institutionName: "Mock Bank",
        transactions: [],
      },
    ];

    render(
      <MyWalletsClientWrapper
        walletsWithDetails={wallets as any}
        totalBalance={100}
        userId="user1"
        removeWallet={mockRemove}
      />,
    );

    const btn = screen.getByLabelText("Remove Mock Bank");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
