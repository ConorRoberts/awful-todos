import { TRPCError, initTRPC } from "@trpc/server";
import { users } from "common/schema";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import type { Context } from "./trpc-context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.auth.validate();

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await ctx.db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User does not exist" });
  }

  return next({
    ctx: {
      ...ctx,
      session,
      user,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(isAuthed);
