import { nanoid } from "nanoid";
import z from "zod";

enum IdPrefix {
  USER = "u",
  BOARD = "b",
  BOARD_NODE = "bn",
  BOARD_STICKY_NOTE = "bsn",
  BOARD_DISCUSSION = "bd",
  BOARD_DISCUSSION_REPLY = "bdr",
  PROJECT = "p",
  PROJECT_VERSION = "pv",
  PROJECT_JOB = "pj",
  PROJECT_INTERVIEW = "pi",
  PROJECT_INTERVIEW_JOB = "pij",
  INSTALLATION = "ins",
}

function genId(prefix: string): string {
  return `${prefix}_${nanoid()}`;
}

export type UserId = z.infer<typeof zUserId>;
export const genUserId = () => genId(IdPrefix.USER) as UserId;
export const zUserId = z.templateLiteral([`${IdPrefix.USER}_`, z.string()]);

export type BoardId = z.infer<typeof zBoardId>;
export const genBoardId = () => genId(IdPrefix.BOARD) as BoardId;
export const zBoardId = z.templateLiteral([`${IdPrefix.BOARD}_`, z.string()]);

export type BoardNodeId = z.infer<typeof zBoardNodeId>;
export const genBoardNodeId = () => genId(IdPrefix.BOARD_NODE) as BoardNodeId;
export const zBoardNodeId = z.templateLiteral([
  `${IdPrefix.BOARD_NODE}_`,
  z.string(),
]);

export type BoardStickyNoteId = z.infer<typeof zBoardStickyNoteId>;
export const genBoardStickyNoteId = () =>
  genId(IdPrefix.BOARD_STICKY_NOTE) as BoardStickyNoteId;
export const zBoardStickyNoteId = z.templateLiteral([
  `${IdPrefix.BOARD_STICKY_NOTE}_`,
  z.string(),
]);

export type BoardDiscussionId = z.infer<typeof zBoardDiscussionId>;
export const genBoardDiscussionId = () =>
  genId(IdPrefix.BOARD_DISCUSSION) as BoardDiscussionId;
export const zBoardDiscussionId = z.templateLiteral([
  `${IdPrefix.BOARD_DISCUSSION}_`,
  z.string(),
]);

export type BoardDiscussionReplyId = z.infer<typeof zBoardDiscussionReplyId>;
export const genBoardDiscussionReplyId = () =>
  genId(IdPrefix.BOARD_DISCUSSION_REPLY) as BoardDiscussionReplyId;
export const zBoardDiscussionReplyId = z.templateLiteral([
  `${IdPrefix.BOARD_DISCUSSION_REPLY}_`,
  z.string(),
]);

export type ProjectId = z.infer<typeof zProjectId>;
export const genProjectId = () => genId(IdPrefix.PROJECT) as ProjectId;
export const zProjectId = z.templateLiteral([
  `${IdPrefix.PROJECT}_`,
  z.string(),
]);

export type ProjectVersionId = z.infer<typeof zProjectVersionId>;
export const genProjectVersionId = () =>
  genId(IdPrefix.PROJECT_VERSION) as ProjectVersionId;
export const zProjectVersionId = z.templateLiteral([
  `${IdPrefix.PROJECT_VERSION}_`,
  z.string(),
]);

export type ProjectJobId = z.infer<typeof zProjectJobId>;
export const genProjectJobId = () =>
  genId(IdPrefix.PROJECT_JOB) as ProjectJobId;
export const zProjectJobId = z.templateLiteral([
  `${IdPrefix.PROJECT_JOB}_`,
  z.string(),
]);

export type ProjectInterviewId = z.infer<typeof zProjectInterviewId>;
export const genProjectInterviewId = () =>
  genId(IdPrefix.PROJECT_INTERVIEW) as ProjectInterviewId;
export const zProjectInterviewId = z.templateLiteral([
  `${IdPrefix.PROJECT_INTERVIEW}_`,
  z.string(),
]);

export type ProjectInterviewJobId = z.infer<typeof zProjectInterviewJobId>;
export const genProjectInterviewJobId = () =>
  genId(IdPrefix.PROJECT_INTERVIEW_JOB) as ProjectInterviewJobId;
export const zProjectInterviewJobId = z.templateLiteral([
  `${IdPrefix.PROJECT_INTERVIEW_JOB}_`,
  z.string(),
]);

export type InstallationId = z.infer<typeof zInstallationId>;
export const genInstallationId = () =>
  genId(IdPrefix.INSTALLATION) as InstallationId;
export const zInstallationId = z.templateLiteral([
  `${IdPrefix.INSTALLATION}_`,
  z.string(),
]);
