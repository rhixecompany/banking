import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const user_profiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  postalCode: varchar("postal_code", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 20 }),
  ssn: varchar("ssn", { length: 255 }),
});

export const banks = pgTable(
  "banks",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
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
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    senderBankId: integer("sender_bank_id").references(() => banks.id),
    receiverBankId: integer("receiver_bank_id").references(() => banks.id),
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
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    bankAccountId: integer("bank_account_id").references(() => banks.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("recipients_user_id_idx").on(table.userId)],
);
