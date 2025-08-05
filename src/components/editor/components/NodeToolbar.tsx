import { Button } from "@/components/ui/button.tsx";
import * as ReactFlow from "@xyflow/react";
import { Trash2Icon } from "lucide-react";

type NodeToolbarProps = {
  readonly onDelete?: () => void;
};

export function NodeToolbar({ onDelete }: NodeToolbarProps) {
  const buttons: React.ReactNode[] = [];

  if (onDelete) {
    buttons.push(
      <Button size="icon" variant="ghost" onClick={onDelete} className="group">
        <Trash2Icon className="transition group-hover:text-red-600" />
      </Button>,
    );
  }

  if (buttons.length === 0) {
    return null;
  }

  return (
    <ReactFlow.NodeToolbar position={ReactFlow.Position.Bottom}>
      <div className="bg-white bg-background border rounded-lg shadow-lg p-1 flex gap-1">
        {buttons}
      </div>
    </ReactFlow.NodeToolbar>
  );
}
