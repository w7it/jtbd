import { useCurrentProject } from "@/hooks/useCurrentProject.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useProjects } from "@/hooks/useProjects.tsx";

export function ProjectSwitcher() {
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
        <Button variant="secondary">{currentProject.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <ProjectList setCurrentProjectId={setCurrentProjectId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ProjectListProps = {
  setCurrentProjectId: (id: string) => void;
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
          {project.name}
        </DropdownMenuItem>
      ))}
    </>
  );
}
