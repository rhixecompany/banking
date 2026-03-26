import { setActive, toggleAdmin } from "@/lib/actions/admin.actions";
import { describe, expect, it } from "vitest";

describe("admin.actions", () => {
  describe("toggleAdmin", () => {
    it("should be a function", () => {
      expect(typeof toggleAdmin).toBe("function");
    });
  });

  describe("setActive", () => {
    it("should be a function", () => {
      expect(typeof setActive).toBe("function");
    });
  });
});
