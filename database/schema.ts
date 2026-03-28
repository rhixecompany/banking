import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin", "moderator"]);

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  role: userRole("role").default("user").notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  }),
);

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
  }),
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.credentialID] }),
  }),
);
export const user_profiles = pgTable("user_profiles", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
});

export const banks = pgTable(
  "banks",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token").notNull(),
    fundingSourceUrl: text("funding_source_url"),
    sharableId: varchar("sharable_id", { length: 255 }).notNull().unique(),
    institutionId: varchar("institution_id", { length: 255 }),
    institutionName: varchar("institution_name", { length: 255 }),
    accountId: varchar("account_id", { length: 255 }),
    accountType: varchar("account_type", { length: 50 }),
    accountSubtype: varchar("account_subtype", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("banks_user_id_idx").on(table.userId),
    index("banks_sharable_id_idx").on(table.sharableId),
  ],
);

export const transactions = pgTable(
  "transactions",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    senderBankId: text("sender_bank_id").references(() => banks.id),
    receiverBankId: text("receiver_bank_id").references(() => banks.id),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    amount: varchar("amount", { length: 50 }).notNull(),
    type: varchar("type", { length: 50 }),
    status: varchar("status", { length: 50 }).default("pending"),
    channel: varchar("channel", { length: 50 }),
    category: varchar("category", { length: 255 }),
    plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_sender_bank_idx").on(table.senderBankId),
    index("transactions_receiver_bank_idx").on(table.receiverBankId),
  ],
);

export const recipients = pgTable(
  "recipients",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    bankAccountId: text("bank_account_id").references(() => banks.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("recipients_user_id_idx").on(table.userId)],
);

export const errors = pgTable(
  "errors",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    message: text("message").notNull(),
    stack: text("stack"),
    path: varchar("path", { length: 500 }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    severity: varchar("severity", { length: 20 }).default("error"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("errors_created_at_idx").on(table.createdAt),
    index("errors_user_id_idx").on(table.userId),
  ],
);
