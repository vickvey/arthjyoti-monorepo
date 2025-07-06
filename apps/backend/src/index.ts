import { config } from "dotenv";
config({
  path: ".env",
});
import { createApp } from "./bootstrap";
import Logger from "@/utils/logger";
import { connectToSQLiteDatabase } from "./db";

const app = createApp();

app.listen(process.env.PORT || 8000, async (err) => {
  if (err) {
    Logger.error("FINAL ERROR DETECTION: ", err.message, err.stack);
    process.exit(1);
  }

  Logger.info(
    `Finance Manager API is running at port ${process.env.PORT || 8000} ...`
  );

  await connectToSQLiteDatabase();
});
