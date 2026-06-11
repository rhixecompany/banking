# Section 8 — Testing Patterns

- `npm run test` runs Playwright E2E first, then Vitest unit tests.
- Mock `auth()` in unit tests (vi.mock) and use deterministic fixtures for E2E.

Example (Vitest):

```ts
import { vi } from "vitest";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mocked(auth).mockResolvedValue({ user: { id: "user-1" } });
```
