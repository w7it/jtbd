import React, { useState, useRef, useEffect } from "react";
import { Position, NodeProps } from "@xyflow/react";
import { NodeHandle } from "../components/NodeHandle.tsx";
import { NodeDeleteButton } from "../components/NodeDeleteButton.tsx";
import { cn } from "@/lib/utils.ts";

interface StickyNoteData {
  content?: string;
}

export const StickyNoteNode = React.memo(({ data, id }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, _setContent] = useState(
    (data as StickyNoteData)?.content || "",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);

    window.getSelection()?.removeAllRanges();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Here you would typically call a callback to delete the node
    // For now, we'll just log it
    console.log(`Delete node ${id}`);
  };

  return (
    <div
      className={cn("sticky-note-node group relative", {
        nodrag: isEditing,
      })}
    >
      <div className="bg-yellow-100 border-1 border-yellow-200 rounded-sm shadow-md hover:shadow-lg transition-shadow cursor-move">
        <NodeDeleteButton onClick={handleDelete} />
        <div
          className="p-4 w-full h-full text-sm font-medium text-gray-800 whitespace-pre-wrap break-words min-h-[60px] cursor-text outline-none resize-none"
          style={{ wordBreak: "break-word" }}
          contentEditable
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {content || "Double-click to edit"}
        </div>
      </div>

      <NodeHandle type="source" id="left-in" position={Position.Left} />
      <NodeHandle type="source" id="top-in" position={Position.Top} />
      <NodeHandle type="source" id="right-in" position={Position.Right} />
      <NodeHandle type="source" id="bottom-in" position={Position.Bottom} />
    </div>
  );
});

StickyNoteNode.displayName = "StickyNoteNode";
