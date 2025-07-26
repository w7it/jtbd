import { randomUUID } from "node:crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { BoardType, NodeType } from "@/components/constants/boards.ts";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";
import { relations } from "drizzle-orm";

const relatedBoardTypeEnum = [
  BoardType.PROJECT,
  BoardType.PROJECT_INTERVIEW,
] as const;

const relatedNodeTypeEnum = [
  NodeType.STICKY_NOTE,
  NodeType.DISCUSSION,
  NodeType.PROJECT_JOB,
  NodeType.PROJECT_INTERVIEW_JOB,
] as const;

export const boards = sqliteTable("boards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Polymorphic relationship
  relatedType: text("related_type", { enum: relatedBoardTypeEnum }).notNull(),
  relatedId: text("related_id").notNull(),

  ...timestamps(),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  boardNodes: many(boardNodes),
}));

export const boardNodes = sqliteTable("board_nodes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  // Polymorphic relationship
  relatedType: text("related_type", { enum: relatedNodeTypeEnum }).notNull(),
  relatedId: text("related_id").notNull(),

  ...timestamps(),
});

export const boardStickyNotes = sqliteTable("board_sticky_notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  boardNodeId: text("board_node_id")
    .notNull()
    .references(() => boardNodes.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  color: text("color"),

  ...timestamps(),
});

export const boardDiscussion = sqliteTable("board_discussion", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  discussionId: text("discussion_id")
    .notNull()
    .references(() => boardDiscussion.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  ...timestamps(),
});
