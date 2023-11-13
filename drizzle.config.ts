import type { Config } from "drizzle-kit";

export default {
  schema: "./packages/common/src/schema.ts",
  out: "./packages/common/migrations",
} satisfies Config;
