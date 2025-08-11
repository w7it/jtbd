import { useCurrentProject } from "@/hooks/useCurrentProject.ts";
import { authClient } from "@/lib/authClient.ts";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useProjects } from "@/hooks/useProjects.ts";
import { ProjectId } from "@/lib/genId.ts";

export function ProjectSwitcher() {
  const session = authClient.useSession();

  if (session.isPending) {
    return null;
  }

  if (!session.data?.user) {
    return (
      <Button variant="ghost" className="!cursor-default" disabled>
        Demo project
      </Button>
    );
  }

  return <ProjectSwitcherForUser />;
}

function ProjectSwitcherForUser() {
  const [currentProject, setCurrentProjectId] = useCurrentProject();

  if (!currentProject) {
    return (
      <Button variant="secondary" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">{currentProject.title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <ProjectList setCurrentProjectId={setCurrentProjectId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ProjectListProps = {
  setCurrentProjectId: (id: ProjectId) => void;
};

function ProjectList({ setCurrentProjectId }: ProjectListProps) {
  const { data: projects } = useProjects();

  return (
    <>
      <DropdownMenuLabel>Switch project</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {projects?.map((project) => (
        <DropdownMenuItem
          key={project.id}
          onClick={() => setCurrentProjectId(project.id)}
        >
          {project.title}
        </DropdownMenuItem>
      ))}
    </>
  );
}
