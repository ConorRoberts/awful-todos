import { createDbClient, createLibsqlClient } from "common/client";

export const libsqlClient = createLibsqlClient({
  url: import.meta.env.DATABASE_URL,
  authToken: import.meta.env.DATABASE_AUTH_TOKEN,
});

export const db = createDbClient({ url: import.meta.env.DATABASE_URL, authToken: import.meta.env.DATABASE_AUTH_TOKEN });
