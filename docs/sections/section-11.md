# Section 11 — Security Essentials

- Never commit secrets. Use app-config.ts / lib/env.ts for validated environment variables rather than direct `process.env` reads.
- Sanitize user input and avoid logging secrets.

Example:

```ts
import { env } from "@/lib/env";
const key = env.ENCRYPTION_KEY;
```
