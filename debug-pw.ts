import bcrypt from "bcrypt";
import { config } from "dotenv";
import "dotenv/config";
import { eq } from "drizzle-orm";

import { db } from "./src/database/db";
import { users } from "./src/database/schema";
config({ path: ".env.local" });

async function main() {
  // Get stored password hash from DB
  const result = await db
    .select({ email: users.email, password: users.password })
    .from(users)
    .where(eq(users.email, "seed-user@example.com"));

  const storedHash = result[0]?.password;
  const plainPassword = "password123";

  console.log("=== DEBUG: Password Verification ===");
  console.log("Stored hash exists:", !!storedHash);
  console.log("Stored hash preview:", storedHash?.slice(0, 20) + "...");
  console.log("Hash starts with $2:", storedHash?.startsWith("$2"));

  // Test bcrypt compare
  if (storedHash) {
    const isValid = await bcrypt.compare(plainPassword, storedHash);
    console.log("bcrypt.compare result:", isValid);
  }
}

main().catch(console.error);
