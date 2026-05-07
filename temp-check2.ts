import "dotenv/config";
import { db } from "./src/database/db";
import { users } from "./src/database/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Try to find the seed user using the same query as authorize
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, "seed-user@example.com"))
    .then((r) => r[0]);

  console.log("User found:", user ? "YES" : "NO");
  if (user) {
    console.log("  email:", user.email);
    console.log("  isActive:", user.isActive);
    console.log("  has password:", !!user.password);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });