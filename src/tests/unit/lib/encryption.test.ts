import { beforeAll, describe, expect, it } from "vitest";

import {
  decrypt,
  decryptSSN,
  encrypt,
  encryptSSN,
  generateEncryptionKey,
} from "@/lib/encryption";

describe("Encryption Module", () => {
  let testKey: string;

  beforeAll(() => {
    // Generate a real encryption key for testing
    testKey = generateEncryptionKey();
  });

  describe("generateEncryptionKey", () => {
    it("generates a 64-character hex string", () => {
      const key = generateEncryptionKey();

      expect(key).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/i.test(key)).toBe(true);
    });

    it("generates unique keys on each call", () => {
      const key1 = generateEncryptionKey();
      const key2 = generateEncryptionKey();

      expect(key1).not.toBe(key2);
    });

    it("generates valid keys (32 random bytes in hex)", () => {
      const key = generateEncryptionKey();

      // 32 bytes = 64 hex characters (2 hex chars per byte)
      expect(key.length).toBe(64);

      // Should be valid hex
      expect(() => {
        Buffer.from(key, "hex");
      }).not.toThrow();
    });
  });

  describe("encrypt", () => {
    it("encrypts a plaintext string", () => {
      const plaintext = "sensitive-data";

      const encrypted = encrypt(plaintext);

      expect(encrypted).not.toBe(plaintext);
      expect(typeof encrypted).toBe("string");
    });

    it("returns 3-part format: iv:authTag:ciphertext", () => {
      const plaintext = "test-string";

      const encrypted = encrypt(plaintext);

      const parts = encrypted.split(":");
      expect(parts).toHaveLength(3);

      // Each part should be valid Base64
      const [iv, authTag, ciphertext] = parts;
      expect(() => Buffer.from(iv, "base64")).not.toThrow();
      expect(() => Buffer.from(authTag, "base64")).not.toThrow();
      expect(() => Buffer.from(ciphertext, "base64")).not.toThrow();
    });

    it("produces different ciphertexts for same plaintext (due to random IV)", () => {
      const plaintext = "same-data";

      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      // IVs should be different due to randomness
      expect(encrypted1).not.toBe(encrypted2);

      // But both should decrypt to the same plaintext
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    it("encrypts empty string", () => {
      const plaintext = "";

      const encrypted = encrypt(plaintext);

      expect(encrypted).toBeTruthy();
      expect(decrypt(encrypted)).toBe("");
    });

    it("encrypts long strings", () => {
      const plaintext = "x".repeat(10000); // 10KB of data

      const encrypted = encrypt(plaintext);

      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("encrypts strings with special characters", () => {
      const plaintext =
        "Special chars: !@#$%^&*()_+-=[]{}|;:',.<>?/`~\nNew line\tTab";

      const encrypted = encrypt(plaintext);

      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("encrypts Unicode characters", () => {
      const plaintext = "Unicode: 你好世界 مرحبا بالعالم 🚀🎉";

      const encrypted = encrypt(plaintext);

      expect(decrypt(encrypted)).toBe(plaintext);
    });
  });

  describe("decrypt", () => {
    it("decrypts encrypted plaintext", () => {
      const plaintext = "secret-data";

      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it("throws error for malformed encrypted data (wrong format)", () => {
      const malformed = "not:the:right:format:with:extra:colons";

      expect(() => {
        decrypt(malformed);
      }).toThrow();
    });

    it("throws error for invalid Base64 in IV", () => {
      const encrypted = "!!!not-base64!!!:validTag:validCiphertext";

      expect(() => {
        decrypt(encrypted);
      }).toThrow();
    });

    it("throws error for invalid Base64 in auth tag", () => {
      const encrypted = "validIV:!!!not-base64!!!:validCiphertext";

      expect(() => {
        decrypt(encrypted);
      }).toThrow();
    });

    it("throws error for invalid Base64 in ciphertext", () => {
      const encrypted = "validIV:validTag:!!!not-base64!!!";

      expect(() => {
        decrypt(encrypted);
      }).toThrow();
    });

    it("throws error when auth tag verification fails (tampered data)", () => {
      const plaintext = "original-data";
      const encrypted = encrypt(plaintext);

      const parts = encrypted.split(":");
      // Tamper with the ciphertext by flipping a bit
      const tamperedCiphertext = parts[2];
      const buffer = Buffer.from(tamperedCiphertext, "base64");
      buffer[0] ^= 0x01; // Flip one bit

      const tampered = `${parts[0]}:${parts[1]}:${buffer.toString("base64")}`;

      expect(() => {
        decrypt(tampered);
      }).toThrow();
    });

    it("throws error when IV is wrong size", () => {
      // IV should be 12 bytes (96 bits), encode as 16 Base64 chars
      const shortIV = Buffer.alloc(4).toString("base64"); // Wrong size
      const validAuthTag = Buffer.alloc(16).toString("base64");
      const validCiphertext = Buffer.alloc(16).toString("base64");

      const encrypted = `${shortIV}:${validAuthTag}:${validCiphertext}`;

      expect(() => {
        decrypt(encrypted);
      }).toThrow();
    });

    it("decrypts round-trip: encrypt -> decrypt", () => {
      const testVectors = [
        "",
        "a",
        "test",
        "The quick brown fox jumps over the lazy dog",
        "Special: !@#$%^&*()_+-=[]{}|;:',.<>?/",
        "Unicode: αβγδ ñ é 中文",
      ];

      testVectors.forEach((plaintext) => {
        const encrypted = encrypt(plaintext);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(plaintext);
      });
    });
  });

  describe("encryptSSN", () => {
    it("encrypts SSN (wrapper over encrypt)", () => {
      const ssn = "123-45-6789";

      const encrypted = encryptSSN(ssn);

      expect(encrypted).not.toBe(ssn);
      expect(typeof encrypted).toBe("string");
    });

    it("uses same encryption as encrypt()", () => {
      const ssn = "123-45-6789";

      const viaEncrypt = encrypt(ssn);
      const viaEncryptSSN = encryptSSN(ssn);

      // Both should decrypt to the same value
      expect(decrypt(viaEncrypt)).toBe(ssn);
      expect(decryptSSN(viaEncryptSSN)).toBe(ssn);
    });

    it("handles SSN variations", () => {
      const ssnVariations = [
        "123-45-6789",
        "123456789",
        "000-00-0000",
        "999-99-9999",
      ];

      ssnVariations.forEach((ssn) => {
        const encrypted = encryptSSN(ssn);
        const decrypted = decryptSSN(encrypted);
        expect(decrypted).toBe(ssn);
      });
    });
  });

  describe("decryptSSN", () => {
    it("decrypts SSN-encrypted data (wrapper over decrypt)", () => {
      const ssn = "987-65-4321";

      const encrypted = encryptSSN(ssn);
      const decrypted = decryptSSN(encrypted);

      expect(decrypted).toBe(ssn);
    });

    it("throws error on invalid encrypted SSN", () => {
      const malformed = "not:a:valid:format";

      expect(() => {
        decryptSSN(malformed);
      }).toThrow();
    });

    it("decrypts data encrypted with encrypt()", () => {
      const ssn = "555-55-5555";

      // Encrypt with generic encrypt(), decrypt with encryptSSN/decryptSSN
      const encrypted = encrypt(ssn);
      const decrypted = decryptSSN(encrypted);

      expect(decrypted).toBe(ssn);
    });
  });

  describe("Encryption edge cases", () => {
    it("handles consecutive encryptions and decryptions", () => {
      const original = "test-data";

      let current = original;
      for (let i = 0; i < 5; i++) {
        current = encrypt(current);
        expect(typeof current).toBe("string");
      }

      // Now decrypt 5 times
      for (let i = 0; i < 5; i++) {
        current = decrypt(current);
      }

      expect(current).toBe(original);
    });

    it("encrypts and decrypts consistently with same key", () => {
      const plaintext = "consistent-encryption";

      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);

      // Encrypted values differ (random IV)
      expect(encrypted1).not.toBe(encrypted2);

      // But both decrypt correctly
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });

    it("maintains data integrity across encrypt/decrypt", () => {
      const testData = {
        email: "john@example.com",
        name: "John Doe",
        ssn: "123-45-6789",
      };

      const jsonString = JSON.stringify(testData);
      const encrypted = encrypt(jsonString);
      const decrypted = decrypt(encrypted);
      const result = JSON.parse(decrypted);

      expect(result).toEqual(testData);
    });
  });

  describe("Performance and stress tests", () => {
    it("encrypts and decrypts quickly", () => {
      const plaintext = "benchmark-test-data";

      const startEnc = performance.now();
      const encrypted = encrypt(plaintext);
      const encTime = performance.now() - startEnc;

      const startDec = performance.now();
      const decrypted = decrypt(encrypted);
      const decTime = performance.now() - startDec;

      expect(decrypted).toBe(plaintext);

      // Should complete in reasonable time (< 250ms each on test hardware)
      expect(encTime).toBeLessThan(250);
      expect(decTime).toBeLessThan(250);
    });

    it("handles bulk encryption/decryption", () => {
      const items = Array.from({ length: 100 }, (_, i) => `data-${i}`);

      const encrypted = items.map((item) => encrypt(item));
      const decrypted = encrypted.map((enc) => decrypt(enc));

      expect(decrypted).toEqual(items);
    });
  });
});
