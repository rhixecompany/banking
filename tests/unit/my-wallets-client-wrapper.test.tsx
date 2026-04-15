/// <reference types="vitest" />
import { MyWalletsClientWrapper } from "@/components/my-wallets/my-wallets-client-wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("MyWalletsClientWrapper", () => {
  it("calls removeWallet server action when remove button is clicked", async () => {
    const mockRemove = vi.fn().mockResolvedValue({ ok: true });

    const wallets = [
      {
        id: "w1",
        institutionName: "Mock Bank",
        accountType: "Checking",
        accountSubtype: "Standard",
        balances: [
          {
            balances: { current: 100, available: 100, limit: null },
            accountId: "acc1",
          },
        ],
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
});
