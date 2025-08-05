import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils.ts";
import { NodeToolbar } from "../components/NodeToolbar.tsx";

export type StickyNoteData = {
  readonly size?: "xs" | "sm" | "md" | "lg" | "xl";
  readonly content?: string;
};

export const StickyNoteNode = React.memo(
  ({ data: rawData, selected }: NodeProps) => {
    const data = rawData as StickyNoteData;
    const { size = "xs", content: initialContent = "" } = data;
    const [content, _setContent] = useState(initialContent);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      event.stopPropagation();
    };

    const handleDelete = () => {
      console.log("delete");
    };

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
          >
            {content}
          </textarea>
        </div>

        <NodeToolbar onDelete={handleDelete} />
      </>
    );
  },
);

StickyNoteNode.displayName = "StickyNoteNode";
