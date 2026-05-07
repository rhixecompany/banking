import "dotenv/config";
import { db } from "./src/database/db";
import { sql } from "drizzle-orm";

async function main() {
  await db.execute(sql.raw(`
    TRUNCATE TABLE
      errors,
      recipients,
      transactions,
      wallets,
      user_profiles,
      authenticator,
      "session",
      account,
      "verificationToken",
      users
    RESTART IDENTITY CASCADE;
  `));
  console.log("Tables truncated");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });