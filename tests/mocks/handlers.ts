// Centralized MSW handlers for unit tests and dev-time mocks
import { rest } from "msw";

// Example handler for auth - returns seeded user fixture if requested
export const handlers = [
  rest.post("/api/auth/sign-in", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
        user: { email: "seed.user@example.com", id: "user-seed-1" },
      }),
    );
  }),
];
