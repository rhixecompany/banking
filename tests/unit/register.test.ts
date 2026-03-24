import { registerUser } from "@/lib/actions/register";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/dal", () => ({
  userDal: {
    findByEmail: vi.fn(),
    createWithProfile: vi.fn(),
  },
}));

vi.mock("@/lib/email", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(true),
}));

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error for invalid email", async () => {
    const result = await registerUser({
      name: "Test User",
      email: "invalid-email",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("email");
  });

  it("should return error for short password", async () => {
    const result = await registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "short",
      confirmPassword: "short",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("8 characters");
  });

  it("should return error for password mismatch", async () => {
    const result = await registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("match");
  });

  it("should return error for short name", async () => {
    const result = await registerUser({
      name: "T",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain("2 characters");
  });
});
