import { db } from "@/database/db";
import { users } from "@/database/schema";
import { env } from "@/lib/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  type NextAuthOptions,
  type User as NextAuthUser,
  type Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: { strategy: "database" as const },
  pages: {
    signIn: "/(auth)/sign-in",
    signOut: "/(auth)/sign-out",
    error: "/(auth)/error",
  },
  providers: [
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
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
        const valid = await compare(credentials.password, user.password);
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
    async session({ session, user }: { session: Session; user: NextAuthUser }) {
      if (session.user && user) {
        const sUser = session.user as typeof session.user & {
          id?: string;
          isAdmin?: boolean;
          isActive?: boolean;
        };
        sUser.id = user.id as string;
        sUser.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        sUser.isActive = (user as { isActive?: boolean }).isActive ?? true;
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
          const { hash } = await import("bcryptjs");
          const hashedPassword = await hash(Math.random().toString(36), 12);
          await db.insert(users).values({
            email: user.email,
            name: user.name,
            image: user.image,
            password: hashedPassword,
          });
        }
      }
      return true;
    },
  },
};

export default authOptions;
