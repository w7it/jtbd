import { sql } from "drizzle-orm";
import { db } from "../db.ts";
import { projects } from "./schema.ts";

export const getProjectsByUserId = db.query.projects
  .findMany({
    where: (projects, { eq, sql }) =>
      eq(projects.ownerId, sql.placeholder("userId")),
  })
  .prepare();

export const getProjectByIdAndUserId = db.query.projects
  .findFirst({
    where: (projects, { and, eq, sql }) =>
      and(
        eq(projects.id, sql.placeholder("projectId")),
        eq(projects.ownerId, sql.placeholder("userId")),
      ),
    with: {
      lastVersion: true,
    },
  })
  .prepare();

export const createEmptyProject = db
  .insert(projects)
  .values({
    ownerId: sql.placeholder("userId"),
    title: "Untitled Project",
    description: null,
  })
  .returning()
  .prepare();

export const getBoardDataById = db.query.boards
  .findFirst({
    where: (boards, { eq, sql }) => eq(boards.id, sql.placeholder("boardId")),
    with: { boardNodes: true },
  })
  .prepare();
