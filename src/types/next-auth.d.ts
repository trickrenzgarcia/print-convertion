import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      userId: string;
      username: string;
      role: string;
    };
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      username: string;
      role: string;
    };
  }
}
