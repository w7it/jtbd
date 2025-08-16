import { Button } from "@/components/ui/button.tsx";
import * as ReactFlow from "@xyflow/react";
import { ExpandIcon, Trash2Icon } from "lucide-react";

type NodeToolbarProps = {
  readonly onSizeChange?: () => void;
  readonly onDelete?: () => void;
};

export function NodeToolbar({ onSizeChange, onDelete }: NodeToolbarProps) {
  const buttons: React.ReactNode[] = [];

  if (onSizeChange) {
    buttons.push(
      <Button key="size" size="icon" variant="ghost" onClick={onSizeChange}>
        <ExpandIcon className="transition group-hover:text-blue-600" />
      </Button>,
    );
  }

  if (onDelete) {
    buttons.push(
      <Button
        key="delete"
        size="icon"
        variant="ghost"
        onClick={onDelete}
        className="group"
      >
        <Trash2Icon className="transition group-hover:text-red-600" />
      </Button>,
    );
  }

  if (buttons.length === 0) {
    return null;
  }

  return (
    <ReactFlow.NodeToolbar position={ReactFlow.Position.Bottom}>
      <div className="relative">
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="w-2 h-2 bg-white bg-background border border-b-0 border-r-0 rotate-45 shadow-lg" />
        </div>
        <div className="bg-white bg-background border rounded-lg shadow-lg p-1 flex gap-1">
          {buttons}
        </div>
      </div>
    </ReactFlow.NodeToolbar>
  );
}
