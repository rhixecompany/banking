# Get Started with Drizzle and Neon

## Basic file structure

This is the basic file structure of the project. In the `database` directory, we have table definition in `schema.ts`. In `drizzle` folder there are sql migration file and snapshots.

```
📦 <project root>
├ 📂 drizzle
├ 📂 database
│   └ 📜 schema.ts
├ 📜 index.ts
├ 📜 .env
├ 📜 drizzle.config.ts
├ 📜 package.json
└ 📜 tsconfig.json
```

## Step 1 - Install @neondatabase/serverless package

```sh
npm i drizzle-orm @neondatabase/serverless dotenv
npm i -D drizzle-kit tsx
```

## Step 2 - Setup connection variables

Create a `.env` file in the root of your project and add your database connection variable:

```
DATABASE_URL=
```

## Step 3 - Connect Drizzle ORM to the database

Create an `index.ts` file in the `src` directory and initialize the connection:

```ts
import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.DATABASE_URL);
```

If you need a synchronous connection, you can use the additional connection API:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

## Step 4 - Create a table

Create a `schema.ts` file in the `database` directory and declare your table:

```ts
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique()
});
```

## Step 5 - Setup Drizzle config file

Drizzle config - a configuration file that is used by [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview) and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
```

## Step 6 - Applying changes to the database

You can directly apply changes to your database using the `drizzle-kit push` command. This is a convenient method for quickly testing new schema designs or modifications in a local development environment, allowing for rapid iterations without the need to manage migration files:

```sh
pnpm exec drizzle-kit push
```

> **TIP:** Alternatively, you can generate migrations using the `drizzle-kit generate` command and then apply them using the `drizzle-kit migrate` command:
>
> ```sh
> pnpm exec drizzle-kit generate
> pnpm exec drizzle-kit migrate
> ```

## Step 7 - Seed and Query the database

Let’s update the `scripts/seed/run.ts` file with queries to create, read, update, and delete users:

```ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { usersTable } from "./database/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com"
  };
  await db.insert(usersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(usersTable)
    .set({ age: 31 })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");
}

main();
```

## Step 8 - Run run.ts file

To run any TypeScript files, you have several options, but let’s stick with one: using `tsx`.

You’ve already installed `tsx`, so we can run our queries now:

```sh
pnpm exec tsx scripts/seed/run.ts
```

> **TIP:** We suggest using `bun` to run TypeScript files. With `bun`, such scripts can be executed without issues or additional settings, regardless of whether your project is configured with CommonJS (CJS), ECMAScript Modules (ESM), or any other module format. To run a script with `bun`, use the following command:
>
> ```sh
> bun scripts/seed/run.ts
> ```

If you don’t have bun installed, check the [Bun installation docs](https://bun.sh/docs/installation#installing).

---

This guide assumes familiarity with:

- [dotenv](https://www.npmjs.com/package/dotenv) - package for managing environment variables
- [tsx](https://tsx.is/) - package for running TypeScript files
- [Neon](https://neon.tech/docs/introduction) - serverless Postgres platform

Drizzle has native support for Neon connections with the `neon-http` and `neon-websockets` drivers. These use the neon-serverless driver under the hood.

With the `neon-http` and `neon-websockets` drivers, you can access a Neon database from serverless environments over HTTP or WebSockets instead of TCP. Querying over HTTP is faster for single, non-interactive transactions.

If you need session or interactive transaction support, or a fully compatible drop-in replacement for the `pg` driver, you can use the WebSocket-based `neon-serverless` driver. You can connect to a Neon database directly using [Postgres](https://orm.drizzle.team/docs/get-started/postgresql-new).
