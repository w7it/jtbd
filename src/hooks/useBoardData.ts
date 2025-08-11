import { Edge } from "@xyflow/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { authClient } from "@/lib/authClient.ts";
import { BoardNode } from "@/constants/boards";
import { getBoardDataById } from "@/server/functions/boards";
import { BoardId } from "@/lib/genId.ts";
import {
  genEmptyStickyNoteData,
  genEmptyStickyNoteNode,
} from "@/lib/boards.ts";

export type BoardData = {
  readonly nodes: readonly BoardNode[];
  readonly edges: readonly Edge[];
};

export function useBoardData(boardId: BoardId | null): BoardData | null {
  const session = authClient.useSession();
  const realBoardData = useRealBoardData(boardId);

  if (session.isPending) {
    return null;
  }

  if (!session.data?.user) {
    return getDemoBoardData();
  }

  return realBoardData;
}

const useRealBoardData = (boardId: BoardId | null) => {
  const session = authClient.useSession();

  const getBoardDataByIdFn = useServerFn(getBoardDataById);
  const { data: realBoardData } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => (boardId ? getBoardDataByIdFn({ data: { boardId } }) : null),
    enabled: !!session.data?.user && !!boardId,
  });

  return realBoardData as {
    nodes: readonly BoardNode[];
    edges: readonly Edge[];
  } | null;
};

const demoNodes: readonly BoardNode[] = Object.freeze([
  Object.freeze({
    ...genEmptyStickyNoteNode(),
    position: { x: 100, y: 100 },
    data: { ...genEmptyStickyNoteData(), content: "Welcome to JTBD Builder!" },
  }),
  Object.freeze({
    ...genEmptyStickyNoteNode(),
    position: { x: 400, y: 150 },
    data: {
      ...genEmptyStickyNoteData(),
      content: "Double-click anywhere to create a new note",
    },
  }),
]);

const demoEdges: readonly Edge[] = Object.freeze([]);

function getDemoBoardData() {
  return { nodes: demoNodes, edges: demoEdges };
}
