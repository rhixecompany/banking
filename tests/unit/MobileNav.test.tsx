import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { User } from "@/types/user";

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("next/image", () => ({
  default: ({ alt, src, ...rest }: Record<string, unknown>) => (
    <img alt={alt as string} src={src as string} {...(rest as object)} />
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

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
const mockPathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

// Stub shadcn Sheet components — open state is irrelevant for structural tests
vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetClose: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/footer/footer", () => ({
  default: () => <div data-testid="footer-stub" />,
}));

import React from "react";

import MobileNav from "@/components/mobile-nav/mobile-nav";

// ---------------------------------------------------------------------------
// Minimal user fixture
// ---------------------------------------------------------------------------

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {User}
 */
const mockUser: User = {
  createdAt: new Date(),
  email: "alice@example.com",
  // eslint-disable-next-line unicorn/no-null
  emailVerified: null,
  id: "1",
  // eslint-disable-next-line unicorn/no-null
  image: null,
  isActive: true,
  isAdmin: false,
  name: "Alice",
  // eslint-disable-next-line unicorn/no-null
  password: null,
  role: "user",
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MobileNav", () => {
  it("renders the hamburger menu image", () => {
    render(<MobileNav user={mockUser} />);
    const hamburger = screen.getByAltText("menu");
    expect(hamburger).toBeTruthy();
  });

  it("hamburger image has role=button and aria-label", () => {
    render(<MobileNav user={mockUser} />);
    const hamburger = screen.getByAltText("menu");
    expect((hamburger as HTMLImageElement).getAttribute("role")).toBe("button");
    expect((hamburger as HTMLImageElement).getAttribute("aria-label")).toBe(
      "Open navigation menu",
    );
  });

  it("renders the Horizon logo link inside the sheet", () => {
    render(<MobileNav user={mockUser} />);
    const logoLinks = screen.getAllByRole("link", { name: /horizon logo/i });
    expect(logoLinks.length).toBeGreaterThan(0);
  });

  it("renders all navigation links", () => {
    render(<MobileNav user={mockUser} />);
    expect(screen.getByRole("link", { name: /home/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /my banks/i })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /transaction history/i }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /transfer funds/i })).toBeTruthy();
  });

  it("renders the footer stub", () => {
    render(<MobileNav user={mockUser} />);
    expect(screen.getByTestId("footer-stub")).toBeTruthy();
  });

  it("applies active class when pathname matches a link route", () => {
    mockPathname.mockReturnValue("/payment-transfer");
    render(<MobileNav user={mockUser} />);
    const transferLink = screen.getByRole("link", { name: /transfer funds/i });
    expect((transferLink as HTMLAnchorElement).className).toContain(
      "bg-bank-gradient",
    );
  });
});
