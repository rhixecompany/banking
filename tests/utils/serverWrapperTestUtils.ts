import type { ReactElement } from "react";

// Returns a mock object for next/navigation that throws on redirect so tests can assert it
/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {{ redirect: (url: string) => never; }}
 */
export const mockRedirectThrow = () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
});

// Factory to create an auth mock (vi.fn) that resolves to the given session object
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {{ user: { id: string; name: string; }; }} [session={ user: { id: "test-user", name: "Test User" } }]
 * @returns {*}
 */
export const makeAuthMock = (
  session = { user: { id: "test-user", name: "Test User" } },
) => {
  return vi.fn(async () => session);
};

// Extract props from a React element safely for assertions in tests
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {(ReactElement | null)} el
 * @returns {*}
 */
export const extractPropsFromElement = (el: null | ReactElement) => {
  if (!el) return {};
  // ReactElement has a `props` property at runtime in tests

  return (el as any).props ?? {};
};

// Ensure vi is in scope (Vitest provides global vi in tests but importing here helps type-check)
import { vi } from "vitest";
