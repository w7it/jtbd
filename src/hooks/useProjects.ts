import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/server/functions/projects";
import { authClient } from "@/lib/authClient.ts";

export function useProjects() {
  const session = authClient.useSession();
  const getProjectsFn = useServerFn(getProjects);

  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsFn,
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!session.data?.user,
  });
}
