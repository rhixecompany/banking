# Section 19 — Secrets & Encryption

- Use lib/encryption.ts and ENCRYPTION_KEY from validated env variables.
- Never log or print sensitive values.

Example:

```ts
import { decrypt } from "@/lib/encryption";
const plaintext = decrypt(encryptedValue, env.ENCRYPTION_KEY);
```
