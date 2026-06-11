import { eq } from "drizzle-orm";

import { db } from "../src/database/db";
import { users } from "../src/database/schema";

async function main() {
  const result = await db
    .select({ email: users.email, password: users.password })
    .from(users)
    .where(eq(users.email, "seed-user@example.com"));

  console.log("Email:", result[0]?.email);
  console.log("Password field type:", typeof result[0]?.password);
  console.log("Password value:", result[0]?.password);
  console.log("Is bcrypt format:", result[0]?.password?.startsWith("$2"));
}

main().catch(console.error);
