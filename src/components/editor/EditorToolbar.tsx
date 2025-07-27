import { Button } from "@/components/ui/button";
import { EditorTool } from "../constants/boards";
import { MousePointer2, StickyNote, Goal } from "lucide-react";
import { useEffect } from "react";

const tools = [
  {
    id: EditorTool.CURSOR,
    icon: MousePointer2,
    label: "Cursor",
    shortcut: { code: "KeyC" },
  },
  {
    id: EditorTool.ADD_NOTE,
    icon: StickyNote,
    label: "Add sticky note",
    shortcut: { code: "KeyS" },
  },
  {
    id: EditorTool.ADD_JOB,
    icon: Goal,
    label: "Add job",
    shortcut: { code: "KeyJ" },
  },
];

interface EditorToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
}

export function EditorToolbar({
  activeTool,
  onToolChange,
}: EditorToolbarProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const tool = tools.find((tool) => tool.shortcut.code === event.code);
      if (tool) {
        onToolChange(tool.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown, false);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

  return (
    <div className="pointer-events-auto bg-background border rounded-lg shadow-lg p-1 flex gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
}
