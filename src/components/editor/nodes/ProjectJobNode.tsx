import React, { useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils.ts";
import { NodeToolbar } from "../components/NodeToolbar.tsx";

export type ProjectJobData = {
  readonly content?: string;
};

export const ProjectJobNode = React.memo(
  ({ data: rawData, selected }: NodeProps) => {
    const data = rawData as ProjectJobData;

    const handleDelete = () => {
      console.log("delete");
    };

    return (
      <>
        <div
          className={cn(
            "bg-blue-100 rounded-sm p-2 shadow-md hover:shadow-lg transition-shadow w-64",
            selected ? "border-2 border-blue-500" : "border-2 border-blue-200",
          )}
        >
          <TextInput selected={selected} />
        </div>

        <NodeToolbar onDelete={handleDelete} />
      </>
    );
  },
);

const TextInput = React.memo(({ selected }: { selected: boolean }) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="text-[10px] text-gray-500 whitespace-nowrap vertical-align-middle">
        I want to:
      </label>
      <span
        className={cn(
          "inline-block flex-1 min-w-10 min-h-4 text-gray-800 whitespace-pre-wrap break-words cursor-text outline-none",
          selected && "nodrag",
        )}
        style={{ wordBreak: "break-word" }}
        onKeyDown={handleKeyDown}
        contentEditable
      />
    </div>
  );
});
