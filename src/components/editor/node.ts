import type { NodeProps } from "@xyflow/react";
import { StickyNoteNode } from "./nodes/StickyNoteNode.tsx";
import { NodeType } from "../constants/boards.ts";
import { ProjectNode } from "./nodes/ProjectNode.tsx";
import { ProjectInterviewNode } from "./nodes/ProjectInterviewNode.tsx";
import { DiscussionNode } from "./nodes/DiscussionNode.tsx";

export const COMPONENTS_BY_TYPE: Record<
  NodeType,
  React.ComponentType<NodeProps>
> = {
  [NodeType.STICKY_NOTE]: StickyNoteNode,
  [NodeType.PROJECT_JOB]: ProjectNode,
  [NodeType.PROJECT_INTERVIEW_JOB]: ProjectInterviewNode,
  [NodeType.DISCUSSION]: DiscussionNode,
};
