import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WalletCard from "./index";

describe("WalletCard", () => {
  it("renders wallet details and optional actions", () => {
    const wallet = {
      id: "w1",
      institutionName: "Test Bank",
      accountType: "Checking",
      accountSubtype: "Standard",
      balances: [{ balances: { current: 100 } }],
    } as any;

    render(
      <WalletCard wallet={wallet} showActions={true} onRemove={() => {}} />,
    );

    expect(screen.getByText(/Test Bank/i)).toBeTruthy();
    expect(screen.getByText(/Checking/i)).toBeTruthy();
    expect(screen.getByText(/100/)).toBeTruthy();
  });
});
