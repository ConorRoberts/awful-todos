import type { APIRoute } from "astro";
import { match } from "ts-pattern";
import { oAuthProviders, type OAuthProvider } from "~/utils/auth";

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
export const GET: APIRoute = async (context) => {
  const providerName = context.params.provider as OAuthProvider;
  if (!providerName) {
    return new Response(null, { status: 400 });
  }
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect("/", 302); // redirect to profile page
  }
  const cookieName = `${providerName}_oauth_state`;

  const [url, state] = await match(providerName)
    .with("google", () => oAuthProviders.google.getAuthorizationUrl())
    .exhaustive();

  context.cookies.set(cookieName, state, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 60 * 60,
  });
  return context.redirect(url.toString(), 302);
};
