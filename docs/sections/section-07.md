# Section 7 — Zod Validation

All Zod fields must include `.describe(...)` and validators should provide explicit messages for user-facing errors.

Example:

```ts
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .describe("User email address"),
  name: z.string().min(1, "Name is required").describe("Full name")
});
```
