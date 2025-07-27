import { sqliteTable } from "drizzle-orm/sqlite-core";
import { text } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  name: text("name").primaryKey(),
  value: text("value"),
});
