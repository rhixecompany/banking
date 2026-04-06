import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

import { env } from "@/lib/env";

/**
 * AES-256-GCM algorithm identifier.
 * AES provides symmetric encryption; 256-bit key length meets banking security requirements.
 * GCM mode provides authenticated encryption (confidentiality + integrity).
 * @type {"aes-256-gcm"}
 */
const ALGORITHM = "aes-256-gcm";

/**
 * Initialization vector length in bytes for GCM mode.
 * 12 bytes (96 bits) is the recommended IV length for GCM.
 * @type {12}
 */
const IV_LENGTH = 12;

/**
 * Authentication tag length in bytes.
 * 16 bytes (128 bits) is the standard for GCM authentication tags.
 * @type {16}
 */
const AUTH_TAG_LENGTH = 16;

/**
 * Salt length in bytes for key derivation.
 * 16 bytes provides sufficient entropy for scrypt key stretching.
 * @type {16}
 */
const SALT_LENGTH = 16;

/**
 * Derives a 32-byte encryption key from the ENCRYPTION_KEY environment variable
 * using scrypt with a fixed application salt.
 *
 * @returns {Buffer} 32-byte derived key for AES-256.
 * @throws {Error} If ENCRYPTION_KEY is not configured.
 */
function getEncryptionKey(): Buffer {
  const key = env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not configured");
  }
  const salt = Buffer.alloc(SALT_LENGTH, "banking-salt");
  return scryptSync(key, salt, 32);
}

/**
 * Encrypts plaintext using AES-256-GCM.
 * Produces a colon-separated string: iv:authTag:ciphertext (all Base64-encoded).
 *
 * @export
 * @param {string} text - Plaintext string to encrypt.
 * @returns {string} Encrypted string in format "iv:authTag:ciphertext".
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts a ciphertext produced by the encrypt() function.
 * Validates the format and verifies the authentication tag to detect tampering.
 *
 * @export
 * @param {string} encryptedText - Encrypted string in format "iv:authTag:ciphertext".
 * @returns {string} Decrypted plaintext string.
 * @throws {Error} If the encrypted text format is invalid or authentication fails.
 */
export function decrypt(encryptedText: string): string {
  const key = getEncryptionKey();

  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(parts[0], "base64");
  const authTag = Buffer.from(parts[1], "base64");
  const encrypted = parts[2];

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Generates a cryptographically secure random 32-byte key encoded as hex.
 * Use this to generate a new ENCRYPTION_KEY value.
 *
 * @export
 * @returns {string} 64-character hex string representing a 32-byte random key.
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Encrypts a Social Security Number using AES-256-GCM.
 * Convenience wrapper around encrypt() for SSN-specific use cases.
 *
 * @export
 * @param {string} ssn - Social Security Number (9 digits, format XXX-XX-XXXX or XXXXXXXXX).
 * @returns {string} Encrypted SSN in format "iv:authTag:ciphertext".
 */
export function encryptSSN(ssn: string): string {
  return encrypt(ssn);
}

/**
 * Decrypts an SSN ciphertext produced by encryptSSN().
 * Convenience wrapper around decrypt() for SSN-specific use cases.
 *
 * @export
 * @param {string} encryptedSSN - Encrypted SSN in format "iv:authTag:ciphertext".
 * @returns {string} Decrypted Social Security Number.
 * @throws {Error} If the format is invalid or authentication fails.
 */
export function decryptSSN(encryptedSSN: string): string {
  return decrypt(encryptedSSN);
}
