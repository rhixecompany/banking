import { registerUser } from "@/lib/actions/register";
import { describe, expect, it } from "vitest";

describe("registerUser", () => {
  describe("function exists", () => {
    it("should be a function", () => {
      expect(typeof registerUser).toBe("function");
    });
  });

  describe("validation", () => {
    it("should return error for invalid email", async () => {
      const result = await registerUser({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("email");
    });

    it("should return error for short password", async () => {
      const result = await registerUser({
        name: "Test User",
        email: "test@example.com",
        password: "short",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("8 characters");
    });

    it("should return error for short name", async () => {
      const result = await registerUser({
        name: "T",
        email: "test@example.com",
        password: "password123",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toContain("2 characters");
    });
  });
});
