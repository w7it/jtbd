import { AnySQLiteColumn, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";
import { boards } from "./boards.ts";
import { relations } from "drizzle-orm";
import {
  genProjectId,
  genProjectVersionId,
  genProjectJobId,
  genProjectInterviewId,
  ProjectId,
  ProjectJobId,
  ProjectInterviewId,
  ProjectVersionId,
  ProjectInterviewJobId,
  genProjectInterviewJobId,
} from "@/lib/genId.ts";

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$type<ProjectId>()
    .$defaultFn(() => genProjectId()),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lastVersionId: text("last_version_id").references(() => projectVersions.id, {
    onDelete: "set null",
  }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  lastVersion: one(projectVersions, {
    relationName: "lastVersion",
    fields: [projects.lastVersionId],
    references: [projectVersions.id],
  }),
}));

export const projectVersions = sqliteTable("project_versions", {
  id: text("id")
    .primaryKey()
    .$type<ProjectVersionId>()
    .$defaultFn(() => genProjectVersionId()),
  projectId: text("project_id")
    .notNull()
    .references((): AnySQLiteColumn => projects.id, { onDelete: "cascade" }),
  boardId: text("board_id")
    .notNull()
    .references((): AnySQLiteColumn => boards.id, { onDelete: "cascade" }),

  version: text("version").notNull(),

  ...timestamps(),
});

export const projectVersionsRelations = relations(
  projectVersions,
  ({ one }) => ({
    project: one(projects, {
      relationName: "project",
      fields: [projectVersions.projectId],
      references: [projects.id],
    }),
  }),
);

export const projectJobs = sqliteTable("project_jobs", {
  id: text("id")
    .primaryKey()
    .$type<ProjectJobId>()
    .$defaultFn(() => genProjectJobId()),
  projectVersionId: text("project_version_id")
    .notNull()
    .references(() => projectVersions.id, { onDelete: "cascade" }),
  parentJobId: text("parent_job_id").references(
    (): AnySQLiteColumn => projectJobs.id,
    { onDelete: "set null" },
  ),

  name: text("name").notNull(),
  data: text("data", { mode: "json" })
    .notNull()
    .$type<{
      readonly when?: string;
      readonly soThat?: string;
      readonly importance?: string;
      readonly frequency?: string;
    }>()
    .$defaultFn(() => ({})),

  ...timestamps(),
});

export const projectInterviews = sqliteTable("project_interviews", {
  id: text("id")
    .primaryKey()
    .$type<ProjectInterviewId>()
    .$defaultFn(() => genProjectInterviewId()),
  projectVersionId: text("project_version_id")
    .notNull()
    .references(() => projectVersions.id, { onDelete: "cascade" }),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  description: text("description"),

  ...timestamps(),
});

export const projectInterviewJobs = sqliteTable("project_interview_jobs", {
  id: text("id")
    .primaryKey()
    .$type<ProjectInterviewJobId>()
    .$defaultFn(() => genProjectInterviewJobId()),
  projectInterviewId: text("project_interview_id")
    .notNull()
    .references(() => projectInterviews.id, { onDelete: "cascade" }),
  projectJobId: text("project_job_id").references(() => projectJobs.id, {
    onDelete: "set null",
  }),
  parentJobId: text("parent_job_id").references(
    (): AnySQLiteColumn => projectInterviewJobs.id,
    { onDelete: "set null" },
  ),

  name: text("name").notNull(),
  data: text("data", { mode: "json" })
    .notNull()
    .$type<{
      readonly job?: string;
    }>()
    .$defaultFn(() => ({})),

  ...timestamps(),
});
