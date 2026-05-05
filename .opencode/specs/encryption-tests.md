# Spec: encryption-tests

Scope: repo

# Coverage: encryption.ts

## Current State

- encryption.ts at 18.75% Statements, 18.75% Lines
- Test file exists (tests/unit/lib/encryption.test.ts - 19 lines)
- Only generateEncryptionKey() is tested (length + uniqueness)

## Target Coverage: 60%+

## Functions to Cover

1. encrypt(text: string) - AES-256-GCM encryption, returns "iv:authTag:ciphertext"
2. decrypt(encryptedText: string) - parse 3-part format, verify auth tag, return plaintext
3. encryptSSN(ssn: string) - wrapper over encrypt()
4. decryptSSN(encryptedSSN: string) - wrapper over decrypt()
5. generateEncryptionKey() - already tested, but keep for completeness

## Error Paths to Cover

1. decrypt() with invalid format (not 3-part)
2. decrypt() with tampered ciphertext (auth tag fails)
3. decrypt() with invalid Base64
4. Missing ENCRYPTION_KEY in environment

## Test Pattern

- Use generateEncryptionKey() at test runtime to create a real key (not mocked)
- Test encrypt/decrypt round-trip with known test vectors
- Test SSN wrappers (should pass through to encrypt/decrypt)
- Test error cases: bad format, bad auth tag, missing key
- Verify output format: "iv:authTag:ciphertext" (all Base64)

## Implementation Notes

- Do NOT mock ENCRYPTION_KEY; instead call generateEncryptionKey() in test setup
- Test with real crypto module (no mocking)
- Constants: IV_LENGTH=12, AUTH_TAG_LENGTH=16, SALT_LENGTH=16
- Fixed salt: "banking-salt"
