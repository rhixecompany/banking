import { describe, expect, it, vi } from "vitest";

import { SignInServerWrapper } from "@/components/sign-in/sign-in-server-wrapper";

// Mock next/navigation for redirect
vi.mock("next/navigation", async () => {
  const actual = await import("next/navigation");
  return {
    ...actual,
    redirect: vi.fn(),
    notFound: vi.fn(),
  };
});

// Mock auth to return null (unauthenticated)
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

describe("SignInServerWrapper", () => {
  it("is an async function that returns a JSX element when unauthenticated", async () => {
    const res = await SignInServerWrapper();
    // We expect a JSX-like object (not null/undefined)
    expect(res).toBeTruthy();
  });
});
