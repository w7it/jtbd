import React, { useCallback } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BoardNode, StickyNoteData } from "@/constants/boards.ts";
import { cn } from "@/lib/utils.ts";
import { NodeToolbar } from "../components/NodeToolbar.tsx";

export const StickyNoteNode = React.memo(
  ({ id, data: rawData, selected }: NodeProps<Node<BoardNode["data"]>>) => {
    const data = rawData as StickyNoteData;
    const { size = "xs", content } = data;
    const reactFlow = useReactFlow();

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        reactFlow.updateNodeData(id, { content: newContent });
      },
      [id, reactFlow],
    );

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      event.stopPropagation();
    }, []);

    const handleDelete = useCallback(() => {
      reactFlow.deleteElements({ nodes: [{ id }] });
    }, [id, reactFlow]);

    return (
      <>
        <div
          className={cn(
            "sticky-note-node group relative",
            "bg-yellow-100 border-2 border-yellow-200 rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-move h-full w-full",
            selected && "border-yellow-500",
            {
              "w-24 h-24 text-xs": size === "xs",
              "w-32 h-32 text-xs": size === "sm",
              "w-64 h-64 text-md": size === "md",
              "w-96 h-96 text-lg": size === "lg",
              "w-128 h-128 text-xl": size === "xl",
            },
          )}
          onKeyDown={handleKeyDown}
        >
          <textarea
            className={cn(
              "p-4 w-full h-full text-gray-800 whitespace-pre-wrap break-words outline-none resize-none",
              selected ? "cursor-text nodrag" : "cursor-move",
              {
                "p-2": size === "xs",
                "p-4": size === "sm",
                "p-6": size === "md",
                "p-8": size === "lg",
                "p-10": size === "xl",
              },
            )}
            style={{ wordBreak: "break-word" }}
            value={content}
            onChange={handleChange}
          />
        </div>

        <NodeToolbar onDelete={handleDelete} />
      </>
    );
  },
);

StickyNoteNode.displayName = "StickyNoteNode";
