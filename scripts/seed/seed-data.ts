import bcrypt from "bcrypt";
import "dotenv/config";
import { sql } from "drizzle-orm";

import { db } from "@/database/db";
import {
  account,
  authenticator,
  errors,
  plaid_items,
  recipients,
  session,
  transactions,
  user_profiles,
  users,
  verificationToken,
  wallets,
} from "@/database/schema";
import { encrypt } from "@/lib/encryption";

import { getSeedAccessToken } from "./seed-config";

/** Dev-only login for all seeded users (matches E2E tests). */
const SEED_PASSWORD_PLAIN = "password123";

/**
 * Description placeholder
 *
 * @type {{ readonly banks: { readonly checking: "20000000-0000-4000-8000-000000000001"; readonly savings: "20000000-0000-4000-8000-000000000002"; }; readonly errors: { readonly anonymous: "50000000-0000-4000-8000-000000000002"; readonly withUser: "50000000-0000-4000-8000-000000000001"; }; readonly profiles: { ...; }; readonl...}
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
 * Hash a password the same way as registration and auth-options (bcrypt cost 12).
 */
export function hashSeedPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

/**
 * Description placeholder
 *
 * @param {string} userId
 * @returns {typeof account.\$inferInsert}
 */
function buildAccountRow(userId: string): typeof account.$inferInsert {
  return {
    provider: "github",
    providerAccountId: "seed-github-1001",
    type: "oauth",
    userId,
  };
}

/**
 * Description placeholder
 *
 * @param {string} userId
 * @returns {typeof session.\$inferInsert}
 */
function buildSessionRow(userId: string): typeof session.$inferInsert {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return {
    expires,
    sessionToken: "seed-session-token-primary",
    userId,
  };
}

/**
 * Description placeholder
 *
 * @returns {typeof verificationToken.\$inferInsert}
 */
function buildVerificationTokenRow(): typeof verificationToken.$inferInsert {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  return {
    expires,
    identifier: "seed-verify@example.com",
    token: "seed-verification-token-abc",
  };
}

/**
 * Description placeholder
 *
 * @param {string} userId
 * @returns {typeof authenticator.\$inferInsert}
 */
function buildAuthenticatorRow(
  userId: string,
): typeof authenticator.$inferInsert {
  return {
    counter: 0,
    credentialBackedUp: true,
    credentialDeviceType: "singleDevice",
    credentialID: "seed-credential-id-unique-001",
    // eslint-disable-next-line no-secrets/no-secrets
    credentialPublicKey: "c2VlZC1wdWJsaWMta2V5LXBsYWNlaG9sZGVy",
    providerAccountId: "seed-webauthn-provider",
    transports: "internal",
    userId,
  };
}

/**
 * Description placeholder
 *
 * @param {string} id
 * @param {string} userId
 * @param {Partial<typeof user_profiles.\$inferInsert>} overrides
 * @returns {typeof user_profiles.\$inferInsert}
 */
function buildUserProfileRow(
  id: string,
  userId: string,
  overrides: Partial<typeof user_profiles.$inferInsert>,
): typeof user_profiles.$inferInsert {
  return {
    address: "123 Seed Street",
    city: "Seattle",
    dateOfBirth: "1990-01-15",
    id,
    phone: "5550100",
    postalCode: "98101",
    state: "WA",
    userId,
    ...overrides,
  };
}

/**
 * Description placeholder
 *
 * @param {string} id
 * @param {string} userId
 * @param {string} sharableId
 * @param {string} institutionName
 * @param {number} index
 * @returns {typeof wallets.$inferInsert}
 */
function buildWalletRow(
  id: string,
  userId: string,
  sharableId: string,
  institutionName: string,
  index: number,
): typeof wallets.$inferInsert {
  return {
    accessToken: encrypt(getSeedAccessToken()),
    accountId: `seed-account-${sharableId}`,
    accountSubtype: "checking",
    accountType: "depository",
    id,
    institutionId: `ins_${sharableId}`,
    institutionName,
    sharableId,
    userId,
  };
}

function buildPlaidItemRow(
  id: string,
  userId: string,
  accessToken: string,
  itemId: string,
) {
  return {
    accessTokenEncrypted: encrypt(accessToken),
    id,
    itemId,
    userId,
  };
}

/**
 * Description placeholder
 *
 * @param {string} id
 * @param {string} userId
 * @param {string} senderWalletId
 * @param {string} receiverWalletId
 * @param {string} plaidSuffix
 * @returns {typeof transactions.$inferInsert}
 */
function buildTransactionRow(
  id: string,
  userId: string,
  senderWalletId: string,
  receiverWalletId: string,
  plaidSuffix: string,
): typeof transactions.$inferInsert {
  return {
    amount: "150.00",
    category: "transfer",
    channel: "online",
    currency: "USD",
    email: "seed-tx@example.com",
    id,
    name: "Seed transfer",
    plaidTransactionId: `seed-plaid-${plaidSuffix}`,
    receiverWalletId,
    senderWalletId,
    status: "completed",
    type: "debit",
    userId,
  };
}

/**
 * Description placeholder
 *
 * @param {string} id
 * @param {string} userId
 * @param {string} bankAccountId
 * @returns {typeof recipients.\$inferInsert}
 */
function buildRecipientRow(
  id: string,
  userId: string,
  bankAccountId: string,
): typeof recipients.$inferInsert {
  return {
    bankAccountId,
    email: "recipient.seed@example.com",
    id,
    name: "Seed Recipient",
    userId,
  };
}

/**
 * Description placeholder
 *
 * @param {string} id
 * @param {(string | undefined)} userId
 * @returns {typeof errors.\$inferInsert}
 */
function buildErrorRow(
  id: string,
  userId: string | undefined,
): typeof errors.$inferInsert {
  return {
    id,
    message: "Seed error log entry",
    path: "/seed/demo",
    severity: "error",
    stack: "Error: seed stack trace\n  at seed()",
    userId,
  };
}

/**
 * Insert deterministic rows for every table in dependency order.
 */
export async function seedAll(): Promise<void> {
  const passwordHash = await hashSeedPassword(SEED_PASSWORD_PLAIN);

  await db.insert(users).values([
    {
      email: "seed-admin@example.com",
      id: SEED_IDS.users.admin,
      isActive: true,
      isAdmin: true,
      name: "Seed Admin",
      password: passwordHash,
      role: "admin",
    },
    {
      email: "seed-moderator@example.com",
      id: SEED_IDS.users.moderator,
      isActive: true,
      isAdmin: false,
      name: "Seed Moderator",
      password: passwordHash,
      role: "moderator",
    },
    {
      email: "seed-user@example.com",
      id: SEED_IDS.users.user,
      isActive: true,
      isAdmin: false,
      name: "Seed User",
      password: passwordHash,
      role: "user",
    },
  ]);

  await db.insert(account).values(buildAccountRow(SEED_IDS.users.admin));

  await db.insert(session).values(buildSessionRow(SEED_IDS.users.admin));

  await db.insert(verificationToken).values(buildVerificationTokenRow());

  await db
    .insert(authenticator)
    .values(buildAuthenticatorRow(SEED_IDS.users.admin));

  await db.insert(user_profiles).values([
    buildUserProfileRow(SEED_IDS.profiles.admin, SEED_IDS.users.admin, {
      city: "Seattle",
    }),
    buildUserProfileRow(SEED_IDS.profiles.moderator, SEED_IDS.users.moderator, {
      city: "Portland",
    }),
    buildUserProfileRow(SEED_IDS.profiles.user, SEED_IDS.users.user, {
      city: "Austin",
    }),
  ]);

  await db
    .insert(wallets)
    .values([
      buildWalletRow(
        SEED_IDS.wallets.checking,
        SEED_IDS.users.user,
        "seed-share-checking-001",
        "Seed Checking Wallet",
        0,
      ),
      buildWalletRow(
        SEED_IDS.wallets.savings,
        SEED_IDS.users.user,
        "seed-share-savings-002",
        "Seed Savings Wallet",
        1,
      ),
    ]);

  // Insert Plaid items and link wallets to them via plaid_item_id
  // Create a Plaid item per seeded wallet for deterministic tests
  const plaidItemCheckingId = `plaid-item-${SEED_IDS.wallets.checking}`;
  const plaidItemSavingsId = `plaid-item-${SEED_IDS.wallets.savings}`;

  await db
    .insert(plaid_items)
    .values([
      buildPlaidItemRow(
        plaidItemCheckingId,
        SEED_IDS.users.user,
        getSeedAccessToken(),
        `item-seed-${SEED_IDS.wallets.checking}`,
      ),
      buildPlaidItemRow(
        plaidItemSavingsId,
        SEED_IDS.users.user,
        getSeedAccessToken(),
        `item-seed-${SEED_IDS.wallets.savings}`,
      ),
    ]);

  // Backfill wallets.plaid_item_id
  // Note: Drizzle column names are snake_case in the DB. Use the
  // column key as defined on the `wallets` table variable. If the
  // generated table type doesn't expose `plaidItemId`, use the raw
  // SQL update as a safe path that avoids TypeScript type mismatches.
  await db.execute(
    sql`UPDATE wallets SET plaid_item_id = ${plaidItemCheckingId} WHERE id = ${SEED_IDS.wallets.checking}`,
  );

  await db.execute(
    sql`UPDATE wallets SET plaid_item_id = ${plaidItemSavingsId} WHERE id = ${SEED_IDS.wallets.savings}`,
  );

  await db
    .insert(transactions)
    .values([
      buildTransactionRow(
        SEED_IDS.transactions.one,
        SEED_IDS.users.user,
        SEED_IDS.wallets.checking,
        SEED_IDS.wallets.savings,
        "tx-001",
      ),
      buildTransactionRow(
        SEED_IDS.transactions.two,
        SEED_IDS.users.user,
        SEED_IDS.wallets.savings,
        SEED_IDS.wallets.checking,
        "tx-002",
      ),
    ]);

  await db
    .insert(recipients)
    .values([
      buildRecipientRow(
        SEED_IDS.recipients.one,
        SEED_IDS.users.user,
        SEED_IDS.wallets.checking,
      ),
    ]);

  await db
    .insert(errors)
    .values([
      buildErrorRow(SEED_IDS.errors.withUser, SEED_IDS.users.user),
      buildErrorRow(SEED_IDS.errors.anonymous, undefined),
    ]);
}
