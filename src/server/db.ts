import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./db/schema.ts";

export const db = drizzle(process.env.DB_FILE_NAME!, {
  schema,
});

await migrate(db, {
  migrationsFolder: "./src/server/db/migrations",
});
