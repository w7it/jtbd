import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "@/components/editor/Editor";
import { PageSpinner } from "@/components/ui/page-spinner.tsx";
import { useBoardData } from "@/hooks/useBoardData.ts";
import { useCurrentProject } from "@/hooks/useCurrentProject.ts";
import { useBoardSaver } from "@/hooks/useBoardSaver.ts";
import { AppMenu } from "@/components/app-menu/AppMenu.tsx";
import { useCallback } from "react";
import { addEdge, Connection } from "@xyflow/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [currentProject] = useCurrentProject();
  const boardId = currentProject?.boardId ?? null;
  const boardData = useBoardData(boardId);
  const {
    nodes,
    edges,
    setEdges,
    hasChanges,
    saveBoard,
    onNodesChange,
    onEdgesChange,
  } = useBoardSaver({
    boardId,
    boardData,
  });
  const navigate = Route.useNavigate();

  const handleSave = useCallback(() => {
    if (!boardId) {
      navigate({ to: "/sign-in" });
      return;
    }

    saveBoard();
  }, [saveBoard, boardId]);

  const handleConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  if (!boardData) {
    return <PageSpinner />;
  }

  return (
    <Editor
      nodes={nodes}
      edges={edges}
      onConnect={handleConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <div className="absolute top-2 left-2 max-w-sm z-10">
        <AppMenu hasChanges={hasChanges} onSave={handleSave} />
      </div>
    </Editor>
  );
}
