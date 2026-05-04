import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the database
vi.mock("@/database/db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
  },
}));

vi.mock("@/database/schema", () => ({
  users: {
    id: "id",
    email: "email",
    name: "name",
    password: "password",
    image: "image",
    isAdmin: "isAdmin",
    isActive: "isActive",
    role: "role",
    emailVerified: "emailVerified",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    deletedAt: "deletedAt",
  },
  user_profiles: {
    id: "id",
    userId: "userId",
    address: "address",
    city: "city",
    dateOfBirth: "dateOfBirth",
    phone: "phone",
    postalCode: "postalCode",
    ssnEncrypted: "ssnEncrypted",
    state: "state",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
}));

import { userDal } from "@/dal/user.dal";
import { db } from "@/database/db";

// Helper to create mock chainable query object
const createMockQueryChain = (result: any = null) => {
  const resolveValue = result ? [result] : [];

  // Create an object that is both awaitable and has chainable methods
  const createAwaitableChainObject = (value: any[]) => {
    const promise = Promise.resolve(value);
    const chainObj: any = {
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      finally: promise.finally.bind(promise),
      limit: vi.fn().mockResolvedValue(value),
      orderBy: vi.fn().mockResolvedValue(value),
      returning: vi.fn().mockResolvedValue(value),
    };
    return chainObj;
  };

  return {
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue(createAwaitableChainObject(resolveValue)),
      leftJoin: vi.fn().mockReturnValue({
        where: vi
          .fn()
          .mockReturnValue(createAwaitableChainObject(resolveValue)),
      }),
      limit: vi.fn().mockResolvedValue(resolveValue),
      orderBy: vi.fn().mockResolvedValue(resolveValue),
      returning: vi.fn().mockResolvedValue(resolveValue),
    }),
  };
};

const createMockInsertChain = (result: any) => {
  return {
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([result]),
    }),
  };
};

const createMockUpdateChain = (result: any) => {
  return {
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([result]),
      }),
    }),
  };
};

const createMockDeleteChain = () => {
  return {
    where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
  };
};

describe("UserDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("returns user when found and not soft-deleted", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        password: "hash",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(mockUser),
      );

      const result = await userDal.findById("user-1");

      expect(result).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
    });

    it("returns undefined when user not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(null),
      );

      const result = await userDal.findById("nonexistent");

      expect(result).toBeUndefined();
    });

    it("returns undefined when user is soft-deleted", async () => {
      const deletedUser = {
        id: "user-1",
        email: "test@test.com",
        deletedAt: new Date("2026-01-01"),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(deletedUser),
      );

      const result = await userDal.findById("user-1");

      expect(result).toBeUndefined();
    });
  });

  describe("findByEmail", () => {
    it("returns user when found by email", async () => {
      const mockUser = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        password: "hash",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(mockUser),
      );

      const result = await userDal.findByEmail("test@test.com");

      expect(result).toEqual(mockUser);
      expect(db.select).toHaveBeenCalled();
    });

    it("returns undefined when email not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(null),
      );

      const result = await userDal.findByEmail("nonexistent@test.com");

      expect(result).toBeUndefined();
    });

    it("returns undefined when user with email is soft-deleted", async () => {
      const deletedUser = {
        id: "user-1",
        email: "test@test.com",
        deletedAt: new Date("2026-01-01"),
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(deletedUser),
      );

      const result = await userDal.findByEmail("test@test.com");

      expect(result).toBeUndefined();
    });
  });

  describe("findByIdWithProfile", () => {
    it("returns user with profile when both exist", async () => {
      const mockResult = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        password: "hash",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          id: "profile-1",
          userId: "user-1",
          address: "123 Main St",
          city: "Springfield",
          dateOfBirth: new Date("1990-01-01"),
          phone: "555-1234",
          postalCode: "12345",
          ssnEncrypted: "encrypted-ssn",
          state: "IL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockResult]),
            }),
          }),
        }),
      });

      const result = await userDal.findByIdWithProfile("user-1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("user-1");
      expect(result?.profile).toBeDefined();
      expect(result?.profile?.address).toBe("123 Main St");
    });

    it("returns user with undefined profile when profile doesn't exist", async () => {
      const mockResult = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        password: "hash",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: null,
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockResult]),
            }),
          }),
        }),
      });

      const result = await userDal.findByIdWithProfile("user-1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("user-1");
      expect(result?.profile).toBeUndefined();
    });

    it("returns undefined when user not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      });

      const result = await userDal.findByIdWithProfile("nonexistent");

      expect(result).toBeUndefined();
    });

    it("returns undefined when user is soft-deleted", async () => {
      const mockResult = {
        id: "user-1",
        email: "test@test.com",
        deletedAt: new Date("2026-01-01"),
        profile: null,
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockResult]),
            }),
          }),
        }),
      });

      const result = await userDal.findByIdWithProfile("user-1");

      expect(result).toBeUndefined();
    });
  });

  describe("create", () => {
    it("creates user with required fields", async () => {
      const newUser = {
        id: "user-new",
        email: "new@test.com",
        password: "hash",
        name: "New User",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockInsertChain(newUser),
      );

      const result = await userDal.create({
        email: "new@test.com",
        password: "hash",
        name: "New User",
      });

      expect(result).toEqual(newUser);
      expect(db.insert).toHaveBeenCalled();
    });

    it("creates user without optional name field", async () => {
      const newUser = {
        id: "user-new",
        email: "new@test.com",
        password: "hash",
        name: null, // Changed from "New User" to null since test expects null
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user" as const, // Added 'as const' for type assertion
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockInsertChain(newUser),
      );

      const result = await userDal.create({
        email: "new@test.com",
        password: "hash",
      });

      expect(result).toEqual(newUser);
      expect(result.name).toBeNull();
    });
  });

  describe("update", () => {
    it("updates user with partial data", async () => {
      const updatedUser = {
        id: "user-1",
        email: "updated@test.com",
        name: "Updated Name",
        password: "hash",
        deletedAt: null,
        isAdmin: true,
        isActive: true,
        image: null,
        role: "admin",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(updatedUser),
      );

      const result = await userDal.update("user-1", {
        email: "updated@test.com",
        name: "Updated Name",
        isAdmin: true,
      });

      expect(result).toEqual(updatedUser);
      expect(db.update).toHaveBeenCalled();
    });

    it("updates user with single field", async () => {
      const updatedUser = {
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
        password: "new-hash",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(updatedUser),
      );

      const result = await userDal.update("user-1", { password: "new-hash" });

      expect(result).toEqual(updatedUser);
    });
  });

  describe("createWithProfile", () => {
    it("creates user and profile in transaction", async () => {
      const newUser = {
        id: "user-new",
        email: "new@test.com",
        password: "hash",
        name: "New User",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userWithProfile = {
        ...newUser,
        profile: {
          id: "profile-1",
          userId: "user-new",
          address: "123 Main St",
          city: "Springfield",
          dateOfBirth: "1990-01-01", // Changed from Date to string
          phone: "555-1234",
          postalCode: "12345",
          ssnEncrypted: "encrypted-ssn",
          state: "IL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      // Mock transaction
      (db.transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const tx = {
            insert: vi.fn().mockReturnValue({
              values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([newUser]),
              }),
            }),
          };
          await callback(tx);
        },
      );

      // Mock findByIdWithProfile call inside createWithProfile
      vi.spyOn(userDal, "findByIdWithProfile").mockResolvedValue(
        userWithProfile as any,
      );

      const result = await userDal.createWithProfile({
        email: "new@test.com",
        password: "hash",
        name: "New User",
        profile: {
          address: "123 Main St",
          city: "Springfield",
          phone: "555-1234",
        },
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("user-new");
      expect(result?.profile).toBeDefined();
    });

    it("creates user without profile in transaction", async () => {
      const newUser = {
        id: "user-new",
        email: "new@test.com",
        password: "hash",
        name: "New User",
        deletedAt: null,
        isAdmin: false,
        isActive: true,
        image: null,
        role: "user",
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const tx = {
            insert: vi.fn().mockReturnValue({
              values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([newUser]),
              }),
            }),
          };
          await callback(tx);
        },
      );

      vi.spyOn(userDal, "findByIdWithProfile").mockResolvedValue({
        ...newUser,
        profile: undefined,
      } as any);

      const result = await userDal.createWithProfile({
        email: "new@test.com",
        password: "hash",
        name: "New User",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("user-new");
    });

    it("returns undefined on transaction failure", async () => {
      (db.transaction as ReturnType<typeof vi.fn>).mockImplementation(
        async (callback) => {
          const tx = {
            insert: vi.fn().mockReturnValue({
              values: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([]),
              }),
            }),
          };
          await callback(tx);
        },
      );

      const result = await userDal.createWithProfile({
        email: "new@test.com",
        password: "hash",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("updateProfile", () => {
    it("updates existing profile", async () => {
      const existingProfile = {
        id: "profile-1",
        userId: "user-1",
        address: "123 Main St",
      };

      const updatedProfile = {
        id: "profile-1",
        userId: "user-1",
        address: "456 Oak Ave",
      };

      // Mock findProfileByUserId
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(existingProfile),
      );

      // Mock update call
      (db.update as ReturnType<typeof vi.fn>).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedProfile]),
          }),
        }),
      });

      const result = await userDal.updateProfile("user-1", {
        address: "456 Oak Ave",
      });

      expect(result).toEqual([updatedProfile]);
    });

    it("creates new profile when none exists", async () => {
      const newProfile = {
        id: "profile-1",
        userId: "user-1",
        address: "123 Main St",
      };

      // Mock no existing profile
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(null),
      );

      // Mock insert
      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([newProfile]),
        }),
      });

      const result = await userDal.updateProfile("user-1", {
        address: "123 Main St",
      });

      expect(result).toEqual([newProfile]);
    });
  });

  describe("toggleAdmin", () => {
    it("toggles isAdmin from false to true", async () => {
      const userBefore = {
        id: "user-1",
        isAdmin: false,
      };

      const userAfter = {
        id: "user-1",
        isAdmin: true,
      };

      // First call for reading current state
      (db.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        createMockQueryChain(userBefore),
      );

      // Second call for update
      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(userAfter),
      );

      const result = await userDal.toggleAdmin("user-1");

      expect(result).toEqual([userAfter]);
      expect(result?.[0]?.isAdmin).toBe(true);
    });

    it("toggles isAdmin from true to false", async () => {
      const userBefore = {
        id: "user-1",
        isAdmin: true,
      };

      const userAfter = {
        id: "user-1",
        isAdmin: false,
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        createMockQueryChain(userBefore),
      );

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(userAfter),
      );

      const result = await userDal.toggleAdmin("user-1");

      expect(result).toEqual([userAfter]);
      expect(result?.[0]?.isAdmin).toBe(false);
    });

    it("returns undefined when user not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockQueryChain(null),
      );

      const result = await userDal.toggleAdmin("nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("toggleActive", () => {
    it("toggles isActive from false to true", async () => {
      const userBefore = {
        id: "user-1",
        isActive: false,
      };

      const userAfter = {
        id: "user-1",
        isActive: true,
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        createMockQueryChain(userBefore),
      );

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(userAfter),
      );

      const result = await userDal.toggleActive("user-1");

      expect(result).toEqual([userAfter]);
      expect(result?.[0]?.isActive).toBe(true);
    });

    it("toggles isActive from true to false", async () => {
      const userBefore = {
        id: "user-1",
        isActive: true,
      };

      const userAfter = {
        id: "user-1",
        isActive: false,
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        createMockQueryChain(userBefore),
      );

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockUpdateChain(userAfter),
      );

      const result = await userDal.toggleActive("user-1");

      expect(result).toEqual([userAfter]);
      expect(result?.[0]?.isActive).toBe(false);
    });

    it("returns undefined when user not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        createMockQueryChain(null),
      );

      const result = await userDal.toggleActive("nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("softDelete", () => {
    it("soft deletes user by setting deletedAt", async () => {
      (db.update as ReturnType<typeof vi.fn>).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
        }),
      });

      await userDal.softDelete("user-1");

      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("hardDelete", () => {
    it("hard deletes user permanently", async () => {
      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        createMockDeleteChain(),
      );

      await userDal.hardDelete("user-1");

      expect(db.delete).toHaveBeenCalled();
    });
  });
});
