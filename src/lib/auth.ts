import { type DefaultSession, getServerSession, type Session } from "next-auth";

import { authOptions } from "@/lib/auth-options";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      isActive: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * Description placeholder
 *
 * @export
 * @returns {Promise<null | Session>}
 */
export function auth(): Promise<null | Session> {
  return getServerSession(authOptions);
}
