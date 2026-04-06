import { describe, expect, it } from "vitest";

import { registerUser } from "@/actions/register";

describe("registerUser", () => {
  describe("function exists", () => {
    it("should be a function", () => {
      expect(typeof registerUser).toBe("function");
    });
  });

  describe("validation", () => {
    it("should return error for invalid email", async () => {
      const result = await registerUser({
        email: "invalid-email",
        firstName: "Test",
        lastName: "User",
        password: "password123",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("email");
    });

    it("should return error for short password", async () => {
      const result = await registerUser({
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "short",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("8 characters");
    });

    it("should return error for short name", async () => {
      const result = await registerUser({
        email: "test@example.com",
        firstName: "T",
        lastName: "User",
        password: "password123",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("2 characters");
    });
  });
});
