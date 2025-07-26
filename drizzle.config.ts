import assert from "node:assert";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DB_FILE_NAME;
assert(url, "DB_FILE_NAME is not set");

export default defineConfig({
  out: "./src/server/db/migrations",
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: { url },
});
