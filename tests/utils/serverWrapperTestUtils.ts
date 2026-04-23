import type { ReactElement } from "react";

// Returns a mock object for next/navigation that throws on redirect so tests can assert it
export const mockRedirectThrow = () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
});

// Factory to create an auth mock (vi.fn) that resolves to the given session object
export const makeAuthMock = (
  session = { user: { id: "test-user", name: "Test User" } },
) => {
  return vi.fn(async () => session);
};

// Extract props from a React element safely for assertions in tests
export const extractPropsFromElement = (el: ReactElement | null) => {
  if (!el) return {};
  // ReactElement has a `props` property at runtime in tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (el as any).props ?? {};
};

// Ensure vi is in scope (Vitest provides global vi in tests but importing here helps type-check)
import { vi } from "vitest";
