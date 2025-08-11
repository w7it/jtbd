import { EditorTool } from "../../constants/boards.ts";
import { EditorToolbar } from "./EditorToolbar.tsx";

type OverlayProps = {
  readonly children: React.ReactNode;
  readonly activeTool: EditorTool;
  readonly setActiveTool: (tool: EditorTool) => void;
};

export function Overlay(props: OverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {props.children}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <EditorToolbar
          activeTool={props.activeTool}
          onToolChange={props.setActiveTool}
        />
      </div>
    </div>
  );
}
