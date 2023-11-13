import { todos } from "common/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, router } from "~/utils/trpc/trpc-server-config";

export const todoRouter = router({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.insert(todos).values({ name: "", userId: ctx.user.id }).returning().get();
  }),
  update: protectedProcedure
    .input(z.object({ isComplete: z.boolean(), name: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(todos)
        .set({ name: input.name, isComplete: input.isComplete })
        .where(and(eq(todos.userId, ctx.user.id), eq(todos.id, input.id)))
        .returning()
        .get();
    }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.db
      .delete(todos)
      .where(and(eq(todos.userId, ctx.user.id), eq(todos.id, input.id)))
      .returning()
      .get();
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todos.findMany({ where: eq(todos.userId, ctx.user.id) });
  }),
});
