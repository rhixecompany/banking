// Centralized MSW handlers for unit tests and dev-time mocks
import { http, HttpResponse } from "msw";

// Example handler for auth - returns seeded user fixture
export const handlers = [
  http.post("/api/auth/sign-in", () =>
    HttpResponse.json(
      {
        ok: true,
        user: { email: "seed.user@example.com", id: "user-seed-1" },
      },
      { status: 200 },
    ),
  ),
];
