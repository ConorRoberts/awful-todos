import { OAuthRequestError } from "@lucia-auth/oauth";

import { createId } from "@paralleldrive/cuid2";
import type { APIRoute } from "astro";
import type { OAuthUserData } from "common/schema";
import type { User } from "lucia";
import { match } from "ts-pattern";
import { auth, oAuthProviders, type OAuthProvider } from "~/utils/auth";
import { AFTER_LOGIN_URL } from "~/utils/constants/auth-urls";

const getUser = async (args: { provider: OAuthProvider; code: string }): Promise<User> => {
  return await match(args.provider)
    .with("google", async (provider_id) => {
      const { getExistingUser, googleUser, createUser } = await oAuthProviders.google.validateCallback(args.code);

      const existingUser = await getExistingUser();

      if (existingUser) {
        return existingUser;
      }

      const oAuthData: OAuthUserData = { type: provider_id, data: googleUser };

      const user = await createUser({
        attributes: {
          id: createId(),
          name: `${googleUser.given_name} ${googleUser.family_name}`,
          provider_id,
          email_verified: false,
          provider_user_id: googleUser.sub,
          email: googleUser.email ?? null,
          oauth_user_data: JSON.stringify(oAuthData),
        },
      });

      return user;
    })
    .exhaustive();
};

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
export const GET: APIRoute = async (context) => {
  const providerName = context.params.provider as OAuthProvider | undefined;

  if (!providerName) {
    return context.redirect("/", 302);
  }

  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect(AFTER_LOGIN_URL, 302);
  }

  const storedState = context.cookies.get(`${providerName}_oauth_state`)?.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response("Invalid state", {
      status: 400,
    });
  }

  try {
    const user = await getUser({ provider: providerName, code });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    context.locals.auth.setSession(session);

    return context.redirect(AFTER_LOGIN_URL, 302);
  } catch (e) {
    console.log(e);
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(e.message, {
        status: 400,
      });
    }
    return new Response("Unknown Error", {
      status: 500,
    });
  }
};
