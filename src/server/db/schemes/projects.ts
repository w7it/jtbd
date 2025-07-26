import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";
import { boards } from "./boards.ts";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const projectVersions = sqliteTable("project_versions", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  relatedId: text("related_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  version: text("version").notNull(),

  ...timestamps(),
});

export const projectJobs = sqliteTable("project_jobs", {
  id: text("id").primaryKey(),
  projectVersionId: text("project_version_id")
    .notNull()
    .references(() => projectVersions.id, { onDelete: "cascade" }),
  parentJobId: text("parent_job_id").references(() => projectJobs.id, {
    onDelete: "set null",
  }),

  name: text("name").notNull(),
  data: text("data", { mode: "json" }).notNull(),

  ...timestamps(),
});

export const projectInterviews = sqliteTable("project_interviews", {
  id: text("id").primaryKey(),
  projectVersionId: text("project_version_id")
    .notNull()
    .references(() => projectVersions.id, { onDelete: "cascade" }),
  relatedId: text("related_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const projectInterviewJobs = sqliteTable("project_interview_jobs", {
  id: text("id").primaryKey(),
  projectInterviewId: text("project_interview_id")
    .notNull()
    .references(() => projectInterviews.id, { onDelete: "cascade" }),
  projectJobId: text("project_job_id")
    .references(() => projectJobs.id, { onDelete: "set null" }),
  parentJobId: text("parent_job_id").references(() => projectInterviewJobs.id, {
    onDelete: "set null",
  }),

  name: text("name").notNull(),
  data: text("data", { mode: "json" }).notNull(),

  ...timestamps(),
});
