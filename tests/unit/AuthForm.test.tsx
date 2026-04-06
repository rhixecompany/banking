import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Module mocks — must be declared before the import under test
// ---------------------------------------------------------------------------

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    return <img alt={props.alt as string} src={props.src as string} />;
  },
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Stub every CustomInput to a simple labelled <input> so we can assert by label
vi.mock("@/components/custom-input/custom-input", () => ({
  default: ({ label, name }: { label: string; name: string }) => (
    <label>
      {label}
      <input name={name} />
    </label>
  ),
}));

vi.mock("@/components/my-loader/my-loader", () => ({
  default: () => <span>Loading...</span>,
}));

// Stub out Form / useForm internals — we only care about structural rendering
vi.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormControl: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormField: ({
    render,
  }: {
    render: (arg: { field: Record<string, unknown> }) => React.ReactNode;
  }) => <>{render({ field: {} })}</>,
  FormItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FormMessage: () => undefined,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...rest}>{children}</button>
  ),
}));

import React from "react";

import AuthForm from "@/components/auth-form/auth-form";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AuthForm", () => {
  describe("sign-in mode", () => {
    it("renders the Sign In heading", () => {
      render(<AuthForm type="sign-in" />);
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeTruthy();
    });

    it("renders only Email and Password inputs", () => {
      render(<AuthForm type="sign-in" />);
      expect(screen.getByPlaceholderText("Enter your email")).toBeTruthy();
      expect(screen.getByPlaceholderText("Enter your password")).toBeTruthy();
      expect(
        screen.queryByPlaceholderText("Enter your first name"),
      ).not.toBeTruthy();
    });

    it("renders the Sign In submit button", () => {
      render(<AuthForm type="sign-in" />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeTruthy();
    });

    it("shows a link to the sign-up page", () => {
      render(<AuthForm type="sign-in" />);
      const link = screen.getByRole("link", { name: /sign up/i });
      expect(link).toBeTruthy();
      expect((link as HTMLAnchorElement).href).toContain("/sign-up");
    });

    it("shows the details subtext", () => {
      render(<AuthForm type="sign-in" />);
      expect(screen.getByText("Please enter your details")).toBeTruthy();
    });
  });

  describe("sign-up mode", () => {
    it("renders the Sign Up heading", () => {
      render(<AuthForm type="sign-up" />);
      expect(screen.getByRole("heading", { name: /sign up/i })).toBeTruthy();
    });

    it("renders all sign-up specific inputs", () => {
      render(<AuthForm type="sign-up" />);
      const expectedPlaceholders = [
        "Enter your first name",
        "Enter your last name",
        "Enter your address",
        "Enter your city",
        "Enter your state",
        "Enter your postal code",
        "YYYY-MM-DD",
        "Example: 1234",
        "Enter your email",
        "Enter your password",
        "Confirm your password",
      ];
      for (const placeholder of expectedPlaceholders) {
        expect(
          screen.getByPlaceholderText(placeholder),
          `Missing input: ${placeholder}`,
        ).toBeTruthy();
      }
    });

    it("renders the Sign Up submit button", () => {
      render(<AuthForm type="sign-up" />);
      expect(screen.getByRole("button", { name: /sign up/i })).toBeTruthy();
    });

    it("shows a link to the sign-in page", () => {
      render(<AuthForm type="sign-up" />);
      const link = screen.getByRole("link", { name: /sign in/i });
      expect(link).toBeTruthy();
      expect((link as HTMLAnchorElement).href).toContain("/sign-in");
    });
  });
});
