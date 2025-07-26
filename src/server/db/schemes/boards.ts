import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";

export enum NodeType {
  STICKY_NOTE = "STICKY_NOTE",
  PROJECT_JOB = "PROJECT_JOB",
  PROJECT_INTERVIEW_JOB = "PROJECT_INTERVIEW_JOB",
  DISCUSSION = "DISCUSSION",
}

const relatedTypeEnum = [
  NodeType.STICKY_NOTE,
  NodeType.DISCUSSION,
  NodeType.PROJECT_JOB,
  NodeType.PROJECT_INTERVIEW_JOB,
] as const;

export const boards = sqliteTable("boards", {
  id: text("id").primaryKey(),

  ...timestamps(),
});

export const boardNodes = sqliteTable("board_nodes", {
  id: text("id").primaryKey(),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  // Polymorphic relationship
  relatedType: text("related_type", { enum: relatedTypeEnum }).notNull(),
  relatedId: text("related_id").notNull(),

  ...timestamps(),
});

export const boardStickyNotes = sqliteTable("board_sticky_notes", {
  id: text("id").primaryKey(),
  boardNodeId: text("board_node_id")
    .notNull()
    .references(() => boardNodes.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  color: text("color"),

  ...timestamps(),
});

export const boardDiscussion = sqliteTable("board_discussion", {
  id: text("id").primaryKey(),
  boardNodeId: text("board_node_id")
    .notNull()
    .references(() => boardNodes.id, { onDelete: "cascade" }),
  topicStarterId: text("topic_starter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  isResolved: integer("is_resolved", { mode: "boolean" })
    .notNull()
    .default(false),

  ...timestamps(),
});

export const boardDiscussionReplies = sqliteTable("board_discussion_replies", {
  id: text("id").primaryKey(),
  discussionId: text("discussion_id")
    .notNull()
    .references(() => boardDiscussion.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  ...timestamps(),
});
