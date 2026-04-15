# Section 19 — Secrets & Encryption

- Use lib/encryption.ts and ENCRYPTION_KEY from env.
- Never print sensitive values to logs.

Example usage:

```ts
import { decrypt } from "@/lib/encryption";
const plaintext = decrypt(encryptedValue, env.ENCRYPTION_KEY);
```
