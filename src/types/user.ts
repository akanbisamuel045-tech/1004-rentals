import { type DefaultSession } from "next-auth";

/**
 * Extended user type with role field.
 */
export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extends NextAuth Session to include role and id.
 * Used with module augmentation in auth.ts.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "ADMIN";
  }
}
