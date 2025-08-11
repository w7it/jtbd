import React, { useCallback } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils.ts";
import { NodeToolbar } from "../components/NodeToolbar.tsx";
import { BoardNode, ProjectJobData } from "@/constants/boards.ts";

export const ProjectJobNode = React.memo(
  ({ id, data: rawData, selected }: NodeProps<Node<BoardNode["data"]>>) => {
    const data = rawData as ProjectJobData;
    const { name } = data;
    const reactFlow = useReactFlow();

    const handleDelete = useCallback(() => {
      reactFlow.deleteElements({ nodes: [{ id }] });
    }, [id, reactFlow]);

    const handleNameChange = useCallback(
      (newName: string) => {
        reactFlow.updateNodeData(id, { name: newName });
      },
      [id, reactFlow],
    );

    return (
      <>
        <div
          className={cn(
            "bg-blue-100 rounded-sm p-2 shadow-md hover:shadow-lg transition-shadow w-64",
            selected ? "border-2 border-blue-500" : "border-2 border-blue-200",
          )}
        >
          <TextInput
            selected={selected}
            value={name ?? ""}
            onChange={handleNameChange}
          />
        </div>

        <NodeToolbar onDelete={handleDelete} />
      </>
    );
  },
);

const TextInput = React.memo(
  ({
    selected,
    value,
    onChange,
  }: {
    selected: boolean;
    value: string;
    onChange: (value: string) => void;
  }) => {
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      event.stopPropagation();
    }, []);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
      },
      [],
    );

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-[10px] text-gray-500 whitespace-nowrap vertical-align-middle">
          I want to:
        </label>
        <textarea
          className={cn(
            "inline-block flex-1 min-w-10 min-h-4 text-gray-800 whitespace-pre-wrap break-words cursor-text outline-none resize-none",
            selected && "nodrag",
          )}
          style={{ wordBreak: "break-word" }}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          rows={1}
          value={value}
        />
      </div>
    );
  },
);
