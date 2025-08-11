import type { Node, NodeProps } from "@xyflow/react";
import { StickyNoteNode } from "./nodes/StickyNoteNode.tsx";
import { BoardNode, NodeType } from "../../constants/boards.ts";
import { ProjectJobNode } from "./nodes/ProjectJobNode.tsx";
import { ProjectInterviewNode } from "./nodes/ProjectInterviewNode.tsx";
import { DiscussionNode } from "./nodes/DiscussionNode.tsx";

export const COMPONENTS_BY_TYPE: Record<
  NodeType,
  React.ComponentType<NodeProps<Node<BoardNode["data"]>>>
> = {
  [NodeType.STICKY_NOTE]: StickyNoteNode,
  [NodeType.PROJECT_JOB]: ProjectJobNode,
  [NodeType.PROJECT_INTERVIEW_JOB]: ProjectInterviewNode,
  [NodeType.DISCUSSION]: DiscussionNode,
};
