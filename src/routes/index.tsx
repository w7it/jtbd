import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "@/components/editor/Editor";
import { PageSpinner } from "@/components/ui/page-spinner.tsx";
import { useBoardData } from "@/hooks/useBoardData.ts";
import { useCurrentProject } from "@/hooks/useCurrentProject.ts";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [currentProject] = useCurrentProject();
  const boardData = useBoardData(currentProject?.boardId ?? null);

  if (!boardData) {
    return <PageSpinner />;
  }

  return <Editor {...boardData} />;
}
