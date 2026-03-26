import { updateProfile } from "@/lib/actions/updateProfile";
import { describe, expect, it } from "vitest";

describe("updateProfile", () => {
  describe("function exists", () => {
    it("should be a function", () => {
      expect(typeof updateProfile).toBe("function");
    });
  });
});
