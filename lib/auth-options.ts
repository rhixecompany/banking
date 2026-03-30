import type { DefaultSession, NextAuthOptions, Session, User } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/database/db";
import { account, session, users, verificationToken } from "@/database/schema";
import { env } from "@/lib/env";

/**
 * Description placeholder
 *
 * @returns {string}
 */
function generateSecurePassword(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Description placeholder
 *
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    accountsTable: account,
    sessionsTable: session,
    usersTable: users,
    verificationTokensTable: verificationToken,
  }),
  callbacks: {
    session({
      session,
      user,
    }: {
      session: Session;
      user: User;
    }): Promise<Session> | Session {
      if (session.user && user) {
        const extUser = session.user as {
          id?: string;
          isAdmin?: boolean;
          isActive?: boolean;
        } & DefaultSession["user"];
        extUser.id = user.id as string;
        extUser.isAdmin =
          (user as unknown as { isAdmin?: boolean }).isAdmin ?? false;
        extUser.isActive =
          (user as unknown as { isActive?: boolean }).isActive ?? true;
      }
      return session;
    },
    async signIn({ account, user }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (user.email) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email));
        if (!existingUser) {
          const tempPassword = generateSecurePassword();
          const hashed = await bcrypt.hash(tempPassword, 12);
          await db.insert(users).values({
            email: user.email,
            image: user.image,
            name: user.name,
            password: hashed,
          });
        }
      }
      return true;
    },
  },
  pages: {
    error: "/(auth)/error",
    signIn: "/(auth)/sign-in",
    signOut: "/(auth)/sign-out",
  },
  providers: [
    ...(env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((r) => r[0]);
        if (!user?.isActive || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          email: user.email,
          id: String(user.id),
          image: user.image,
          isActive: user.isActive ?? true,
          isAdmin: user.isAdmin ?? false,
          name: user.name,
        };
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
    }),
  ],
  session: { strategy: "database" as const },
};
