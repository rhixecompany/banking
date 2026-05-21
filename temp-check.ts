import "dotenv/config";
import { db } from "./src/database/db";
import { users } from "./src/database/schema";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Users in database:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
