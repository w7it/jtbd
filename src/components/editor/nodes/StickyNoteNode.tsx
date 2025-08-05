import React, { useState } from "react";
import { Position, NodeProps } from "@xyflow/react";
import { NodeHandle } from "../components/NodeHandle.tsx";
import { NodeDeleteButton } from "../components/NodeDeleteButton.tsx";
import { cn } from "@/lib/utils.ts";

export type StickyNoteData = {
  readonly size?: "xs" | "sm" | "md" | "lg" | "xl";
  readonly content?: string;
};

export const StickyNoteNode = React.memo(({ data: rawData, id }: NodeProps) => {
  const data = rawData as StickyNoteData;
  const { size = "xs", content: initialContent = "" } = data;
  const [content, _setContent] = useState(initialContent);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className={cn("sticky-note-node group relative", {
        "w-24 h-24 text-xs": size === "xs",
        "w-32 h-32 text-xs": size === "sm",
        "w-64 h-64 text-md": size === "md",
        "w-96 h-96 text-lg": size === "lg",
        "w-128 h-128 text-xl": size === "xl",
      })}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-yellow-100 border-1 border-yellow-200 rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-move h-full w-full">
        <NodeDeleteButton onClick={handleDelete} />
        <textarea
          className={cn(
            "p-4 w-full h-full text-gray-800 whitespace-pre-wrap break-words cursor-text outline-none resize-none",
            {
              "p-2": size === "xs",
              "p-4": size === "sm",
              "p-6": size === "md",
              "p-8": size === "lg",
              "p-10": size === "xl",
            },
          )}
          style={{ wordBreak: "break-word" }}
        >
          {content}
        </textarea>
      </div>

      <NodeHandle type="source" id="left-in" position={Position.Left} />
      <NodeHandle type="source" id="top-in" position={Position.Top} />
      <NodeHandle type="source" id="right-in" position={Position.Right} />
      <NodeHandle type="source" id="bottom-in" position={Position.Bottom} />
    </div>
  );
});

StickyNoteNode.displayName = "StickyNoteNode";
