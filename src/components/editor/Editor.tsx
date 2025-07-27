import { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { COMPONENTS_BY_TYPE } from "./node.ts";
import { Overlay } from "./Overlay.tsx";
import { EditorTool, NodeType } from "../constants/boards.ts";
import "./editor.css";
import { cn } from "@/lib/utils.ts";
import { nanoid } from "nanoid";

type EditorProps = {
  readonly nodes: readonly Node[];
  readonly edges: readonly Edge[];
};

function EditorInternal({
  nodes: initialNodes,
  edges: initialEdges,
}: EditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.slice());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges.slice());
  const [activeTool, setActiveTool] = useState<EditorTool>(EditorTool.CURSOR);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const clickPosition = { x: event.clientX, y: event.clientY };
      const position = screenToFlowPosition(clickPosition);

      setActiveTool(EditorTool.CURSOR);

      if (activeTool === EditorTool.ADD_NOTE) {
        const newNode: Node = {
          id: nanoid(),
          type: NodeType.STICKY_NOTE,
          position,
          data: {},
        };

        setNodes((nodes) => [...nodes, newNode]);
      } else if (activeTool === EditorTool.ADD_JOB) {
        const newNode: Node = {
          id: nanoid(),
          type: NodeType.PROJECT_JOB,
          position,
          data: {},
        };

        setNodes((nodes) => [...nodes, newNode]);
      }
    },
    [activeTool, setNodes, setActiveTool, screenToFlowPosition],
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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={COMPONENTS_BY_TYPE}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        connectionMode={ConnectionMode.Loose}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      <Overlay activeTool={activeTool} setActiveTool={setActiveTool} />
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
