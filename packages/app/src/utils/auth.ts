import { libsql } from "@lucia-auth/adapter-sqlite";
import { google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { libsqlClient } from "~/utils/db";

// https://lucia-auth.com

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  adapter: libsql(libsqlClient, {
    key: "user_key",
    session: "user_session",
    user: "user",
  }),
  middleware: astro(),

  getUserAttributes: (data) => {
    return {
      id: data.id,
      name: data.name,
    };
  },
});

export const oAuthProviders = {
  google: google(auth, {
    clientId: import.meta.env.GOOGLE_CLIENT_ID,
    clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${import.meta.env.PUBLIC_WEBSITE_URL}/login/google/callback`,
  }),
} satisfies Record<string, any>;

export type OAuthProvider = keyof typeof oAuthProviders;

export type Auth = typeof auth;
