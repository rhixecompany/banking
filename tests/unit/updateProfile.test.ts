import { describe, expect, it } from "vitest";

import { updateProfile } from "@/lib/actions/updateProfile";

describe("updateProfile", () => {
  describe("function exists", () => {
    it("should be a function", () => {
      expect(typeof updateProfile).toBe("function");
    });
  });
});
