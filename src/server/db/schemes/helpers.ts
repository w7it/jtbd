import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = ({
  withDeletedAt = false,
}: { withDeletedAt?: boolean } = {}) => ({
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  ...(withDeletedAt
    ? {
        deletedAt: integer("deleted_at", { mode: "timestamp" })
          .$defaultFn(() => new Date())
          .notNull(),
      }
    : {}),
});
