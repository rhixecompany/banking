import type { DefaultSession, NextAuthOptions, Session, User } from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/database/db";
import {
  account,
  authenticator,
  session,
  users,
  verificationToken,
} from "@/database/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

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
    authenticatorsTable: authenticator,
    sessionsTable: session,
    usersTable: users,
    verificationTokensTable: verificationToken,
  }),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean } & User).isAdmin ?? false;
        token.isActive =
          (user as { isActive?: boolean } & User).isActive ?? true;
      }
      return token;
    },
    session({
      session,
      token,
    }: {
      session: Session;
      token: { id?: string; isAdmin?: boolean; isActive?: boolean };
    }): Promise<Session> | Session {
      if (session.user) {
        const extUser = session.user as {
          id?: string;
          isAdmin?: boolean;
          isActive?: boolean;
        } & DefaultSession["user"];
        extUser.id = token.id as string;
        extUser.isAdmin = token.isAdmin ?? false;
        extUser.isActive = token.isActive ?? true;
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
    error: "/error",
    signIn: "/sign-in",
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

        // Debug logging for E2E investigations: log lookup result and bcrypt outcome.
        // Keep logs minimal and remove after debugging is complete.
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((r) => r[0]);

        try {
          logger.info(
            `[E2E-DEBUG] authorize: lookup email=${credentials.email} found=${!!user}`,
          );
        } catch {
          // intentionally swallow logging errors in edge cases
        }

        if (!user?.isActive || !user.password) {
          try {
            logger.info(
              `[E2E-DEBUG] authorize: rejecting - isActive=${!!user?.isActive} hasPassword=${!!user?.password}`,
            );
          } catch {
            // intentionally swallow logging errors
          }
          return null;
        }

        // Compare password and log result; keep comparison result usage
        // eslint-disable-next-line no-useless-assignment
        let valid = false;
        try {
          valid = await bcrypt.compare(credentials.password, user.password);
        } catch (e) {
          logger.error("[E2E-DEBUG] authorize: bcrypt.compare threw", e);
          return null;
        }
        // Log comparison result in a separate block to avoid unused-assignment warnings
        try {
          // Use ternary to produce a value used immediately to avoid unused-assignment lint
          void (valid
            ? logger.info("[E2E-DEBUG] authorize: bcrypt.compare result=true")
            : logger.info(
                "[E2E-DEBUG] authorize: bcrypt.compare result=false",
              ));
        } catch {
          // intentionally swallow logging errors
        }

        if (!valid) {
          try {
            logger.info(
              "[E2E-DEBUG] authorize: rejecting - invalid credentials",
            );
          } catch {
            // intentionally swallow logging errors
          }
          return null;
        }

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
  session: { strategy: "jwt" as const },
};
