import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

import { env } from "@/lib/env";

/**
 * Description placeholder
 *
 * @type {"aes-256-gcm"}
 */
const ALGORITHM = "aes-256-gcm";
/**
 * Description placeholder
 *
 * @type {12}
 */
const IV_LENGTH = 12;
/**
 * Description placeholder
 *
 * @type {16}
 */
const AUTH_TAG_LENGTH = 16;
/**
 * Description placeholder
 *
 * @type {16}
 */
const SALT_LENGTH = 16;

/**
 * Description placeholder
 *
 * @returns {Buffer}
 */
function getEncryptionKey(): Buffer {
  const key = env.ENCRYPTION_KEY;
  const salt = Buffer.alloc(SALT_LENGTH, "banking-salt");
  return scryptSync(key, salt, 32);
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} text
 * @returns {string}
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
 * Description placeholder
 *
 * @export
 * @param {string} encryptedText
 * @returns {string}
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
 * Description placeholder
 *
 * @export
 * @returns {string}
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString("hex");
}
