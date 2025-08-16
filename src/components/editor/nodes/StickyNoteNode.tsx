import React, { useCallback } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BoardNode, StickyNoteData } from "@/constants/boards.ts";
import { cn } from "@/lib/utils.ts";
import { NodeToolbar } from "../components/NodeToolbar.tsx";

const SIZES: StickyNoteData["size"][] = ["xs", "sm", "md", "lg", "xl"];

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

    const handleSizeChange = useCallback(() => {
      const nextSize = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length];
      reactFlow.updateNodeData(id, { size: nextSize });
    }, [id, reactFlow, size]);

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
              xs: "w-24 h-24 text-xs",
              sm: "w-32 h-32 text-xs",
              md: "w-40 h-40 text-sm",
              lg: "w-48 h-48 text-md",
              xl: "w-56 h-56 text-md",
            }[size],
          )}
          onKeyDown={handleKeyDown}
        >
          <textarea
            className={cn(
              "p-4 w-full h-full text-gray-800 whitespace-pre-wrap break-words outline-none resize-none",
              selected ? "cursor-text nodrag" : "cursor-move",
              {
                xs: "p-2",
                sm: "p-2",
                md: "p-2",
                lg: "p-4",
                xl: "p-4",
              }[size],
            )}
            style={{ wordBreak: "break-word" }}
            value={content}
            onChange={handleChange}
          />
        </div>

        <NodeToolbar onSizeChange={handleSizeChange} onDelete={handleDelete} />
      </>
    );
  },
);

StickyNoteNode.displayName = "StickyNoteNode";
