# Section 8 — Testing Patterns

- `npm run test` runs Playwright E2E first then Vitest unit tests.
- Mock `auth()` in unit tests with `vi.mocked(auth)`.

Vitest mock example:

```ts
import { vi } from "vitest";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

vi.mocked(auth).mockResolvedValue({
  user: { id: "user-1", isAdmin: false, isActive: true }
});
```
