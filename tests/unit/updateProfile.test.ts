import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/dal", () => ({
  userDal: {
    findByEmail: vi.fn(),
    update: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe("updateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const { updateProfile } = await import("@/lib/actions/updateProfile");
    const result = await updateProfile({ userId: 1, name: "New Name" });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Not authenticated");
  });

  it("should update profile when authenticated", async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      expires: new Date().toISOString(),
      user: {
        id: "1",
        email: "test@example.com",
        isAdmin: false,
        isActive: true,
      },
    });
    vi.mocked(userDal.findByEmail).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      name: "Old Name",
      image: null,
      isAdmin: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.mocked(userDal.update).mockResolvedValueOnce({
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      name: "New Name",
      image: null,
      isAdmin: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { updateProfile } = await import("@/lib/actions/updateProfile");
    const result = await updateProfile({
      userId: 1,
      name: "New Name",
    });

    expect(result.ok).toBe(true);
  });
});
