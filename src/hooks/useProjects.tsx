import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/server/functions/project";

export function useProjects() {
  const getProjectsFn = useServerFn(getProjects);

  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsFn,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
