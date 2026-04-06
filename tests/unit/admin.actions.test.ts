import { describe, expect, it } from "vitest";

import { setActive, toggleAdmin } from "@/actions/admin.actions";

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
