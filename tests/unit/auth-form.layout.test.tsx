import { render, screen } from "@testing-library/react";
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
vi.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormControl: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormField: ({ render }: any) => <>{render({ field: {} })}</>,
  FormItem: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FormMessage: () => null,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}));
vi.mock("@/components/my-loader/my-loader", () => ({
  default: () => <span>Loading...</span>,
}));

import AuthForm from "@/components/layouts/auth-form";

describe("components/layouts/auth-form", () => {
  it("renders sign-in heading", () => {
    render(<AuthForm type="sign-in" />);
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeTruthy();
  });
});
