import {
  boolean,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Description placeholder
 *
 * @type {*}
 */
export const userRole = pgEnum("user_role", ["user", "admin", "moderator"]);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  image: varchar("image", { length: 255 }),
  isActive: boolean("is_active").default(true),
  isAdmin: boolean("is_admin").default(false),
  name: varchar("name", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: userRole("role").default("user").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

/**
 * Description placeholder
 *
 * @type {*}
 */
export const account = pgTable(
  "account",
  {
    access_token: text("access_token"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expires_at: integer("expires_at"),
    id_token: text("id_token"),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    scope: text("scope"),
    session_state: text("session_state"),
    token_type: text("token_type"),
    type: text("type").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }),
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const session = pgTable(
  "session",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    sessionToken: text("sessionToken").primaryKey().notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const verificationToken = pgTable(
  "verificationToken",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_token_identifier_idx").on(
      table.identifier,
    ),
    pk: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const authenticator = pgTable(
  "authenticator",
  {
    counter: integer("counter").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialID: text("credentialID").notNull().unique(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    transports: text("transports"),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.credentialID] }),
    userIdIdx: index("authenticator_user_id_idx").on(table.userId),
  }),
);
/**
 * Description placeholder
 *
 * @type {*}
 */
export const user_profiles = pgTable(
  "user_profiles",
  {
    address: varchar("address", { length: 255 }),
    city: varchar("city", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    dateOfBirth: varchar("date_of_birth", { length: 20 }),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    phone: varchar("phone", { length: 20 }),
    postalCode: varchar("postal_code", { length: 20 }),
    state: varchar("state", { length: 50 }),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("user_profiles_user_id_unique").on(table.userId)],
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const banks = pgTable(
  "banks",
  {
    accessToken: text("access_token").notNull(),
    accountId: varchar("account_id", { length: 255 }),
    accountNumberEncrypted: text("account_number_encrypted"),
    accountSubtype: varchar("account_subtype", { length: 100 }),
    accountType: varchar("account_type", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    dwollaCustomerUrl: varchar("dwolla_customer_url", { length: 500 }),
    dwollaFundingSourceUrl: varchar("dwolla_funding_source_url", {
      length: 500,
    }),
    fundingSourceUrl: text("funding_source_url"),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    institutionId: varchar("institution_id", { length: 255 }),
    institutionName: varchar("institution_name", { length: 255 }),
    routingNumber: varchar("routing_number", { length: 20 }),
    sharableId: varchar("sharable_id", { length: 255 }).notNull().unique(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("banks_user_id_idx").on(table.userId),
    index("banks_sharable_id_idx").on(table.sharableId),
    index("banks_dwolla_customer_idx").on(table.dwollaCustomerUrl),
  ],
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const transactions = pgTable(
  "transactions",
  {
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    category: varchar("category", { length: 255 }),
    channel: varchar("channel", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    email: varchar("email", { length: 255 }),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }),
    receiverBankId: text("receiver_bank_id").references(() => banks.id),
    senderBankId: text("sender_bank_id").references(() => banks.id),
    status: varchar("status", { length: 50 }).default("pending"),
    type: varchar("type", { length: 50 }),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_sender_bank_idx").on(table.senderBankId),
    index("transactions_receiver_bank_idx").on(table.receiverBankId),
    uniqueIndex("transactions_plaid_id_idx").on(table.plaidTransactionId),
  ],
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const recipients = pgTable(
  "recipients",
  {
    bankAccountId: text("bank_account_id").references(() => banks.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("recipients_user_id_idx").on(table.userId)],
);

/**
 * Description placeholder
 *
 * @type {*}
 */
export const errors = pgTable(
  "errors",
  {
    createdAt: timestamp("created_at").defaultNow(),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    message: text("message").notNull(),
    path: varchar("path", { length: 500 }),
    severity: varchar("severity", { length: 20 }).default("error"),
    stack: text("stack"),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("errors_created_at_idx").on(table.createdAt),
    index("errors_user_id_idx").on(table.userId),
  ],
);
