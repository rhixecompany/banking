/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";

test("renders Dashboard metrics with provided props", () => {
  const accounts = [{ currentBalance: 123.45 }] as any;
  const wallets = [{ id: "w1" }] as any;
  const transactions: any[] = [];

  render(
    <DashboardClientWrapper
      accounts={accounts}
      wallets={wallets}
      transactions={transactions}
      userId="user1"
      userName="Tester"
      showOnboarding={false}
    />,
  );

  // KPI card label
  expect(screen.getByText(/Total Balance/i)).toBeDefined();

  // Formatted currency for the total balance (Intl.NumberFormat en-US)
  expect(screen.getByText(/\$123\.45/)).toBeDefined();
});
