import { db } from "@/server/db.ts";
import * as schema from "@/server/db/schema.ts";
import { test as setup } from "@playwright/test";

setup("setup sqlite database", async ({}) => {
  const tableSchema = db._.schema;
  if (!tableSchema) throw new Error("No table schema found");

  console.log("🗑️  Emptying the entire database");

  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return table.tsName;
  });
  console.log(queries);
  queries.forEach(async (query) => {
    const schemaToDelete = schema[query];
    if (!schemaToDelete) throw new Error(`No schema found for ${query}`);
    await db.delete(schemaToDelete);
  });
});
