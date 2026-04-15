# Section 7 — Zod Validation

- All Zod fields must include `.describe(...)` and validators must provide messages for user-facing errors.

Example schema:

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
