import { SEED_IDS } from "./seed-data";

/**
 * Return a small summary of rows that would be seeded. Useful for dry-run reporting.
 */
export function getPlannedSeedSummary() {
  return {
    transactions: SEED_IDS.transactions,
    users: {
      admin: SEED_IDS.users.admin,
      moderator: SEED_IDS.users.moderator,
      user: SEED_IDS.users.user,
    },
    wallets: SEED_IDS.wallets,
  };
}

export default getPlannedSeedSummary;
