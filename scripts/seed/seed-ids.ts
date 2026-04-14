/**
 * Deterministic SEED_IDS used by the seed runner and tests.
 * Kept separate so dry-run reporting can import these IDs without pulling
 * the full seed-data module (which imports DB clients).
 */
export const SEED_IDS = {
  errors: {
    anonymous: "50000000-0000-4000-8000-000000000002",
    withUser: "50000000-0000-4000-8000-000000000001",
  },
  profiles: {
    admin: "10000000-0000-4000-8000-000000000001",
    moderator: "10000000-0000-4000-8000-000000000002",
    user: "10000000-0000-4000-8000-000000000003",
  },
  recipients: {
    one: "40000000-0000-4000-8000-000000000001",
  },
  transactions: {
    one: "30000000-0000-4000-8000-000000000001",
    two: "30000000-0000-4000-8000-000000000002",
  },
  users: {
    admin: "00000000-0000-4000-8000-000000000001",
    moderator: "00000000-0000-4000-8000-000000000002",
    user: "00000000-0000-4000-8000-000000000003",
  },
  wallets: {
    checking: "20000000-0000-4000-8000-000000000001",
    savings: "20000000-0000-4000-8000-000000000002",
  },
} as const;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {SeedIds}
 */
export type SeedIds = typeof SEED_IDS;
