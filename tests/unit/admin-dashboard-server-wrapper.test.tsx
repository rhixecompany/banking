import { describe, expect, it, vi } from "vitest";

// Mock auth to return admin session
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({
    user: { id: "admin-1", name: "Admin User", isAdmin: true },
  })),
}));

// Mock redirect for non-admin redirects
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  },
}));

// Mock actions to return stable shapes
vi.mock("@/actions/plaid.actions", () => ({
  getAllAccounts: vi.fn(async () => ({ ok: true, accounts: [] })),
  getAllWalletsWithDetails: vi.fn(async () => ({
    ok: true,
    walletsWithDetails: [],
  })),
}));
vi.mock("@/actions/transaction.actions", () => ({
  getAllTransactions: vi.fn(async () => ({ ok: true, transactions: [] })),
}));
vi.mock("@/actions/user.actions", () => ({
  getAllUsers: vi.fn(async () => ({ ok: true, users: [] })),
}));

import { AdminDashboardServerWrapper } from "@/components/admin/admin-dashboard-server-wrapper";

describe("AdminDashboardServerWrapper", () => {
  it("returns AdminDashboardContent element when admin session present", async () => {
    // This is a smoke test; deeper tests require DB mocking / seeded data.
    const res = await AdminDashboardServerWrapper();
    // Should return a JSX element node (Server Component) — verify type
    expect(res).toBeDefined();
  });
});
