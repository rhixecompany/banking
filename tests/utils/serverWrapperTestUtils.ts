import type { ReactElement } from "react";
import { vi } from "vitest";

// Returns a mock object for next/navigation that throws on redirect so tests can assert it
// NOTE: Do NOT use vi.fn() in this factory - it causes hoisting issues in vitest.
// Instead, we return a function that throws at call time.
export const mockRedirectThrow = () => ({
  // redirect is a function that throws when called (simulating server-side redirect)
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
export const extractPropsFromElement = (el: null | ReactElement) => {
  if (!el) return {};
  // ReactElement has a `props` property at runtime in tests

  return (el as any).props ?? {};
};
