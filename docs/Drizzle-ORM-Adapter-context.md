# Drizzle ORM Adapter (Auth.js)

## Resources

- [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview)

## Setup

### Installation

```bash
npm install drizzle-orm @auth/drizzle-adapter
npm install drizzle-kit --save-dev
```

### Environment Variables

```
AUTH_DRIZZLE_URL=postgres://postgres:postgres@127.0.0.1:5432/db
```

### Configuration

To use this adapter, you must have setup Drizzle ORM and Drizzle Kit in your project. Drizzle provides a simple [quick start guide](https://orm.drizzle.team/kit-docs/quick). For more details, follow the Drizzle documentation for your respective database ([PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql), [MySQL](https://orm.drizzle.team/docs/get-started-mysql) or [SQLite](https://orm.drizzle.team/docs/get-started-sqlite)).

1. Create your schema file, based off of one of the ones below.
2. Install a supported database driver to your project, like `@libsql/client`, `mysql2` or `postgres`.
3. Create a `drizzle.config.ts` file.
4. Generate the initial migration from your schema file with a command like, `drizzle-kit generate`.
5. Apply migrations by using `migrate()` function or push changes directly to your database with a command like, `drizzle-kit push`.
6. If your schemas differ from the default ones, pass them as the second parameter to the adapter.

#### Passing your own Schemas

If you want to use your own tables, you can pass them as a second argument to `DrizzleAdapter`.

```ts
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  db,
  accounts,
  sessions,
  users,
  verificationTokens
} from "./schema";

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens
  }),
  providers: []
});
```

#### Migrating your database

With your schema now described in your code, you’ll need to migrate your database to your schema. An example `migrate.ts` file looks like this:

```ts
import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, connection } from "./db";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "./drizzle" });
// Don't forget to close the connection, otherwise the script will hang
await connection.end();
```

---

[Source: https://authjs.dev/getting-started/adapters/drizzle]
