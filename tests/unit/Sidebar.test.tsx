import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { User } from "@/types/user";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    <img alt={props.alt as string} src={props.src as string} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    className,
    href,
  }: {
    children: React.ReactNode;
    className?: string;
    href: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockPathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

// Footer is rendered inside Sidebar — stub it out
vi.mock("@/components/footer/footer", () => ({
  default: () => <div data-testid="footer-stub" />,
}));

import React from "react";

import Sidebar from "@/components/sidebar/sidebar";

// ---------------------------------------------------------------------------
// Minimal user fixture
// ---------------------------------------------------------------------------

const mockUser: User = {
  createdAt: new Date(),
  email: "alice@example.com",
  emailVerified: null,
  id: "1",
  image: null,
  isActive: true,
  isAdmin: false,
  name: "Alice",
  password: null,
  role: "user",
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Sidebar", () => {
  it("renders the Horizon logo link", () => {
    render(<Sidebar user={mockUser} />);
    const logoLink = screen.getByRole("link", { name: /horizon logo/i });
    expect(logoLink).toBeTruthy();
    expect((logoLink as HTMLAnchorElement).href).toContain("/");
  });

  it("renders all sidebar nav links from sidebarLinks constant", () => {
    render(<Sidebar user={mockUser} />);
    // sidebarLinks has: Home, My Banks, Transaction History, Transfer Funds
    expect(screen.getByRole("link", { name: /home/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /my banks/i })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /transaction history/i }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /transfer funds/i })).toBeTruthy();
  });

  it("renders the footer stub", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByTestId("footer-stub")).toBeTruthy();
  });

  it("applies active class when pathname matches a link route", () => {
    mockPathname.mockReturnValue("/my-banks");
    render(<Sidebar user={mockUser} />);
    const myBanksLink = screen.getByRole("link", { name: /my banks/i });
    expect((myBanksLink as HTMLAnchorElement).className).toContain(
      "bg-bank-gradient",
    );
  });

  it("does not apply active class to non-matching links", () => {
    mockPathname.mockReturnValue("/my-banks");
    render(<Sidebar user={mockUser} />);
    const homeLink = screen.getByRole("link", { name: /home home/i });
    expect((homeLink as HTMLAnchorElement).className).not.toContain(
      "bg-bank-gradient",
    );
  });
});
