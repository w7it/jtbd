import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";
import { boards } from "./boards.ts";

export const localGraphs = sqliteTable("local_graphs", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const localJobs = sqliteTable("local_jobs", {
  id: text("id").primaryKey(),
  localGraphId: text("local_graph_id")
    .notNull()
    .references(() => localGraphs.id, { onDelete: "cascade" }),
  parentJobId: text("parent_job_id").references(() => localJobs.id, {
    onDelete: "set null",
  }),

  name: text("name").notNull(),
  data: text("data", { mode: "json" }).notNull(),

  ...timestamps(),
});

export const aggregatedGraphs = sqliteTable("aggregated_graphs", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const aggregatedGraphVersions = sqliteTable(
  "aggregated_graph_versions",
  {
    id: text("id").primaryKey(),
    aggregatedGraphId: text("aggregated_graph_id")
      .notNull()
      .references(() => aggregatedGraphs.id, { onDelete: "cascade" }),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),

    version: text("version").notNull(),

    ...timestamps(),
  },
);

export const aggregatedJobs = sqliteTable("aggregated_jobs", {
  id: text("id").primaryKey(),
  aggregatedGraphVersionId: text("aggregated_graph_version_id")
    .notNull()
    .references(() => aggregatedGraphVersions.id, { onDelete: "cascade" }),
  parentJobId: text("parent_job_id").references(() => aggregatedJobs.id, {
    onDelete: "set null",
  }),

  name: text("name").notNull(),
  data: text("data", { mode: "json" }).notNull(),

  ...timestamps(),
});

export const aggregatedGraphLocalGraphs = sqliteTable(
  "aggregated_graph_local_graphs",
  {
    id: text("id").primaryKey(),
    localGraphId: text("local_graph_id")
      .notNull()
      .references(() => localGraphs.id, { onDelete: "cascade" }),
    aggregatedGraphVersionId: text("aggregated_graph_version_id")
      .notNull()
      .references(() => aggregatedGraphVersions.id, { onDelete: "cascade" }),

    ...timestamps(),
  },
);

export const aggregatedJobLocalJobs = sqliteTable("aggregated_job_local_jobs", {
  id: text("id").primaryKey(),
  aggregatedJobId: text("aggregated_job_id")
    .notNull()
    .references(() => aggregatedJobs.id, { onDelete: "cascade" }),
  localJobId: text("local_job_id")
    .notNull()
    .references(() => localJobs.id, { onDelete: "cascade" }),

  ...timestamps(),
});
