import {
  zBoardStickyNoteId,
  zBoardDiscussionId,
  zProjectInterviewJobId,
  zProjectJobId,
  zBoardNodeId,
} from "@/lib/genId.ts";
import z from "zod";

export enum BoardType {
  PROJECT = "PROJECT",
  PROJECT_INTERVIEW = "PROJECT_INTERVIEW",
}

export enum NodeType {
  STICKY_NOTE = "STICKY_NOTE",
  PROJECT_JOB = "PROJECT_JOB",
  PROJECT_INTERVIEW_JOB = "PROJECT_INTERVIEW_JOB",
  DISCUSSION = "DISCUSSION",
}

export enum EditorTool {
  CURSOR = "CURSOR",
  ADD_NOTE = "ADD_NOTE",
  ADD_JOB = "ADD_JOB",
}

const zNode = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    id: zBoardNodeId,
    type: z.enum(NodeType),
    position: z.object({ x: z.number(), y: z.number() }),
    data,
  });

export type StickyNoteData = z.infer<typeof zStickyNoteData>;
export const zStickyNoteData = z.object({
  id: zBoardStickyNoteId,
  content: z.string(),
  size: z.enum(["xs", "sm", "md", "lg", "xl"]),
  color: z.enum(["yellow", "green", "blue", "red", "purple"]),
});
export type StickyNoteNode = z.infer<typeof zStickyNoteNode>;
export const zStickyNoteNode = zNode(zStickyNoteData);

export type ProjectJobData = z.infer<typeof zProjectJobData>;
export const zProjectJobData = z.object({
  id: zProjectJobId,
  name: z.string(),
  when: z.string(),
  soThat: z.string(),
  importance: z.string(),
  frequency: z.string(),
});
export type ProjectJobNode = z.infer<typeof zProjectJobNode>;
export const zProjectJobNode = zNode(zProjectJobData);

export type ProjectInterviewJobData = z.infer<typeof zProjectInterviewJobData>;
export const zProjectInterviewJobData = z.object({
  id: zProjectInterviewJobId,
  job: z.string().optional(),
});
export type ProjectInterviewJobNode = z.infer<typeof zProjectInterviewJobNode>;
export const zProjectInterviewJobNode = zNode(zProjectInterviewJobData);

export type DiscussionData = z.infer<typeof zDiscussionData>;
export const zDiscussionData = z.object({
  id: zBoardDiscussionId,
});
export type DiscussionNode = z.infer<typeof zDiscussionNode>;
export const zDiscussionNode = zNode(zDiscussionData);

export type BoardNode = z.infer<typeof zBoardNode>;
export const zBoardNode = z.union([
  zStickyNoteNode,
  zProjectJobNode,
  zProjectInterviewJobNode,
  zDiscussionNode,
]);

export type BoardNodeData = BoardNode["data"];
