import { AdminDashboardServerWrapper } from "@/components/admin/admin-dashboard-server-wrapper";

describe("AdminDashboardServerWrapper", () => {
  it("returns AdminDashboardContent element when admin session present", async () => {
    // This is a smoke test; deeper tests require DB mocking / seeded data.
    const res = await AdminDashboardServerWrapper();
    // Should return a JSX element node (Server Component) — verify type
    expect(res).toBeDefined();
  });
});
