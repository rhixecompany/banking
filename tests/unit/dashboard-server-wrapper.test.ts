import { describe, expect, it, vi } from "vitest";

// We'll import the server wrapper and mock auth and actions to verify behavior
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/actions/wallet.actions", () => ({
  getUserWallets: vi.fn(() => Promise.resolve({ ok: true, wallets: [] })),
}));

vi.mock("@/actions/plaid.actions", () => ({
  getAllAccounts: vi.fn(() => Promise.resolve({ ok: true, accounts: [] })),
}));

vi.mock("@/actions/transaction.actions", () => ({
  getRecentTransactions: vi.fn(() =>
    Promise.resolve({ ok: true, transactions: [] }),
  ),
}));

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const { DashboardServerWrapper } =
  await import("@/components/dashboard/dashboard-server-wrapper");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const { auth } = await import("@/lib/auth");

describe("DashboardServerWrapper", () => {
  it("redirects when unauthenticated", async () => {
    (auth as any).mockImplementationOnce(() => Promise.resolve(undefined));
    // next/navigation redirect throws in server environment; we assert that
    // calling the function results in a redirect by expecting the returned
    // promise to not resolve to a JSX element. Since redirect() in Next throws
    // a special redirect response, tests can assert that behavior by catching.

    let threw = false;
    try {
      // Call and await; in the test environment redirect may throw, so
      // we guard against unhandled promise rejections.

      const res = await DashboardServerWrapper();
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it("returns the client wrapper when authenticated", async () => {
    (auth as any).mockImplementationOnce(() =>
      Promise.resolve({ user: { id: "user-1", name: "Test User" } }),
    );

    const res = await DashboardServerWrapper();
    // Should return a React element
    expect(res).toBeTruthy();
  });
});
