import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authConfig } from "@/auth.config";
import { verifyPassword } from "@/lib/admin/password";
import { findAdminUserByEmail, isValidBcryptHash } from "@/lib/admin/users";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        try {
          const parsed = credentialsSchema.safeParse(rawCredentials);
          if (!parsed.success) {
            return null;
          }

          const user = findAdminUserByEmail(parsed.data.email);
          if (!user) {
            return null;
          }

          if (!isValidBcryptHash(user.passwordHash)) {
            console.error(
              "[auth] Admin password hash is not valid bcrypt (often corrupted by dotenv $ expansion). Re-run npm run admin:hash-password and use ADMIN_PASSWORD_HASH=bcrypt64:...",
            );
            return null;
          }

          const valid = await verifyPassword(parsed.data.password, user.passwordHash);
          if (!valid) {
            return null;
          }

          return {
            id: user.email.toLowerCase(),
            email: user.email.toLowerCase(),
            name: user.email.toLowerCase(),
          };
        } catch (error) {
          console.error("[auth] Admin authorize failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = String(token.email);
      }
      return session;
    },
  },
});
