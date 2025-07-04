import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL || "file:./drizzle/env-not-set.db",
  },
});
