# Section 11 — Security Essentials

- Never commit secrets. Use environment variables via lib/env.ts or app-config.ts instead of `process.env`.
- Sanitize user input and avoid logging sensitive values.

Example env usage:

```ts
import { env } from "@/lib/env";
const key = env.ENCRYPTION_KEY;
```
