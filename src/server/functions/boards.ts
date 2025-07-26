import { createServerFn } from "@tanstack/react-start";
import type { Node } from "@xyflow/react";
import { z } from "zod";

export const getBoardDataById = createServerFn()
  .validator(z.object({ boardId: z.string() }))
  .handler(async ({ data }) => {
    const { getBoardDataById } = await import("../db/queries.ts");
    const result = await getBoardDataById.execute({ boardId: data.boardId });
    if (!result) return null;

    return {
      nodes: result.boardNodes.map(
        (node) =>
          ({
            id: node.id,
            type: node.relatedType,
            position: { x: 0, y: 0 },
            data: {},
          }) satisfies Node,
      ),
      edges: [],
    };
  });
