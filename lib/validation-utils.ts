/**
 * Validation Utilities
 *
 * Shared utility functions for schema validation and request processing.
 * Provides deterministic key generation and validation helpers for financial transactions.
 *
 * @module lib/validation-utils
 */

import { createHash } from "crypto";

/**
 * Generates a deterministic idempotency key from transfer request parameters.
 *
 * Used to prevent duplicate Dwolla transfers on retries. The key is generated
 * from a SHA256 hash of the combined sender URL, receiver URL, and amount.
 * This ensures that identical transfer requests always produce the same key,
 * while different requests produce different keys.
 *
 * **Example Usage:**
 * ```typescript
 * const key = generateIdempotencyKey(
 *   "https://api.dwolla.com/funding-sources/sender-id",
 *   "https://api.dwolla.com/funding-sources/receiver-id",
 *   "25.00"
 * );
 * // Returns: "abc123def456..." (always same for same inputs)
 * ```
 *
 * @param senderUrl - Source funding source URL (Dwolla API URL)
 * @param receiverUrl - Destination funding source URL (Dwolla API URL)
 * @param amount - Transfer amount as decimal string with 2 decimals (e.g., "25.00")
 * @returns SHA256 hash of combined parameters as hex string (64 characters)
 *
 * @throws Never throws; returns computed hash for any string inputs
 *
 * @financial-safety
 * This function is critical for financial safety. It ensures that:
 * 1. Retries with the same parameters get the same idempotency key
 * 2. Different transfers get different keys (even if amounts are similar)
 * 3. Database unique constraint on idempotency_key prevents duplicates
 * 4. Dwolla API will return existing transfer if key is replayed
 *
 * @see idempotency-key-pattern.md for full pattern documentation
 */
export function generateIdempotencyKey(
  senderUrl: string,
  receiverUrl: string,
  amount: string,
): string {
  // Combine all request parameters with delimiter
  // Using pipes (|) to avoid ambiguity (e.g., "A|BC" vs "AB|C")
  const combined = `${senderUrl}|${receiverUrl}|${amount}`;

  // Generate SHA256 hash
  // SHA256 produces consistent output for same input (deterministic)
  // Output is 256 bits = 64 hex characters
  return createHash("sha256").update(combined).digest("hex");
}
