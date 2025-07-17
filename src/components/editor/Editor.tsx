import { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { COMPONENTS_BY_TYPE, NodeType } from "./node.ts";
import { Overlay } from "./Overlay.tsx";

const initialNodes: Node[] = [
  {
    id: "1",
    type: NodeType.STICKY_NOTE,
    position: { x: 100, y: 100 },
    width: 100,
    height: 100,
    data: { content: "Welcome to JTBD Builder!" },
  },
  {
    id: "2",
    type: NodeType.STICKY_NOTE,
    position: { x: 400, y: 150 },
    width: 100,
    height: 100,
    data: { content: "Double-click anywhere to create a new note" },
  },
];

const initialEdges: Edge[] = [];

export function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(3);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left - 100,
        y: event.clientY - rect.top - 50,
      };

      const newNode: Node = {
        id: `${nodeId}`,
        type: NodeType.STICKY_NOTE,
        position,
        data: { content: "" },
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
    },
    [nodeId, setNodes],
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    },
    [setNodes, setEdges],
  );

  const onNodeContentChange = useCallback(
    (nodeId: string, content: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, content } }
            : node,
        ),
      );
    },
    [setNodes],
  );

  return (
    <div className="h-screen w-full relative">
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
        <Controls />
      </ReactFlow>

      <Overlay />
    </div>
  );
}
