import { useCallback, useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";
import { BoardNode } from "@/constants/boards.ts";
import {
  genBoardNodeId,
  genBoardStickyNoteId,
  genProjectJobId,
  genProjectInterviewJobId,
  genBoardDiscussionId,
} from "@/lib/genId.ts";

export function useCopyPasteNode(onNodesChange?: (changes: any[]) => void) {
  const copiedNodeRef = useRef<BoardNode | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const { screenToFlowPosition, getNodes } = useReactFlow();

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleCopy = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => (node as any).selected);
    if (selectedNodes.length > 0) {
      copiedNodeRef.current = selectedNodes[0] as BoardNode;
    }
  }, [getNodes]);

  const handlePaste = useCallback(() => {
    if (!copiedNodeRef.current) return;

    const flowPosition = screenToFlowPosition(mousePositionRef.current);
    let newDataId;

    if (copiedNodeRef.current.data.id.startsWith("bsn_")) {
      newDataId = genBoardStickyNoteId();
    } else if (copiedNodeRef.current.data.id.startsWith("pj_")) {
      newDataId = genProjectJobId();
    } else if (copiedNodeRef.current.data.id.startsWith("pij_")) {
      newDataId = genProjectInterviewJobId();
    } else if (copiedNodeRef.current.data.id.startsWith("bd_")) {
      newDataId = genBoardDiscussionId();
    } else {
      throw new Error("Invalid node type");
    }

    const newNode: BoardNode = {
      ...copiedNodeRef.current,
      id: genBoardNodeId(),
      position: {
        x: flowPosition.x + 20,
        y: flowPosition.y + 20,
      },
      data: {
        ...copiedNodeRef.current.data,
        id: newDataId,
      } as any,
      // @ts-ignore
      selected: false,
    };

    onNodesChange?.([{ item: newNode, type: "add" }]);
  }, [screenToFlowPosition, onNodesChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "c") {
        event.preventDefault();
        handleCopy();
      } else if ((event.metaKey || event.ctrlKey) && event.key === "v") {
        event.preventDefault();
        handlePaste();
      }
    },
    [handleCopy, handlePaste],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    handleMouseMove,
  };
}
