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
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { COMPONENTS_BY_TYPE } from "./node.ts";
import { Overlay } from "./Overlay.tsx";
import { EditorTool } from "../constants/boards.ts";
import "./editor.css";
import { cn } from "@/lib/utils.ts";

type EditorProps = {
  readonly nodes: readonly Node[];
  readonly edges: readonly Edge[];
};

export function Editor({
  nodes: initialNodes,
  edges: initialEdges,
}: EditorProps) {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes.slice());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges.slice());
  const [activeTool, setActiveTool] = useState<EditorTool>(EditorTool.CURSOR);
  // const [nodeId, setNodeId] = useState(3);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // const onPaneDoubleClick = useCallback(
  //   (event: React.MouseEvent) => {
  //     const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  //     const position = {
  //       x: event.clientX - rect.left - 100,
  //       y: event.clientY - rect.top - 50,
  //     };

  //     const newNode: Node = {
  //       id: `${nodeId}`,
  //       type: NodeType.STICKY_NOTE,
  //       position,
  //       data: { content: "" },
  //     };

  //     setNodes((nds) => [...nds, newNode]);
  //     setNodeId((id) => id + 1);
  //   },
  //   [nodeId, setNodes],
  // );

  // const onNodeDelete = useCallback(
  //   (nodeId: string) => {
  //     setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  //     setEdges((eds) =>
  //       eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
  //     );
  //   },
  //   [setNodes, setEdges],
  // );

  // const onNodeContentChange = useCallback(
  //   (nodeId: string, content: string) => {
  //     setNodes((nds) =>
  //       nds.map((node) =>
  //         node.id === nodeId
  //           ? { ...node, data: { ...node.data, content } }
  //           : node,
  //       ),
  //     );
  //   },
  //   [setNodes],
  // );

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
