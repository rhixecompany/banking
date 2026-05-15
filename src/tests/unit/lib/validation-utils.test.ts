/**
 * Unit Tests: validation-utils
 *
 * Tests for deterministic idempotency key generation.
 * Verifies:
 * - Deterministic behavior (same inputs → same output)
 * - Different inputs → different outputs
 * - Consistent hash length (SHA256 = 64 hex chars)
 * - Financial safety constraints
 *
 * @see lib/validation-utils.ts
 * @see idempotency-key-pattern.md
 */

import { describe, expect, it } from "vitest";

import { generateIdempotencyKey } from "@/lib/validation-utils";

describe("generateIdempotencyKey", () => {
  const senderUrl = "https://api.dwolla.com/funding-sources/sender-123";
  const receiverUrl = "https://api.dwolla.com/funding-sources/receiver-456";
  const amount = "25.00";

  describe("Determinism (Critical for Idempotency)", () => {
    it("should generate the same key for identical inputs (deterministic)", () => {
      const key1 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const key2 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      expect(key1).toBe(key2);
    });

    it("should generate the same key when called 100 times with identical inputs", () => {
      const firstKey = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      for (let i = 0; i < 100; i++) {
        const key = generateIdempotencyKey(senderUrl, receiverUrl, amount);
        expect(key).toBe(firstKey);
      }
    });
  });

  describe("Differentiation (Prevent Collisions)", () => {
    it("should generate different keys for different sender URLs", () => {
      const key1 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const key2 = generateIdempotencyKey(
        "https://api.dwolla.com/funding-sources/sender-999",
        receiverUrl,
        amount,
      );
      expect(key1).not.toBe(key2);
    });

    it("should generate different keys for different receiver URLs", () => {
      const key1 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const key2 = generateIdempotencyKey(
        senderUrl,
        "https://api.dwolla.com/funding-sources/receiver-999",
        amount,
      );
      expect(key1).not.toBe(key2);
    });

    it("should generate different keys for different amounts", () => {
      const key1 = generateIdempotencyKey(senderUrl, receiverUrl, "25.00");
      const key2 = generateIdempotencyKey(senderUrl, receiverUrl, "26.00");
      expect(key1).not.toBe(key2);
    });

    it("should generate different keys for swapped sender/receiver", () => {
      const key1 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const key2 = generateIdempotencyKey(receiverUrl, senderUrl, amount);
      expect(key1).not.toBe(key2);
    });
  });

  describe("Hash Properties (SHA256)", () => {
    it("should always return a 64-character hex string (SHA256 output)", () => {
      const key = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should return lowercase hex characters", () => {
      const key = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      expect(key).toBe(key.toLowerCase());
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long URLs", () => {
      const longUrl =
        "https://api.dwolla.com/funding-sources/" + "a".repeat(1000);
      const key = generateIdempotencyKey(longUrl, receiverUrl, amount);
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should handle special characters in URLs", () => {
      const urlWithSpecialChars =
        "https://api.dwolla.com/funding-sources/test%20id&param=value";
      const key = generateIdempotencyKey(
        urlWithSpecialChars,
        receiverUrl,
        amount,
      );
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should handle very small amounts", () => {
      const key = generateIdempotencyKey(senderUrl, receiverUrl, "0.01");
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should handle very large amounts", () => {
      const key = generateIdempotencyKey(
        senderUrl,
        receiverUrl,
        "999999999.99",
      );
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("Financial Safety Guarantees", () => {
    it("should ensure retries of identical transfers use the same key (duplicate prevention)", () => {
      // Simulating a retry scenario
      const attempt1 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const attempt2 = generateIdempotencyKey(senderUrl, receiverUrl, amount);
      const attempt3 = generateIdempotencyKey(senderUrl, receiverUrl, amount);

      expect(attempt1).toBe(attempt2);
      expect(attempt2).toBe(attempt3);
    });

    it("should prevent accidental collisions with pipe delimiters", () => {
      // Pipe delimiter ensures distinct keys for inputs with different delimiters
      // Test case: make sure the delimiter itself prevents collisions
      const key1 = generateIdempotencyKey(
        "https://api.dwolla.com/funding-sources/sender",
        "https://api.dwolla.com/funding-sources/receiver",
        amount,
      );

      // Same combined content but different parameter split
      const key2 = generateIdempotencyKey(
        "https://api.dwolla.com/funding-sources/",
        "senderhttps://api.dwolla.com/funding-sources/receiver",
        amount,
      );

      // Keys must be different because parameters differ
      expect(key1).not.toBe(key2);
    });
  });

  describe("Real-World Scenarios", () => {
    it("should handle typical Dwolla funding source URLs", () => {
      const dwolaUrl1 =
        "https://api.dwolla.com/funding-sources/4de30d41-524f-47d5-b44d-9db7d10e7f9a";
      const dwolaUrl2 =
        "https://api.dwolla.com/funding-sources/5de30d41-524f-47d5-b44d-9db7d10e7f9b";
      const transferAmount = "150.50";

      const key1 = generateIdempotencyKey(dwolaUrl1, dwolaUrl2, transferAmount);
      const key2 = generateIdempotencyKey(dwolaUrl1, dwolaUrl2, transferAmount);
      const key3 = generateIdempotencyKey(dwolaUrl2, dwolaUrl1, transferAmount);

      expect(key1).toBe(key2);
      expect(key1).not.toBe(key3);
    });

    it("should generate valid idempotency keys for ACH transfers", () => {
      const senderAch = "https://api.dwolla.com/funding-sources/sender-ach-id";
      const receiverAch =
        "https://api.dwolla.com/funding-sources/receiver-ach-id";
      const amounts = ["100.00", "500.00", "1000.00"];

      const keys = amounts.map((amt) =>
        generateIdempotencyKey(senderAch, receiverAch, amt),
      );

      // All keys should be unique
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(amounts.length);

      // All keys should be valid SHA256 hashes
      keys.forEach((key) => {
        expect(key).toMatch(/^[a-f0-9]{64}$/);
      });
    });
  });
});
