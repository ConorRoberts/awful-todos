import type { MiddlewareResponseHandler } from "astro";
import { auth } from "./utils/auth";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  console.log("here");
  // Redirect non-www to wwww. This fixes some redirect bugs with OAuth
  if (!import.meta.env.DEV && !context.url.host.startsWith("www")) {
    context.url.host = `www.${context.url.host}`;
    return context.redirect(context.url.toString());
  }

  try {
    context.locals.auth = auth.handleRequest(context);
  } catch (error) {
    console.error(error);
  }
  return await next();
};
