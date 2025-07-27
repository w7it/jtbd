import { AppMenu } from "../app-menu/AppMenu.tsx";
import { EditorTool } from "../constants/boards.ts";
import { EditorToolbar } from "./EditorToolbar.tsx";

type OverlayProps = {
  readonly activeTool: EditorTool;
  readonly setActiveTool: (tool: EditorTool) => void;
};

export function Overlay(props: OverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-2 left-2 max-w-sm z-10">
        <AppMenu />
      </div>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <EditorToolbar
          activeTool={props.activeTool}
          onToolChange={props.setActiveTool}
        />
      </div>
    </div>
  );
}
