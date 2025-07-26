import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { admin } from "better-auth/plugins";
import { db } from "./db.ts";
import { getWebRequest } from "@tanstack/react-start/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),
  plugins: [reactStartCookies(), admin()],
  emailAndPassword: {
    enabled: true,
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
