# Drizzle ORM + next-auth Migration Plan (2026 Upgrade, DRY, markdownlint, Drizzle Patterns)

# Further Reading & Official Docs

For detailed, up-to-date examples and best practices, see:

- [Getting Started Example](../../docs/Getting-Started-Example-context.md)
- [Next.js Integration](../../docs/Next-js-context.md)
- [TypeScript Usage](../../docs/TypeScript-context.md)
- [Credentials Provider](../../docs/Credentials-Provider-context.md)
- [Drizzle ORM Adapter](../../docs/Drizzle-ORM-Adapter-context.md)
- [NextAuth.js Guides](../../docs/Guides-context.md)
- [Drizzle ORM Guides](../../docs/DrizzleORMGuides-context.md)

## Overview

Migrate from legacy auth/ORM (Appwrite/Prisma) to Drizzle ORM + next-auth (Drizzle Adapter), using a hybrid user model and leveraging Drizzle’s latest features and patterns:

- Core fields in `users` table (id, email, password, name, image, isAdmin, isActive, createdAt, updatedAt)
- Sensitive/extra fields in `user_profiles` table (address, SSN, etc.)
- All database files (including `schema.ts` and `db.ts`) live in the `./database` folder
- All mutations (registration, profile update, admin, etc.) use Server Actions in `actions/` (never API routes)
- Full E2E and unit/integration test coverage for all new logic
- Use Drizzle’s recommended schema, migration, and query patterns

---

## Steps

### 1. Remove Legacy Auth/ORM

- Delete all legacy auth/ORM code (`lib/appwrite.ts`, Appwrite/Prisma logic in `user.actions.ts`, README, etc.)
- Remove Appwrite/Prisma and unused auth/ORM dependencies from `package.json`
- Clean up `.env` (remove unused Appwrite/Prisma/legacy secrets)

### 2. Install & Configure Drizzle ORM

- Install dependencies:

  ```sh
  npm install drizzle-orm pg dotenv
  npm install --save-dev drizzle-kit tsx @types/pg
  ```

- See [Drizzle-ORM-Adapter-context.md](../../docs/Drizzle-ORM-Adapter-context.md) for setup, schema, and migration commands.
- Create `drizzle.config.ts` in project root (see Drizzle docs for config pattern)
- Create `./database/schema.ts`:
- Define `users` and `user_profiles` tables using Drizzle’s `pgTable`, `varchar`, `timestamp`, and FK patterns
- Create `./database/db.ts`:
  - Initialize Drizzle connection using `drizzle-orm/node-postgres` and `process.env.DATABASE_URL`
  - Example:
    ```ts
    import "dotenv/config";
    import { drizzle } from "drizzle-orm/node-postgres";
    import { Pool } from "pg";
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    export const db = drizzle(pool);
    ```
- Place all database-related files (schema, db, seeds, migrations) in the `./database` folder
- Run Drizzle migrations (`npm exec drizzle-kit push` or `generate` + `migrate`)
- Seed and query using Drizzle’s recommended scripts

### 3. Integrate next-auth with Drizzle Adapter

- See [Getting-Started-Example-context.md](../../docs/Getting-Started-Example-context.md) for NextAuth.js setup patterns.
- See [Credentials-Provider-context.md](../../docs/Credentials-Provider-context.md) for CredentialsProvider usage.
- See [TypeScript-context.md](../../docs/TypeScript-context.md) for module augmentation and type safety.
- Install `next-auth`, `@auth/drizzle-adapter`, `bcrypt`
- Update `app/api/auth/[...nextauth].ts`:
  - Use DrizzleAdapter with `users` table
  - CredentialsProvider for login (bcrypt password check, isActive check)
  - Session strategy: "database"
  - Add admin/active fields to session
  - Add rate limiting for failed logins (middleware or in authorize)
- Example minimal config:

  ```ts
  import { DrizzleAdapter } from "@auth/drizzle-adapter";
  import bcrypt from "bcrypt"; // docs: updated snippet — verify vs. source
  import NextAuth from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";

  import { db } from "@/database/db";
  import { users } from "@/database/schema";

  export const authOptions = {
    adapter: DrizzleAdapter(db),
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          const user = await db
            .select()
            .from(users)
            .where(users.email.eq(credentials.email))
            .then(r => r[0]);
          if (!user) return null;
          const valid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!valid) return null;
          return user;
        },
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        name: "Credentials"
      })
    ],
    session: { strategy: "database" }
  };

  export default NextAuth(authOptions);
  ```

- Update `.env` with `DATABASE_URL`, `NEXTAUTH_SECRET`

### 4. Registration Action

- Create `actions/register.ts` (Server Action):
- Validate input (zod)
- Hash password (bcrypt)
- Insert user into `users` and `user_profiles` using Drizzle’s insert/query patterns
- Enforce unique email (handle constraint errors)
- Return appropriate errors
- Optionally send welcome email
- See [Getting-Started-Example-context.md](../../docs/Getting-Started-Example-context.md) and [TypeScript-context.md](../../docs/TypeScript-context.md) for validation and type safety patterns.

### 5. Profile Update Action

- Create `actions/updateProfile.ts` (Server Action):
- Allow updating image, email, password, and profile fields
- Require current password for sensitive changes
- Update both `users` and `user_profiles` as needed
- Send email notification on changes

### 6. Admin & Soft-Delete Actions

- Create Server Actions for:
  - Toggling `isAdmin`
  - Deactivate/reactivate logic (toggle `isActive`)
  - Prevent login for inactive users
- All mutations must use Server Actions in `actions/`

### 7. Refactor Auth UI

- Update `components/AuthForm.tsx` to use new registration and login flows via Server Actions
- Add profile update form (image/email/password/profile fields)
- Add admin/deactivate controls if needed

### 8. Types & Utilities

- Update `types/index.d.ts` for new user/session/profile types
- Add/extend Zod schemas for validation

### 9. Testing

- Write/expand E2E tests for:
  - Registration, login, logout, session persistence
  - Profile update, admin, deactivate/reactivate, rate limiting, email notification
- Write unit/integration tests for:
  - Registration Server Action
  - Profile update Server Action
  - Rate limiting
  - Email notification
- Ensure 100% pass rate
- See [Guides-context.md](../../docs/Guides-context.md) for advanced flows, fullstack patterns, and testing strategies.

---

## Documentation Links

- [Getting Started Example](../../docs/Getting-Started-Example-context.md)
- [Next.js Integration](../../docs/Next-js-context.md)
- [TypeScript Usage](../../docs/TypeScript-context.md)
- [Credentials Provider](../../docs/Credentials-Provider-context.md)
- [Drizzle ORM Adapter](../../docs/Drizzle-ORM-Adapter-context.md)
- [NextAuth.js Guides](../../docs/Guides-context.md)
- [Drizzle ORM Guides](../../docs/DrizzleORMGuides-context.md)

### 10. Documentation

- Update README.md for new auth flow, environment variables, and migration notes
- Document all public APIs, Server Actions, and components
- Reference Drizzle ORM patterns (pagination, upsert, toggling, etc.) in developer docs

---

## Drizzle ORM Patterns to Use

- Use `.select()`, `.insert()`, `.update().set()`, `.delete()` as shown in Drizzle docs
- For upserts, use `.onConflictDoUpdate()` (Postgres/SQLite) or `.onDuplicateKeyUpdate()` (MySQL)
- Use `timestamp().defaultNow()` for created/updated fields
- Use Drizzle’s pagination, count, and conditional filter patterns for queries
- Use `getColumns()` for dynamic column selection in queries

---

## Verification

- Run `npm run lint`, `npm run type-check`, `npm run test` (all must pass)
- Manually test all critical flows
- Confirm DB records and session flows
- Validate rate limiting and email notifications
- Ensure no legacy code remains

---

## Decisions & Scope

- Hybrid user model: core in `users`, sensitive in `user_profiles`
- Registration/profile update/admin via Server Actions only (never API routes)
- All database files in `./database` (`schema.ts`, `db.ts`, etc.)
- Full E2E + unit/integration test coverage
- Admin/soft-delete/rate limiting/email notification included
- DRY, markdownlint, and project standards enforced
- All Drizzle ORM code follows latest documented patterns

---

**Ready for your confirmation or further tweaks!**
