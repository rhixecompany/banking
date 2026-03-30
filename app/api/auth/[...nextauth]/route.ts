import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth-options";

/**
 * Description placeholder
 *
 * @type {*}
 */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
