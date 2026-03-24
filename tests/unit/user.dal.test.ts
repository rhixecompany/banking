import { userDal } from "@/lib/dal";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue([]),
  }),
});

const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockReturnValue({
    returning: vi
      .fn()
      .mockResolvedValue([{ id: 1, email: "test@example.com" }]),
  }),
});

const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: 1 }]),
    }),
  }),
});

const mockDelete = vi.fn().mockReturnValue({
  where: vi.fn().mockResolvedValue(undefined),
});

vi.mock("@/database/db", () => ({
  db: {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

describe("UserDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return user when found", async () => {
      const mockUser = { id: 1, email: "test@example.com", name: "Test User" };
      vi.mocked(mockSelect().from().where).mockResolvedValueOnce([mockUser]);

      const result = await userDal.findByEmail("test@example.com");
      expect(result).toEqual(mockUser);
    });

    it("should return undefined when user not found", async () => {
      vi.mocked(mockSelect().from().where).mockResolvedValueOnce([]);

      const result = await userDal.findByEmail("notfound@example.com");
      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const result = await userDal.create({
        email: "new@example.com",
        password: "hashed",
        name: "New User",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });
  });
});
