import { Node, Edge } from "@xyflow/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { authClient } from "@/lib/authClient.ts";
import { NodeType } from "@/components/constants/boards";
import { getBoardDataById } from "@/server/functions/boards";

export function useBoardData(boardId: string | null) {
  const session = authClient.useSession();

  const getBoardDataByIdFn = useServerFn(getBoardDataById);
  const { data: realBoardData } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => (boardId ? getBoardDataByIdFn({ data: { boardId } }) : null),
    enabled: !!session.data?.user && !!boardId,
  });

  if (session.isPending) {
    return null;
  }

  if (!session.data?.user) {
    return getDemoBoardData();
  }

  return realBoardData;
}

const demoNodes: readonly Node[] = Object.freeze([
  Object.freeze({
    id: "1",
    type: NodeType.STICKY_NOTE,
    position: { x: 100, y: 100 },
    width: 100,
    height: 100,
    data: { content: "Welcome to JTBD Builder!" },
  }),
  Object.freeze({
    id: "2",
    type: NodeType.STICKY_NOTE,
    position: { x: 400, y: 150 },
    width: 100,
    height: 100,
    data: { content: "Double-click anywhere to create a new note" },
  }),
]);

const demoEdges: readonly Edge[] = Object.freeze([]);

function getDemoBoardData() {
  return { nodes: demoNodes, edges: demoEdges };
}
