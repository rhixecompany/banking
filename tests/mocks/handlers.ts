// Centralized MSW handlers for unit tests and dev-time mocks
import * as msw from "msw";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const { rest } = msw as any;

// Example handler for auth - returns seeded user fixture if requested
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
export const handlers = [
  rest.post("/api/auth/sign-in", (req: any, res: any, ctx: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        ok: true,
        user: { email: "seed.user@example.com", id: "user-seed-1" },
      }),
    );
  }),
];
