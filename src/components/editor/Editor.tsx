import { useCallback, useState } from "react";
import {
  ReactFlow,
  Edge,
  Node,
  Connection,
  Background,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { COMPONENTS_BY_TYPE } from "./node.ts";
import { Overlay } from "./Overlay.tsx";
import { BoardNode, EditorTool } from "../../constants/boards.ts";
import "./editor.css";
import { cn } from "@/lib/utils.ts";
import {
  genEmptyProjectJobNode,
  genEmptyStickyNoteNode,
} from "@/lib/boards.ts";

type EditorProps = {
  readonly children: React.ReactNode;
  readonly nodes: readonly Node<BoardNode["data"]>[];
  readonly edges: readonly Edge[];
  readonly onConnect?: (params: Connection) => void;
  readonly onNodesChange?: (changes: NodeChange<BoardNode>[]) => void;
  readonly onEdgesChange?: (changes: EdgeChange[]) => void;
};

function EditorInternal(props: EditorProps) {
  const [activeTool, setActiveTool] = useState<EditorTool>(EditorTool.CURSOR);
  const { screenToFlowPosition } = useReactFlow();

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const clickPosition = { x: event.clientX, y: event.clientY };
      const position = screenToFlowPosition(clickPosition);

      setActiveTool(EditorTool.CURSOR);

      if (activeTool === EditorTool.ADD_NOTE) {
        const item: BoardNode = { ...genEmptyStickyNoteNode(), position };
        props.onNodesChange?.([{ item, type: "add" }]);
      } else if (activeTool === EditorTool.ADD_JOB) {
        const item: BoardNode = { ...genEmptyProjectJobNode(), position };
        props.onNodesChange?.([{ item, type: "add" }]);
      }
    },
    [activeTool, props.onNodesChange, setActiveTool, screenToFlowPosition],
  );

  return (
    <div
      className={cn("h-screen w-full relative", {
        "cursor-grab": activeTool === EditorTool.CURSOR,
        "cursor-copy":
          activeTool === EditorTool.ADD_JOB ||
          activeTool === EditorTool.ADD_NOTE,
      })}
    >
      <ReactFlow
        nodes={props.nodes as BoardNode[]}
        edges={props.edges as Edge[]}
        onNodesChange={props.onNodesChange}
        onEdgesChange={props.onEdgesChange}
        onConnect={props.onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={COMPONENTS_BY_TYPE}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      <Overlay activeTool={activeTool} setActiveTool={setActiveTool}>
        {props.children}
      </Overlay>
    </div>
  );
}

export function Editor(props: EditorProps) {
  return (
    <ReactFlowProvider>
      <EditorInternal {...props} />
    </ReactFlowProvider>
  );
}
