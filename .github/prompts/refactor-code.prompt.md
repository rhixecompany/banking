---
agent: "architect"
model: Claude Sonnet 4
tools: ["codebase", "githubRepo"]
description: "Refactor code for maintainability and standards."
---

# Drizzle ORM + next-auth Migration Plan (2026 Upgrade, DRY, markdownlint, Drizzle Patterns)

## Overview

Migrate from legacy Appwrite/Prisma auth to Drizzle ORM + next-auth (Drizzle Adapter), using a hybrid user model and leveraging Drizzle’s latest features and patterns:

## Steps

### 1. Remove Legacy Auth/ORM

### 2. Install & Configure Drizzle ORM

```sh
pnpm add drizzle-orm pg dotenv
pnpm add -D drizzle-kit tsx @types/pg
```

- Define `users` and `user_profiles` tables using Drizzle’s `pgTable`, `varchar`, `timestamp`, and FK patterns
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

### 3. Integrate next-auth with Drizzle Adapter

- Use DrizzleAdapter with `users` table
- CredentialsProvider for login (bcrypt password check, isActive check)
- Session strategy: "database"
- Add admin/active fields to session
- Add rate limiting for failed logins (middleware or in authorize)

### 4. Registration Action

- Validate input (zod)
- Hash password (bcrypt)
- Insert user into `users` and `user_profiles` using Drizzle’s insert/query patterns
- Enforce unique email (handle constraint errors)
- Return appropriate errors
- Optionally send welcome email

### 5. Profile Update Action

- Allow updating image, email, password, and profile fields
- Require current password for sensitive changes
- Update both `users` and `user_profiles` as needed
- Send email notification on changes

### 6. Admin & Soft-Delete Actions

- Toggling `isAdmin`
- Deactivate/reactivate logic (toggle `isActive`)
- Prevent login for inactive users

### 7. Refactor Auth UI

### 8. Types & Utilities

### 9. Testing

- Registration, login, logout, session persistence
- Profile update, admin, deactivate/reactivate, rate limiting, email notification
- Registration Server Action
- Profile update Server Action
- Rate limiting
- Email notification

### 10. Documentation

## Drizzle ORM Patterns to Use

## Verification

## Decisions & Scope

**Ready for your confirmation or further tweaks!**
