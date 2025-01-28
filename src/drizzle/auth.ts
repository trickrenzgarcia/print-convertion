import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "./db";
import { users } from "./migrations/schema";
import { eq } from "drizzle-orm";

type User = {
  userId: string;
  username: string;
  role: string;
};

const validatePassword = async (dbPass: string, credPass: string) => {
  const isMatch = await compare(credPass, dbPass);

  if (!isMatch) return false;

  return true;
};

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        const { username, password } = credentials;
        if (!username || !password) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, username as string));

        if (!user) return null;

        if (await validatePassword(user[0].password, password as string)) {
          return {
            userId: user[0].userId,
            username: user[0].username,
            role: user[0].role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Include the user property in the session
      if (token.user) {
        session.user.userId = token.user.userId;
        session.user.username = token.user.username;
        session.user.role = token.user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add the user property to the token
      if (user) {
        token.user = user as any;
      }

      return token;
    },
    async authorized({ auth }) {
      return !!auth;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
