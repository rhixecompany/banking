// Minimal DAL stub for wallets used during Home refactor.
// Move complex queries here during further DAL work.

export function getWalletsWithDetails(userId: string) {
  // Placeholder: actual implementation should query the database via drizzle.
  // For now return an empty list — tests and E2E will provide seeded data.
  return [] as const;
}
