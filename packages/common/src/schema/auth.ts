import type {
  GoogleUser
} from "@lucia-auth/oauth/providers";
import { createId } from "@paralleldrive/cuid2";
import {
  type InferInsertModel,
  type InferSelectModel
} from "drizzle-orm";
import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type OAuthUserData =
  | { type: "google"; data: GoogleUser }

type OAuthProvider = OAuthUserData["type"];

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  providerId: text("provider_id").notNull().$type<OAuthProvider | "email">(),
  providerUserId: text("provider_user_id"),
  email: text("email"),
  emailVerified: int("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  oAuthUserData: blob("oauth_user_data", {
    mode: "json",
  }).$type<OAuthUserData>(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const sessions = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  activeExpires: blob("active_expires", {
    mode: "bigint",
  }).notNull(),
  idleExpires: blob("idle_expires", {
    mode: "bigint",
  }).notNull(),
});

export const keys = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  hashedPassword: text("hashed_password"),
});
