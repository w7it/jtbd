import {
  NodeType,
  StickyNoteNode,
  ProjectJobNode,
  BoardNode,
  DiscussionNode,
  ProjectInterviewJobNode,
  zBoardNode,
} from "@/constants/boards.ts";
import { assert } from "@/lib/assert.ts";
import { BoardId, zBoardId } from "@/lib/genId.ts";
import { createServerFn } from "@tanstack/react-start";
import type { Edge } from "@xyflow/react";
import { z } from "zod";

type NodeDB = NonNullable<
  Awaited<
    ReturnType<
      (typeof import("../db/queries.ts"))["getBoardDataById"]["execute"]
    >
  >
>["nodes"][number];

const toStickyNoteNode = (node: NodeDB): StickyNoteNode => {
  assert(
    node.relatedType === NodeType.STICKY_NOTE,
    "Expected sticky note node",
  );
  return {
    id: node.id,
    type: node.relatedType,
    position: { x: node.x, y: node.y },
    data: {
      id: node.stickyNoteData.id,
      content: node.stickyNoteData.content,
      color: node.stickyNoteData.color ?? "yellow",
      size: node.stickyNoteData.size ?? "md",
    },
  };
};

const toProjectJobNode = (node: NodeDB): ProjectJobNode => {
  assert(
    node.relatedType === NodeType.PROJECT_JOB,
    "Expected project job node",
  );
  return {
    id: node.id,
    type: node.relatedType,
    position: { x: node.x, y: node.y },
    data: {
      id: node.projectJobData.id,
      name: node.projectJobData.name,
      when: node.projectJobData.data.when ?? "",
      soThat: node.projectJobData.data.soThat ?? "",
      importance: node.projectJobData.data.importance ?? "",
      frequency: node.projectJobData.data.frequency ?? "",
    },
  };
};

const toProjectInterviewJobNode = (node: NodeDB): ProjectInterviewJobNode => {
  assert(
    node.relatedType === NodeType.PROJECT_INTERVIEW_JOB,
    "Expected project interview job node",
  );

  return {
    id: node.id,
    type: node.relatedType,
    position: { x: node.x, y: node.y },
    data: {
      id: node.projectInterviewJobData.id,
      job: node.projectInterviewJobData.data.job,
    },
  };
};

const toDiscussionNode = (node: NodeDB): DiscussionNode => {
  assert(node.relatedType === NodeType.DISCUSSION, "Expected discussion node");

  return {
    id: node.id,
    type: node.relatedType,
    position: { x: node.x, y: node.y },
    data: {
      id: node.boardDiscussion.id,
    },
  };
};

const NODE_MAPPERS: Record<NodeType, (node: NodeDB) => BoardNode> = {
  [NodeType.STICKY_NOTE]: toStickyNoteNode,
  [NodeType.PROJECT_JOB]: toProjectJobNode,
  [NodeType.PROJECT_INTERVIEW_JOB]: toProjectInterviewJobNode,
  [NodeType.DISCUSSION]: toDiscussionNode,
};

const composeBoardData = async (boardId: BoardId) => {
  const { getBoardDataById } = await import("../db/queries.ts");
  const result = await getBoardDataById.execute({ boardId });
  if (!result) return null;

  return {
    nodes: result.nodes.map((node) => {
      const mapper = NODE_MAPPERS[node.relatedType];
      assert(mapper, "Not supported");
      return mapper(node);
    }),
    edges: [] satisfies readonly Edge[],
  };
};

export const getBoardDataById = createServerFn()
  .validator(z.object({ boardId: zBoardId }))
  .handler(async ({ data }) => {
    return composeBoardData(data.boardId);
  });

export const updateBoardData = createServerFn()
  .validator(
    z.object({
      boardId: zBoardId,
      nodes: z.array(zBoardNode),
    }),
  )
  .handler(async ({ data }) => {
    const { updateBoardData } = await import("../db/queries.ts");
    await updateBoardData({
      boardId: data.boardId,
      nodes: data.nodes,
    });

    return composeBoardData(data.boardId);
  });
