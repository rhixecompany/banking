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
 * User role enumeration for role-based access control.
 * @enum {string}
 */
export const userRole = pgEnum("user_role", ["user", "admin", "moderator"]);

/**
 * Transaction status enumeration representing the lifecycle states of a financial transaction.
 * @enum {string}
 */
export const transactionStatus = pgEnum("transaction_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
]);

/**
 * Transaction type enumeration representing the direction of funds flow.
 * @enum {string}
 */
export const transactionType = pgEnum("transaction_type", ["credit", "debit"]);

/**
 * Transaction channel enumeration representing the medium through which a transaction was initiated.
 * @enum {string}
 */
export const transactionChannel = pgEnum("transaction_channel", [
  "online",
  "in_store",
  "other",
]);

/**
 * Users table - Core user authentication and profile data.
 * Contains email/password credentials, OAuth accounts, and administrative flags.
 */
export const users = pgTable(
  "users",
  {
    /**
     * ISO 8601 timestamp when the user account was created.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Soft delete timestamp. Null for active accounts; set to deletion time for deleted accounts.
     * @type {Date | null}
     */
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    /**
     * Unique email address used for authentication and notifications.
     * @type {string}
     */
    email: varchar("email", { length: 255 }).notNull().unique(),
    /**
     * Timestamp when the user's email was verified (null until verified).
     * @type {Date | null}
     */
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * URL to the user's profile image (e.g., from OAuth provider).
     * @type {string | null}
     */
    image: varchar("image", { length: 255 }),
    /**
     * Boolean flag indicating whether the user account is active.
     * Inactive accounts cannot log in but data is preserved.
     * @type {boolean}
     */
    isActive: boolean("is_active").default(true),
    /**
     * Boolean flag indicating admin privileges.
     * Admins can access the admin panel and manage other users.
     * @type {boolean}
     */
    isAdmin: boolean("is_admin").default(false),
    /**
     * Display name shown throughout the application.
     * @type {string | null}
     */
    name: varchar("name", { length: 255 }),
    /**
     * Bcrypt-hashed password for credentials authentication.
     * Null for OAuth-only accounts.
     * @type {string | null}
     */
    password: varchar("password", { length: 255 }),
    /**
     * Role enumeration for fine-grained permission control.
     * Stored in DB but the JWT session uses isAdmin/isActive booleans only.
     * @type {"user" | "admin" | "moderator"}
     */
    role: userRole("role").default("user").notNull(),
    /**
     * ISO 8601 timestamp when the user account was last updated.
     * Automatically set by Drizzle's $onUpdateFn.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_deleted_at_idx").on(table.deletedAt),
  ],
);

/**
 * Account table - OAuth and credentials provider link records.
 * Stores access tokens and refresh tokens for third-party authentication providers.
 * NextAuth manages this table; do not query directly in application code.
 */
export const account = pgTable(
  "account",
  {
    /**
     * OAuth access token for the provider API.
     * @type {string | null}
     */
    access_token: text("access_token"),
    /**
     * ISO 8601 timestamp when this account record was created.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Unix timestamp (seconds) when the access token expires.
     * @type {number | null}
     */
    expires_at: integer("expires_at"),
    /**
     * OpenID Connect ID token.
     * @type {string | null}
     */
    id_token: text("id_token"),
    /**
     * OAuth provider identifier (e.g., "github", "google").
     * @type {string}
     */
    provider: text("provider").notNull(),
    /**
     * Provider's unique identifier for this account.
     * @type {string}
     */
    providerAccountId: text("providerAccountId").notNull(),
    /**
     * OAuth refresh token for obtaining new access tokens.
     * @type {string | null}
     */
    refresh_token: text("refresh_token"),
    /**
     * OAuth scope string.
     * @type {string | null}
     */
    scope: text("scope"),
    /**
     * OAuth session state.
     * @type {string | null}
     */
    session_state: text("session_state"),
    /**
     * OAuth token type (e.g., "Bearer").
     * @type {string | null}
     */
    token_type: text("token_type"),
    /**
     * Account type from NextAuth (e.g., "oauth", "credentials").
     * @type {string}
     */
    type: text("type").notNull(),
    /**
     * ISO 8601 timestamp when this account record was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete removes linked accounts.
     * @type {string}
     */
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
 * Session table - NextAuth session storage.
 * Stores active HTTP-only session tokens for server-side session strategy.
 * Note: When using JWT strategy (current), this table is not actively used.
 */
export const session = pgTable(
  "session",
  {
    /**
     * ISO 8601 timestamp when this session record was created.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * ISO 8601 timestamp when this session expires.
     * @type {Date}
     */
    expires: timestamp("expires", { mode: "date" }).notNull(),
    /**
     * Unique session token used as the session identifier.
     * @type {string}
     */
    sessionToken: text("sessionToken").primaryKey().notNull(),
    /**
     * Foreign key reference to users.id. Cascade delete removes sessions.
     * @type {string}
     */
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

/**
 * VerificationToken table - NextAuth email verification tokens.
 * Stores one-time tokens for email verification and password reset flows.
 */
export const verificationToken = pgTable(
  "verificationToken",
  {
    /**
     * ISO 8601 timestamp when this token record was created.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * ISO 8601 timestamp when this token expires.
     * @type {Date}
     */
    expires: timestamp("expires", { mode: "date" }).notNull(),
    /**
     * Identifier this token is valid for (typically an email address).
     * @type {string}
     */
    identifier: text("identifier").notNull(),
    /**
     * The unique verification token value.
     * @type {string}
     */
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
 * Authenticator table - NextAuth WebAuthn/FIDO2 credential storage.
 * Stores public key credentials for passwordless authentication.
 */
export const authenticator = pgTable(
  "authenticator",
  {
    /**
     * Sign count used by WebAuthn to detect credential cloning.
     * @type {number}
     */
    counter: integer("counter").notNull(),
    /**
     * ISO 8601 timestamp when this authenticator was registered.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Boolean indicating whether this credential was backed up.
     * @type {boolean}
     */
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    /**
     * Device type ("singleDevice" or "multiDevice").
     * @type {string}
     */
    credentialDeviceType: text("credentialDeviceType").notNull(),
    /**
     * Base64url-encoded credential ID (unique per authenticator).
     * @type {string}
     */
    credentialID: text("credentialID").notNull().unique(),
    /**
     * Base64url-encoded credential public key.
     * @type {string}
     */
    credentialPublicKey: text("credentialPublicKey").notNull(),
    /**
     * Provider account ID this authenticator is linked to.
     * @type {string}
     */
    providerAccountId: text("providerAccountId").notNull(),
    /**
     * Authenticator transport types (e.g., "usb", "nfc", "ble").
     * @type {string | null}
     */
    transports: text("transports"),
    /**
     * ISO 8601 timestamp when this authenticator was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete removes authenticators.
     * @type {string}
     */
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
 * User profiles table - Extended user information for compliance and personalization.
 * Stores addresses, contact details, and sensitive data (SSN) required for
 * financial services compliance (Know Your Customer).
 */
export const user_profiles = pgTable(
  "user_profiles",
  {
    /**
     * Street address line (line 1).
     * @type {string | null}
     */
    address: varchar("address", { length: 255 }),
    /**
     * City of residence.
     * @type {string | null}
     */
    city: varchar("city", { length: 100 }),
    /**
     * ISO 8601 timestamp when this profile was created.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Date of birth in YYYY-MM-DD format.
     * Required for Dwolla personal verified customer creation.
     * @type {string | null}
     */
    dateOfBirth: varchar("date_of_birth", { length: 20 }),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * Contact phone number in E.164 format (e.g., +1XXXXXXXXXX).
     * @type {string | null}
     */
    phone: varchar("phone", { length: 20 }),
    /**
     * ZIP or postal code.
     * @type {string | null}
     */
    postalCode: varchar("postal_code", { length: 20 }),
    /**
     * AES-256-GCM encrypted Social Security Number for identity verification.
     * Decrypted only when required for Dwolla customer verification.
     * @type {string | null}
     */
    ssnEncrypted: text("ssn_encrypted"),
    /**
     * US state or territory abbreviation (e.g., CA, NY).
     * @type {string | null}
     */
    state: varchar("state", { length: 50 }),
    /**
     * ISO 8601 timestamp when this profile was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete removes profile.
     * @type {string}
     */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("user_profiles_user_id_unique").on(table.userId)],
);

/**
 * Plaid items table - normalized Plaid Item storage
 * Stores Plaid item_id and the encrypted access token per user.
 */
export const plaid_items = pgTable(
  "plaid_items",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    itemId: varchar("item_id", { length: 255 }).notNull(),
    accessTokenEncrypted: text("access_token_encrypted").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index("plaid_items_item_id_idx").on(table.itemId)],
);

/**
 * Wallets table - Linked Plaid bank accounts with Dwolla ACH integration.
 * Stores Plaid access tokens (encrypted), account metadata, and Dwolla funding source URLs.
 */
export const wallets = pgTable(
  "wallets",
  {
    /**
     * Plaid API access token for this linked wallet.
     * Stored encrypted with AES-256-GCM; decrypted on read via walletsDal.
     * @type {string}
     */
    accessToken: text("access_token").notNull(),
    /**
     * Plaid account ID unique within the linked Item.
     * Used to match transactions to this account.
     * @type {string | null}
     */
    accountId: varchar("account_id", { length: 255 }),
    /**
     * AES-256-GCM encrypted bank account number for micro-deposit verification.
     * @type {string | null}
     */
    accountNumberEncrypted: text("account_number_encrypted"),
    /**
     * Account subtype from Plaid (e.g., "checking", "savings", "credit card").
     * @type {string | null}
     */
    accountSubtype: varchar("account_subtype", { length: 100 }),
    /**
     * High-level account type from Plaid (e.g., "depository", "credit", "loan").
     * @type {string | null}
     */
    accountType: varchar("account_type", { length: 50 }),
    /**
     * ISO 8601 timestamp when this wallet was linked.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Dwolla customer URL for this wallet's owner.
     * Format: https://api-sandbox.dwolla.com/customers/{uuid}
     * @type {string | null}
     */
    customerUrl: varchar("customer_url", { length: 500 }),
    /**
     * Soft delete timestamp. Null for active links; set to deletion time when unlinked.
     * @type {Date | null}
     */
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    /**
     * Dwolla funding source URL for initiating ACH transfers.
     * Format: https://api-sandbox.dwolla.com/funding-sources/{uuid}
     * @type {string | null}
     */
    fundingSourceUrl: text("funding_source_url"),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * Plaid institution ID for the financial institution (e.g., "ins_3").
     * @type {string | null}
     */
    institutionId: varchar("institution_id", { length: 255 }),
    /**
     * Human-readable institution name (e.g., "Chase", "Bank of America").
     * @type {string | null}
     */
    institutionName: varchar("institution_name", { length: 255 }),
    /**
     * Bank routing number for ACH transfers and micro-deposit verification.
     * @type {string | null}
     */
    routingNumber: varchar("routing_number", { length: 20 }),
    /**
     * Public-safe shareable identifier for transfer recipient lookups.
     * Used to identify recipient accounts without exposing internal database IDs.
     * @type {string}
     */
    sharableId: varchar("sharable_id", { length: 255 }).notNull().unique(),
    /**
     * ISO 8601 timestamp when this wallet record was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete unlinks all wallets.
     * @type {string}
     */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("wallets_user_id_idx").on(table.userId),
    index("wallets_sharable_id_idx").on(table.sharableId),
    index("wallets_customer_url_idx").on(table.customerUrl),
    index("wallets_funding_source_url_idx").on(table.fundingSourceUrl),
    index("wallets_deleted_at_idx").on(table.deletedAt),
  ],
);

/**
 * Transactions table - All financial transactions (Plaid-sourced and internal ACH transfers).
 * Plaid transactions have a plaidTransactionId; internal transfers are created via Dwolla.
 */
export const transactions = pgTable(
  "transactions",
  {
    /**
     * Transaction amount as a decimal string (e.g., "123.45").
     * Positive values indicate debits (outflows); negative indicates credits (inflows).
     * @type {string}
     */
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    /**
     * Primary spending category from Plaid (e.g., "Food and Drink", "Travel").
     * @type {string | null}
     */
    category: varchar("category", { length: 255 }),
    /**
     * Channel through which the transaction was initiated.
     * @type {"online" | "in_store" | "other" | null}
     */
    channel: transactionChannel("channel"),
    /**
     * ISO 8601 timestamp when this transaction was recorded.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * ISO 4217 currency code (default: "USD").
     * @type {string | null}
     */
    currency: varchar("currency", { length: 3 }).default("USD"),
    /**
     * Soft delete timestamp. Null for active transactions.
     * @type {Date | null}
     */
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    /**
     * Recipient's email address for transfer notifications.
     * @type {string | null}
     */
    email: varchar("email", { length: 255 }),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * Human-readable transaction description (merchant name, transfer memo, etc.).
     * @type {string | null}
     */
    name: varchar("name", { length: 255 }),
    /**
     * Plaid transaction ID for deduplication of Plaid-sourced transactions.
     * @type {string | null}
     */
    plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }),
    /**
     * Foreign key reference to wallets.id for the recipient account.
     * @type {string | null}
     */
    receiverWalletId: text("receiver_wallet_id").references(() => wallets.id),
    /**
     * Foreign key reference to wallets.id for the sender account.
     * @type {string | null}
     */
    senderWalletId: text("sender_wallet_id").references(() => wallets.id),
    /**
     * Current status in the transaction lifecycle.
     * @type {"pending" | "processing" | "completed" | "failed" | "cancelled" | null}
     */
    status: transactionStatus("status").default("pending"),
    /**
     * Direction of funds flow ("credit" for inflows, "debit" for outflows).
     * @type {"credit" | "debit" | null}
     */
    type: transactionType("type"),
    /**
     * ISO 8601 timestamp when this transaction was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete removes all user transactions.
     * @type {string}
     */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_sender_wallet_idx").on(table.senderWalletId),
    index("transactions_receiver_wallet_idx").on(table.receiverWalletId),
    index("transactions_status_idx").on(table.status),
    index("transactions_created_at_idx").on(table.createdAt),
    index("transactions_deleted_at_idx").on(table.deletedAt),
    uniqueIndex("transactions_plaid_id_idx").on(table.plaidTransactionId),
  ],
);

/**
 * Dwolla transfers table - records provider-specific metadata for ACH transfers
 * initiated via the Dwolla API. This is separate from `transactions` which is
 * the application's canonical ledger. Storing provider IDs allows reconciling
 * transfer status with Dwolla webhooks and debugging transfer lifecycle issues.
 */
export const dwolla_transfers = pgTable(
  "dwolla_transfers",
  {
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    destinationFundingSourceUrl: text("destination_funding_source_url"),
    dwollaTransferId: text("dwolla_transfer_id"),
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    receiverWalletId: text("receiver_wallet_id").references(() => wallets.id),
    senderWalletId: text("sender_wallet_id").references(() => wallets.id),
    sourceFundingSourceUrl: text("source_funding_source_url"),
    status: varchar("status", { length: 50 }),
    transferUrl: text("transfer_url"),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    userId: text("user_id").references(() => users.id),
  },
  (table) => [
    index("dwolla_transfers_user_id_idx").on(table.userId),
    index("dwolla_transfers_status_idx").on(table.status),
    index("dwolla_transfers_created_at_idx").on(table.createdAt),
  ],
);

/**
 * Recipients table - Saved transfer recipients for quick transfer initiation.
 * Stores contact information for frequently used transfer destinations.
 */
export const recipients = pgTable(
  "recipients",
  {
    /**
     * Foreign key reference to wallets.id for the recipient's bank account.
     * @type {string | null}
     */
    bankAccountId: text("bank_account_id").references(() => wallets.id),
    /**
     * ISO 8601 timestamp when this recipient was added.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * Recipient's email address for transfer notifications.
     * @type {string}
     */
    email: varchar("email", { length: 255 }).notNull(),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * Recipient's display name (e.g., "John Doe").
     * @type {string | null}
     */
    name: varchar("name", { length: 255 }),
    /**
     * ISO 8601 timestamp when this recipient record was last updated.
     * @type {Date}
     */
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
    /**
     * Foreign key reference to users.id. Cascade delete removes user recipients.
     * @type {string}
     */
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("recipients_user_id_idx").on(table.userId),
    index("recipients_email_idx").on(table.email),
  ],
);

/**
 * Errors table - Application error logging for debugging and monitoring.
 * Stores stack traces and severity levels for production issue investigation.
 */
export const errors = pgTable(
  "errors",
  {
    /**
     * ISO 8601 timestamp when this error was logged.
     * @type {Date}
     */
    createdAt: timestamp("created_at").defaultNow().notNull(),
    /**
     * UUID primary key generated via crypto.randomUUID().
     * @type {string}
     */
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    /**
     * Human-readable error message.
     * @type {string}
     */
    message: text("message").notNull(),
    /**
     * Request path or URL where the error occurred.
     * @type {string | null}
     */
    path: varchar("path", { length: 500 }),
    /**
     * Error severity level ("error", "warning", "info").
     * @type {string | null}
     */
    severity: varchar("severity", { length: 20 }).default("error"),
    /**
     * Stack trace string for error debugging.
     * @type {string | null}
     */
    stack: text("stack"),
    /**
     * Foreign key reference to users.id. Set if error occurred during authenticated request.
     * @type {string | null}
     */
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("errors_created_at_idx").on(table.createdAt),
    index("errors_user_id_idx").on(table.userId),
    index("errors_severity_idx").on(table.severity),
  ],
);
