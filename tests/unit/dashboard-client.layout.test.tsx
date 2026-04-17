import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import DashboardClientWrapper from "@/components/layouts/dashboard-client";

describe("components/layouts/dashboard-client", () => {
  it("renders with minimal props", () => {
    render(
      <DashboardClientWrapper
        accounts={[]}
        wallets={[]}
        transactions={[]}
        userId="test-user"
        userName="Test User"
        showOnboarding={false}
      />,
    );
    expect(true).toBeTruthy();
  });
});
