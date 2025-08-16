import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Edge,
  EdgeChange,
  NodeChange,
  Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BoardData } from "./useBoardData.ts";
import {
  BoardNode,
  DiscussionNode,
  NodeType,
  ProjectInterviewJobNode,
  ProjectJobNode,
  StickyNoteNode,
} from "@/constants/boards.ts";
import { useServerFn } from "@tanstack/react-start";
import { updateBoardData } from "@/server/functions/boards.ts";
import { BoardId } from "@/lib/genId.ts";

const isStickyNoteChanged = (prev: StickyNoteNode, node: StickyNoteNode) => {
  return (
    prev.data.id !== node.data.id ||
    prev.data.content !== node.data.content ||
    prev.data.color !== node.data.color ||
    prev.data.size !== node.data.size
  );
};

const isProjectJobChanged = (prev: ProjectJobNode, node: ProjectJobNode) => {
  return (
    prev.data.id !== node.data.id ||
    prev.data.name !== node.data.name ||
    prev.data.when !== node.data.when ||
    prev.data.soThat !== node.data.soThat ||
    prev.data.importance !== node.data.importance ||
    prev.data.frequency !== node.data.frequency
  );
};

const isProjectInterviewJobChanged = (
  prev: ProjectInterviewJobNode,
  node: ProjectInterviewJobNode,
) => {
  return prev.data.id !== node.data.id || prev.data.job !== node.data.job;
};

const isDiscussionChanged = (prev: DiscussionNode, node: DiscussionNode) => {
  return prev.data.id !== node.data.id;
};

const CHANGE_DETECTORS = {
  [NodeType.STICKY_NOTE]: isStickyNoteChanged,
  [NodeType.PROJECT_JOB]: isProjectJobChanged,
  [NodeType.PROJECT_INTERVIEW_JOB]: isProjectInterviewJobChanged,
  [NodeType.DISCUSSION]: isDiscussionChanged,
};

const useChangesDetector = (
  nodes: Node<BoardNode["data"]>[],
  edges: Edge[],
) => {
  const [hasChanges, setHasChanges] = useState(false);

  const prevNodesRef = useRef<readonly Node<BoardNode["data"]>[]>(nodes);
  const prevEdgesRef = useRef<readonly Edge[]>(edges);
  useEffect(() => {
    if (
      prevNodesRef.current.length !== nodes.length ||
      nodes.some((node, index) => {
        const prev = prevNodesRef.current[index];
        if (prev?.id !== node.id) return true;

        if (
          prev?.position.x !== node.position.x ||
          prev?.position.y !== node.position.y
        )
          return true;

        // @ts-expect-error TODO: fix it later
        if (CHANGE_DETECTORS[node.type]?.(prev, node)) {
          return true;
        }

        return false;
      }) ||
      prevEdgesRef.current.length !== edges.length ||
      edges.some((edge, index) => {
        const prev = prevEdgesRef.current[index];
        if (prev?.id !== edge.id) return true;

        return false;
      })
    ) {
      setHasChanges(true);
    }

    prevNodesRef.current = nodes;
    prevEdgesRef.current = edges;
  }, [nodes, edges]);

  const setBoardData = useCallback(
    (nodes: readonly BoardNode[], edges: readonly Edge[]) => {
      setHasChanges(false);
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
    },
    [],
  );

  return useMemo(
    () => [hasChanges, setBoardData] as const,
    [hasChanges, setBoardData],
  );
};

export function useBoardSaver({
  boardId,
  boardData,
}: {
  readonly boardId: BoardId | null;
  readonly boardData: BoardData | null;
}) {
  const [nodes, setNodes, handleNodesChange] = useNodesState<
    Node<BoardNode["data"]>
  >(boardData?.nodes.slice() ?? []);
  const [edges, setEdges, handleEdgesChange] = useEdgesState(
    boardData?.edges.slice() ?? [],
  );
  const [hasChanges, resetHasChanges] = useChangesDetector(nodes, edges);

  useEffect(() => {
    if (!boardData) return;
    const nodes = boardData.nodes.slice();
    const edges = boardData.edges.slice();
    setNodes(nodes);
    setEdges(edges);
    resetHasChanges(nodes, edges);
  }, [boardData, resetHasChanges]);

  const onNodesChange = useCallback((changes: NodeChange<BoardNode>[]) => {
    handleNodesChange(changes);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    handleEdgesChange(changes);
  }, []);

  const updateBoardDataFn = useServerFn(updateBoardData);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["board", boardId],
    mutationFn: updateBoardDataFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["board", boardId], data);
    },
  });

  const saveBoard = useCallback(() => {
    if (!boardId) return;
    mutate({
      data: {
        boardId,
        nodes: nodes.map(
          (node) =>
            ({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data,
            }) as BoardNode,
        ),
      },
    });
  }, [boardId, nodes, mutate]);

  return useMemo(
    () => ({
      nodes,
      edges,
      hasChanges,
      setNodes,
      setEdges,
      saveBoard,
      onNodesChange,
      onEdgesChange,
    }),
    [
      nodes,
      edges,
      hasChanges,
      setNodes,
      setEdges,
      saveBoard,
      onNodesChange,
      onEdgesChange,
    ],
  );
}
