import { authRouter } from "./routers/auth-router";
import { todoRouter } from "./routers/todo-router";
import { router } from "./trpc-server-config";

export const appRouter = router({
  auth: authRouter,
  todos: todoRouter,
});

export type AppRouter = typeof appRouter;
