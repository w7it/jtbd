import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { admin } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db } from "./db.ts";
import { getWebRequest } from "@tanstack/react-start/server";
import { nanoid } from "nanoid";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  plugins: [reactStartCookies(), admin()],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    cookiePrefix: "jtbd",
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const isSignUp = ctx.path.startsWith("/sign-up");
      const email = ctx.body?.email;
      if (!email) return;

      const { getAdminEmail, writeInstallSettings } = await import(
        "./db/queries.ts"
      );
      const result = await getAdminEmail.execute();
      const adminEmail = result?.value;
      if (adminEmail === email) return;

      // Run installation for first sign up
      if (isSignUp && !adminEmail) {
        const installationId = nanoid();
        await writeInstallSettings.execute({
          installationId,
          adminEmail: email,
        });
        return;
      }

      throw new APIError("BAD_REQUEST", {
        message: isSignUp
          ? "Sign up is disabled for installed instance"
          : "Only admin can sign in",
      });
    }),
  },
});

export const getSession = () => {
  const { headers } = getWebRequest();
  return auth.api.getSession({ headers });
};

export const getUserId = async () => {
  const session = await getSession();
  return session?.user.id;
};
