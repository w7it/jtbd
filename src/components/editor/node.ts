import type { NodeProps } from "@xyflow/react";
import { StickyNoteNode } from "./nodes/StickyNoteNode.tsx";

export enum NodeType {
  STICKY_NOTE = "STICKY_NOTE",
}

type PositionXY = {
  readonly x: number;
  readonly y: number;
};

export type StickyNoteNode = {
  readonly type: NodeType.STICKY_NOTE;
  readonly position: PositionXY;
  readonly payload: string;
};

export type Node = StickyNoteNode;

export const COMPONENTS_BY_TYPE: Record<
  NodeType,
  React.ComponentType<NodeProps>
> = {
  [NodeType.STICKY_NOTE]: StickyNoteNode,
};
