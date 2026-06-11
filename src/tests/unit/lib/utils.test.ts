import { describe, expect, it } from "vitest";

import { cn, formatAmount, formatDate, getAuthFormSchema } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const condition = false;
      const result = cn("foo", condition && "bar", "baz");
      expect(result).toContain("foo");
    });
  });

  describe("getAuthFormSchema", () => {
    it("returns signIn schema", () => {
      const schema = getAuthFormSchema("sign-in");
      expect(schema).toBeDefined();
    });

    it("returns signUp schema", () => {
      const schema = getAuthFormSchema("sign-up");
      expect(schema).toBeDefined();
    });
  });

  describe("formatAmount", () => {
    it("formats USD amount", () => {
      const result = formatAmount(1234.56);
      expect(result).toContain("1,234.56");
    });

    it("formats with custom currency", () => {
      const result = formatAmount(100, "EUR");
      expect(result).toContain("100");
    });
  });

  describe("formatDate", () => {
    it("formats Date object", () => {
      const result = formatDate(new Date("2024-01-15"));
      expect(result).toContain("2024");
    });

    it("formats date string", () => {
      const result = formatDate("2024-06-20");
      expect(result).toContain("2024");
    });
  });
});
