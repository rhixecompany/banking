import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Mock chart components that depend on canvas or browser APIs
vi.mock("@/components/doughnut-chart/doughnut-chart", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="doughnut-mock">Doughnut</div>,
}));

vi.mock("@/components/chart-area-interactive/chart-area-interactive", () => ({
  __esModule: true,
  ChartAreaInteractive: (props: any) => (
    <div data-testid="area-mock">Area {props.transactions?.length ?? 0}</div>
  ),
}));

// Mock the onboarding feed which uses next/navigation's useRouter in real code
vi.mock(
  "@/components/shadcn-studio/blocks/onboarding-feed-01/onboarding-feed-01",
  () => ({
    __esModule: true,
    default: (props: any) => (
      <div data-testid="onboarding-mock">Onboarding</div>
    ),
  }),
);

import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";

describe("DashboardClientWrapper", () => {
  it("renders onboarding when no wallets", () => {
    render(
      <DashboardClientWrapper
        accounts={[]}
        wallets={[]}
        transactions={[]}
        userId="u1"
        userName="Alice"
        showOnboarding={true}
      />,
    );

    // Onboarding feed is shown when showOnboarding === true
    expect(screen.getByTestId("onboarding-mock")).toBeInTheDocument();
  });

  it("renders charts and wallets when data present", () => {
    render(
      <DashboardClientWrapper
        accounts={[
          {
            id: "a1",
            currentBalance: 100,
            availableBalance: 100,
            name: "Chk",
            type: "depository",
          },
        ]}
        wallets={[
          {
            id: "w1",
            userId: "u1",
            accessToken: "t",
            sharableId: "s",
            createdAt: new Date(),
            updatedAt: new Date(),
            accessTokenEncrypted: "",
            accountId: null,
          } as any,
        ]}
        transactions={[]}
        userId="u1"
        userName="Alice"
        showOnboarding={false}
      />,
    );

    expect(screen.getByTestId("area-mock")).toBeTruthy();
    expect(screen.getByTestId("doughnut-mock")).toBeTruthy();
  });
});
