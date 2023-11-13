import { createId } from "@paralleldrive/cuid2";
import {
  type InferInsertModel,
  type InferSelectModel
} from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  isComplete:int("is_complete",{mode:"boolean"}).notNull().default(false),
  userId:text("user_id").notNull(),
  createdAt:int("created_at",{mode:"timestamp_ms"}).notNull().$defaultFn(()=>new Date()),
  updatedAt:int("updated_at",{mode:"timestamp_ms"}).notNull().$defaultFn(()=>new Date())
});

export type Todo = InferSelectModel<typeof todos>;
export type NewTodo = InferInsertModel<typeof todos>;

