import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    <img alt={props.alt as string} src={props.src as string} />
  ),
}));
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import AdminDashboardContent from "@/components/layouts/admin-dashboard";

describe("components/layouts/admin-dashboard", () => {
  it("resolves the admin dashboard re-export", () => {
    // Smoke render with minimal props expected by the component.
    render(
      <AdminDashboardContent
        stats={null}
        recentTransactions={[]}
        transactionStatusStats={{}}
        transactionTypeStats={{}}
      />,
    );
    expect(true).toBeTruthy();
  });
});
