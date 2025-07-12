import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

export const db = drizzle(process.env.DB_FILE_NAME!);

await migrate(db, {
  migrationsFolder: "./src/server/db/migrations",
});
