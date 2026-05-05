import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "recipient-1",
            name: "John",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "recipient-1" }]),
        }),
      }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  recipients: {
    email: "email",
    id: "id",
    name: "name",
    userId: "userId",
  },
}));

import { recipientDal } from "@/dal/recipient.dal";
import { db } from "@/database/db";

describe("RecipientDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("finds recipient by id", async () => {
      const mockRecipient = { id: "recipient-1", name: "John" };
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockRecipient]),
          }),
        }),
      } as never);

      const result = await recipientDal.findById("recipient-1");
      expect(result).toBeDefined();
    });
  });

  describe("findByUserId", () => {
    it("finds recipients by user id", async () => {
      const mockRecipients = [
        { id: "recipient-1", userId: "user-1" },
        { id: "recipient-2", userId: "user-1" },
      ];
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockRecipients),
        }),
      } as never);

      const result = await recipientDal.findByUserId("user-1");
      expect(result).toHaveLength(2);
    });
  });

  describe("createRecipient", () => {
    it("creates recipient", async () => {
      const result = await recipientDal.createRecipient({
        email: "john@test.com",
        name: "John",
        userId: "user-1",
      });
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("updateRecipient", () => {
    it("updates recipient", async () => {
      const result = await recipientDal.updateRecipient("recipient-1", {
        name: "Jane",
      });
      expect(result).toBeDefined();
      expect(db.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deletes recipient", async () => {
      await recipientDal.delete("recipient-1");
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("deleteByUserId", () => {
    it("deletes all user recipients", async () => {
      await recipientDal.deleteByUserId("user-1");
      expect(db.delete).toHaveBeenCalled();
    });
  });
});
