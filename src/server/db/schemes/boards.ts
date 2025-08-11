import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { BoardType, NodeType, StickyNoteData } from "@/constants/boards.ts";
import { users } from "./auth.ts";
import { timestamps } from "./helpers.ts";
import { relations } from "drizzle-orm";
import { projectInterviewJobs, projectJobs } from "./projects.ts";
import {
  BoardId,
  BoardNodeId,
  BoardDiscussionId,
  BoardStickyNoteId,
  BoardDiscussionReplyId,
  genBoardId,
  genBoardNodeId,
  genBoardStickyNoteId,
  genBoardDiscussionId,
  genBoardDiscussionReplyId,
} from "@/lib/genId.ts";

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
    .$type<BoardId>()
    .$defaultFn(() => genBoardId()),

  // Polymorphic relationship
  relatedType: text("related_type", { enum: relatedBoardTypeEnum }).notNull(),
  relatedId: text("related_id").notNull(),

  ...timestamps(),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  nodes: many(boardNodes),
}));

export const boardNodes = sqliteTable("board_nodes", {
  id: text("id")
    .primaryKey()
    .$type<BoardNodeId>()
    .$defaultFn(() => genBoardNodeId()),

  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  // Polymorphic relationship
  relatedType: text("related_type", { enum: relatedNodeTypeEnum }).notNull(),
  relatedId: text("related_id").notNull(),

  x: integer("x").notNull().default(0),
  y: integer("y").notNull().default(0),

  ...timestamps(),
});

export const boardNodesRelations = relations(boardNodes, ({ one }) => ({
  board: one(boards, {
    fields: [boardNodes.boardId],
    references: [boards.id],
  }),

  stickyNoteData: one(boardStickyNotes, {
    fields: [boardNodes.relatedId],
    references: [boardStickyNotes.id],
  }),
  projectJobData: one(projectJobs, {
    fields: [boardNodes.relatedId],
    references: [projectJobs.id],
  }),
  projectInterviewJobData: one(projectInterviewJobs, {
    fields: [boardNodes.relatedId],
    references: [projectInterviewJobs.id],
  }),
  boardDiscussion: one(boardDiscussions, {
    fields: [boardNodes.relatedId],
    references: [boardDiscussions.id],
  }),
}));

export const boardStickyNotes = sqliteTable("board_sticky_notes", {
  id: text("id")
    .primaryKey()
    .$type<BoardStickyNoteId>()
    .$defaultFn(() => genBoardStickyNoteId()),

  boardNodeId: text("board_node_id")
    .notNull()
    .references(() => boardNodes.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  color: text("color")
    .$type<StickyNoteData["color"]>()
    .$defaultFn(() => "yellow"),
  size: text("size")
    .$type<StickyNoteData["size"]>()
    .$defaultFn(() => "md"),

  ...timestamps(),
});

export const boardDiscussions = sqliteTable("board_discussion", {
  id: text("id")
    .primaryKey()
    .$type<BoardDiscussionId>()
    .$defaultFn(() => genBoardDiscussionId()),

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
    .$type<BoardDiscussionReplyId>()
    .$defaultFn(() => genBoardDiscussionReplyId()),

  discussionId: text("discussion_id")
    .notNull()
    .references(() => boardDiscussions.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  ...timestamps(),
});
