import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { DefaultSession, NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/database/db";
import { account, session, users, verificationToken } from "@/database/schema";
import { env } from "@/lib/env";

function generateSecurePassword(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: account,
    sessionsTable: session,
    verificationTokensTable: verificationToken,
  }),
  session: { strategy: "database" as const },
  pages: {
    signIn: "/(auth)/sign-in",
    signOut: "/(auth)/sign-out",
    error: "/(auth)/error",
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
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((r) => r[0]);
        if (!user || !user.isActive) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          image: user.image,
          isAdmin: user.isAdmin ?? false,
          isActive: user.isActive ?? true,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      if (session.user && user) {
        const extUser = session.user as DefaultSession["user"] & {
          id?: string;
          isAdmin?: boolean;
          isActive?: boolean;
        };
        extUser.id = user.id as string;
        extUser.isAdmin =
          (user as unknown as { isAdmin?: boolean }).isAdmin ?? false;
        extUser.isActive =
          (user as unknown as { isActive?: boolean }).isActive ?? true;
      }
      return session;
    },
    async signIn({ user, account }) {
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
            name: user.name,
            image: user.image,
            password: hashed,
          });
        }
      }
      return true;
    },
  },
};
