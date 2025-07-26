import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentProject,
  setCurrentProject,
} from "@/server/functions/project.ts";
import { useCallback } from "react";

type Project = {
  readonly id: string;
  readonly name: string;
};

const CURRENT_PROJECT_QUERY_KEY = "currentProject";

export function useCurrentProject(): readonly [
  currentProject: Project | null,
  setCurrentProjectId: (id: Project["id"]) => void,
] {
  const getCurrentProjectFn = useServerFn(getCurrentProject);
  const setCurrentProjectFn = useServerFn(setCurrentProject);
  const { data: currentProject } = useQuery({
    queryKey: [CURRENT_PROJECT_QUERY_KEY],
    queryFn: getCurrentProjectFn,
  });
  const queryClient = useQueryClient();

  const setCurrentProjectId = useCallback(
    (id: Project["id"]) => {
      setCurrentProjectFn({ data: { projectId: id } }).then((newProject) => {
        queryClient.setQueryData([CURRENT_PROJECT_QUERY_KEY], newProject);
      });
    },
    [setCurrentProjectFn],
  );

  return [currentProject ?? null, setCurrentProjectId];
}
