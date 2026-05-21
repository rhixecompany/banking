# Banking Code Documentation

## Module Overview

The Banking application is a full-stack Next.js 16 fintech platform providing banking services including account management, transaction processing, Plaid integration for bank linking, and Dwolla integration for payment transfers. It uses the App Router architecture with server-side rendering, PostgreSQL via Neon, Drizzle ORM for database access, and NextAuth v4 for authentication.

## Directory Structure

```
src/
├── actions/           # Server actions (Plaid, Dwolla, auth, transactions)
├── app/               # Next.js App Router pages and API routes
│   ├── (admin)/       # Admin dashboard routes
│   ├── (auth)/        # Authentication routes (sign-in, sign-up)
│   ├── (root)/        # Main application routes (dashboard, transfers)
│   └── api/           # API endpoints (auth, Dwolla webhook, health)
├── components/        # React components (UI, layouts, feature-specific)
│   ├── admin/         # Admin panel components
│   ├── dashboard/     # Dashboard components
│   ├── plaid-context/ # Plaid Link integration
│   ├── payment-transfer/ # Transfer forms and UI
│   └── ui/            # Shared UI primitives (shadcn/ui)
├── constants/         # Application constants and configuration
├── dal/               # Data Access Layer (user, transaction, admin, dwolla)
├── database/          # Drizzle ORM schema and DB connection
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── playwright/    # Playwright test utilities
│   ├── schemas/       # Zod validation schemas
│   └── validations/   # Input validation helpers
├── stores/            # Zustand state stores
├── tests/             # Test files
└── types/             # TypeScript type definitions
```

## Key Classes and Functions

### Server Actions (`src/actions/`)

#### `plaid.actions.ts` — Plaid Financial Institution Integration

```typescript
/**
 * Creates a Plaid Link token for initializing the Plaid Link frontend component.
 * @param userId - The authenticated user's ID
 * @returns {Promise<{linkToken: string} | null>} Link token or null on failure
 */
export async function createLinkToken(userId: string): Promise<{ linkToken: string } | null>;

/**
 * Exchanges a public token from Plaid Link for an access token.
 * Stores the access token and associated account IDs in the database.
 * @param publicToken - Temporary public token from Plaid Link
 * @param userId - The authenticated user's ID
 * @returns {Promise<boolean>} Success status
 */
export async function exchangePublicToken(publicToken: string, userId: string): Promise<boolean>;

/**
 * Fetches transactions for a specific account from Plaid.
 * @param accountId - The bank account ID in the system
 * @param daysRange - Number of days of transaction history to fetch
 * @returns {Promise<Transaction[]>} Array of transaction objects
 */
export async function getTransactions(accountId: string, daysRange: number): Promise<Transaction[]>;
```

#### `dwolla.actions.ts` — Dwolla Payment Processing

```typescript
/**
 * Creates a Dwolla funding source for a bank account.
 * @param dwollaCustomerId - The Dwolla customer ID
 * @param bankName - Display name for the funding source
 * @returns {Promise<string>} Dwolla funding source URL
 */
export async function createFundingSource(dwollaCustomerId: string, bankName: string): Promise<string>;

/**
 * Initiates a transfer between two Dwolla funding sources.
 * @param sourceFundingSourceUrl - Sender's funding source URL
 * @param destinationFundingSourceUrl - Recipient's funding source URL
 * @param amount - Transfer amount in USD
 * @returns {Promise<string>} Transfer ID
 */
export async function createTransfer(
  sourceFundingSourceUrl: string,
  destinationFundingSourceUrl: string,
  amount: string
): Promise<string>;
```

#### `transaction.actions.ts` — Transaction Management

```typescript
/**
 * Creates a new transaction record in the database.
 * @param transactionData - Transaction details (amount, sender, recipient, etc.)
 * @returns {Promise<Transaction>} Created transaction
 */
export async function createTransaction(transactionData: CreateTransactionParams): Promise<Transaction>;

/**
 * Retrieves paginated transactions for a user or account.
 * @param params - Query parameters (userId, accountId, page, limit)
 * @returns {Promise<{transactions: Transaction[], totalPages: number}>}
 */
export async function getTransactionsByUser(params: TransactionQueryParams): Promise<PaginatedResult<Transaction>>;
```

#### `user.actions.ts` — User Management

```typescript
/**
 * Registers a new user account.
 * @param userData - Registration form data (name, email, password)
 * @returns {Promise<User>} Created user object
 */
export async function registerUser(userData: RegisterUserParams): Promise<User>;

/**
 * Updates user profile information.
 * @param userId - User ID to update
 * @param updateData - Fields to update
 * @returns {Promise<User>} Updated user object
 */
export async function updateProfile(userId: string, updateData: UpdateProfileParams): Promise<User>;
```

#### `auth.register.ts` / `auth.signin.ts` — Authentication Actions

```typescript
/**
 * Handles user sign-in via credentials or OAuth.
 * @param credentials - Sign-in credentials
 * @returns {Promise<Session | null>} Session or null on failure
 */
export async function signInUser(credentials: SignInParams): Promise<Session | null>;
```

### Data Access Layer (`src/dal/`)

```typescript
/**
 * Retrieves a user by ID with sensitive fields excluded.
 * @param userId - The user's unique identifier
 * @returns {Promise<User | null>}
 */
export async function getUserById(userId: string): Promise<User | null>;

/**
 * Retrieves all bank accounts linked to a user.
 * @param userId - The user's unique identifier
 * @returns {Promise<BankAccount[]>}
 */
export async function getUserBankAccounts(userId: string): Promise<BankAccount[]>;

/**
 * Retrieves paginated transaction history with optional filters.
 * @param params - Query parameters including userId, date range, category
 * @returns {Promise<PaginatedResult<Transaction>>}
 */
export async function getTransactionHistory(params: TransactionQueryParams): Promise<PaginatedResult<Transaction>>;
```

### Database Schema (`src/database/schema.ts`)

```typescript
// User table - stores registered user accounts
export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("user"),
  dwollaCustomerId: text("dwolla_customer_id"),
  dwollaCustomerUrl: text("dwolla_customer_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Account table - linked bank accounts via Plaid
export const accountTable = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => userTable.id).notNull(),
  plaidAccountId: text("plaid_account_id").notNull(),
  plaidAccessToken: text("plaid_access_token").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }),
  subtype: varchar("subtype", { length: 50 }),
  mask: varchar("mask", { length: 10 }),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }),
  availableBalance: decimal("available_balance", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transaction table - financial transaction records
export const transactionTable = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").references(() => accountTable.id),
  userId: uuid("user_id").references(() => userTable.id).notNull(),
  plaidTransactionId: text("plaid_transaction_id"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  category: varchar("category", { length: 255 }),
  description: text("description"),
  merchantName: varchar("merchant_name", { length: 255 }),
  date: date("date").notNull(),
  pending: boolean("pending").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bank table - institution information
export const bankTable = pgTable("bank", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  plaidInstitutionId: text("plaid_institution_id").notNull(),
  logo: text("logo"),
  primaryColor: varchar("primary_color", { length: 7 }),
});
```

### API Endpoints (`src/app/api/`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | `*` | NextAuth authentication handler |
| `/api/auth/local-create` | `POST` | Local user registration |
| `/api/auth/local-validate` | `POST` | Local credential validation |
| `/api/dwolla/webhook` | `POST` | Dwolla webhook event handler |
| `/api/health` | `GET` | Health check endpoint |

### Configuration Options

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) | Yes |
| `PLAID_CLIENT_ID` | Plaid API client ID | Yes |
| `PLAID_SECRET` | Plaid API secret key | Yes |
| `PLAID_ENV` | Plaid environment (sandbox/development/production) | Yes |
| `DWOLLA_KEY` | Dwolla API key | Yes |
| `DWOLLA_SECRET` | Dwolla API secret | Yes |
| `DWOLLA_ENV` | Dwolla environment (sandbox/production) | Yes |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | Yes |
| `NEXTAUTH_URL` | Application base URL | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (rate limiting) | No |

### Dependencies

- **Framework**: Next.js 16.2.4, React 19.2.5
- **Database**: PostgreSQL (Neon), Drizzle ORM 0.45.2, Drizzle Kit 0.31.10
- **Authentication**: NextAuth 4.24.14, bcryptjs, zod validation
- **Banking APIs**: Plaid 42.2.0, Dwolla v2 3.4.0
- **UI**: Tailwind CSS 4, Radix UI primitives, shadcn/ui, Recharts, Chart.js
- **State**: Zustand 5, React Hook Form, TanStack Table
- **Email**: Nodemailer
- **Rate Limiting**: Upstash Redis + Rate Limit
- **Testing**: Playwright, Vitest, MSW
