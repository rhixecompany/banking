import { describe, expect, it } from "vitest";

import { errorsDal } from "@/dal/errors.dal";

// Note: This test runs against the real DB referenced by DATABASE_URL in .env.local.
// Ensure you have applied migrations locally (npm run db:push) before running.
describe("ErrorsDal (integration)", () => {
  it("inserts an error row into the database", async () => {
    const row = await errorsDal.insertError({
      message: "integration test error",
      path: "/integration",
      userId: "integration-user",
    });

    expect(row).toHaveProperty("id");
    expect(row).toHaveProperty("createdAt");
    expect(row.message).toBeDefined();
  });
});
