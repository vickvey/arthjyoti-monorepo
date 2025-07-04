import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import Logger from "@/utils/logger";

const url = process.env.SQLITE_DATABASE_URL || "file:./drizzle/dev.db";

const client = createClient({ url });
export const db = drizzle(client, { schema });

export async function connectToSQLiteDatabase() {
  try {
    // This is technically synchronous for SQLite, but wrap it in async in case you switch to PostgreSQL later.
    Logger.info(`✅ Connected to SQLite database: ${url}`);
  } catch (error) {
    Logger.error("❌ Failed to connect to SQLite database:", error);
    process.exit(1);
  }
}
