import { TRPCError } from "@trpc/server";
import { users } from "common/schema";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "~/utils/trpc/trpc-server-config";

export const authRouter = router({
  currentUser: publicProcedure.query(async ({ ctx }) => {
    // While this procedure is public, it requires a valid session to function.
    // This is just so we're not throwing errors for nothing.
    const session = await ctx.auth.validate();

    if (!session) {
      return null;
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `User id="${session.user.id}" does not exist` });
    }

    return user;
  }),
});
