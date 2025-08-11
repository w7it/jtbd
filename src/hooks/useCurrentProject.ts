import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProjectById, getProjects } from "@/server/functions/projects";
import { useEffect } from "react";
import { authClient } from "@/lib/authClient.ts";
import { useLocalStorage } from "./useLocalStorage.ts";
import { BoardId, ProjectId } from "@/lib/genId.ts";

type Project = {
  readonly id: ProjectId;
  readonly title: string;
  readonly description: string | null;
  readonly boardId: BoardId | null;
};

const CURRENT_PROJECT_QUERY_KEY = "currentProject";

export function useCurrentProject(): readonly [
  currentProject: Project | null,
  setCurrentProjectId: (id: Project["id"]) => void,
] {
  const [currentProjectId, setCurrentProjectId] = useLocalStorage(
    CURRENT_PROJECT_QUERY_KEY,
    null as Project["id"] | null,
  );

  const getProjectByIdFn = useServerFn(getProjectById);
  const { data: currentProject, isLoading } = useQuery({
    queryKey: [CURRENT_PROJECT_QUERY_KEY],
    queryFn: () =>
      currentProjectId
        ? getProjectByIdFn({ data: { projectId: currentProjectId } })
        : null,
    enabled: !!currentProjectId,
  });

  // If current project is not found, set it to the first project
  const session = authClient.useSession();
  const getProjectsFn = useServerFn(getProjects);
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsFn,
    enabled: !!session.data?.user && !currentProject && !isLoading,
  });
  useEffect(() => {
    if (currentProject) return;
    if (!projects) return;

    const [firstProject] = projects;
    if (!firstProject) return;

    setCurrentProjectId(firstProject.id);
  }, [currentProject, projects]);

  return [currentProject ?? null, setCurrentProjectId];
}
