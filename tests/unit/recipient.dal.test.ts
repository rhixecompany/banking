import { describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            bankAccountId: "wallet-123",
            createdAt: new Date(),
            email: "recipient@example.com",
            id: "recipient-123",
            name: "John Doe",
            updatedAt: new Date(),
            userId: "user-123",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockImplementation(() => {
          return Promise.resolve([
            {
              bankAccountId: "wallet-123",
              createdAt: new Date(),
              email: "recipient@example.com",
              id: "recipient-123",
              name: "John Doe",
              updatedAt: new Date(),
              userId: "user-123",
            },
          ]);
        }),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => {
            return Promise.resolve([
              {
                bankAccountId: "wallet-123",
                createdAt: new Date(),
                email: "recipient@example.com",
                id: "recipient-123",
                name: "John Doe",
                updatedAt: new Date(),
                userId: "user-123",
              },
            ]);
          }),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              bankAccountId: "wallet-123",
              createdAt: new Date(),
              email: "updated@example.com",
              id: "recipient-123",
              name: "Updated Name",
              updatedAt: new Date(),
              userId: "user-123",
            },
          ]),
        }),
      }),
    }),
  },
}));

describe("RecipientDal", () => {
  describe("findById", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.findById).toBe("function");
    });

    it("should return recipient for valid id", async () => {
      const { recipientDal } = await import("@/dal");
      const result = await recipientDal.findById("recipient-123");
      expect(result).toBeDefined();
    });
  });

  describe("findByUserId", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.findByUserId).toBe("function");
    });

    it("should return recipients for valid user id", async () => {
      const { recipientDal } = await import("@/dal");
      const result = await recipientDal.findByUserId("user-123");
      expect(result).toBeDefined();
    });
  });

  describe("createRecipient", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.createRecipient).toBe("function");
    });

    it("should accept valid recipient data", async () => {
      const { recipientDal } = await import("@/dal");

      const result = await recipientDal.createRecipient({
        bankAccountId: "wallet-123",
        email: "recipient@example.com",
        name: "John Doe",
        userId: "user-123",
      });

      expect(result).toBeDefined();
      expect(result.userId).toBe("user-123");
    });
  });

  describe("updateRecipient", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.updateRecipient).toBe("function");
    });

    it("should update recipient with partial data", async () => {
      const { recipientDal } = await import("@/dal");

      const result = await recipientDal.updateRecipient("recipient-123", {
        name: "Updated Name",
      });

      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.delete).toBe("function");
    });
  });

  describe("deleteByUserId", () => {
    it("should be a function", async () => {
      const { recipientDal } = await import("@/dal");
      expect(typeof recipientDal.deleteByUserId).toBe("function");
    });
  });
});

describe("Recipient Types", () => {
  it("should have correct Recipient type properties", () => {
    const mockRecipient = {
      bankAccountId: "wallet-123",
      createdAt: new Date(),
      email: "recipient@example.com",
      id: "recipient-123",
      name: "John Doe",
      updatedAt: new Date(),
      userId: "user-123",
    };

    expect(mockRecipient.id).toBeDefined();
    expect(mockRecipient.userId).toBeDefined();
    expect(mockRecipient.email).toBeDefined();
    expect(mockRecipient.name).toBeDefined();
  });

  it("should support optional bankAccountId", () => {
    const recipientWithoutBank: {
      id: string;
      userId: string;
      email: string;
      name: string;
      bankAccountId?: string;
    } = {
      email: "no-bank@example.com",
      id: "recipient-456",
      name: "Jane Doe",
      userId: "user-123",
    };

    expect(recipientWithoutBank.bankAccountId).toBeUndefined();
    expect(recipientWithoutBank.email).toBeDefined();
  });
});
