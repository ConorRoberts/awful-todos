import { createId } from "@paralleldrive/cuid2";
import type { inferAsyncReturnType } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { APIRoute } from "astro";
import { db } from "~/utils/db";

export const createContext = async (_opts: FetchCreateContextFnOptions, context: Parameters<APIRoute>[0]) => {
  return {
    auth: context.locals.auth,
    db,
    timestamp: Date.now(),
    context: { ...context, reqId: createId() },
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
