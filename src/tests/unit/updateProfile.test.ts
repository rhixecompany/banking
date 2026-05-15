import { describe, expect, it } from "vitest";

import { updateProfile } from "@/actions/user.update-profile";

describe("updateProfile", () => {
  describe("function exists", () => {
    it("should be a function", () => {
      expect(typeof updateProfile).toBe("function");
    });
  });
});
