import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button.tsx";

type ProjectSaveButtonProps = {
  readonly onClick: () => void;
};

export function ProjectSaveButton(props: ProjectSaveButtonProps) {
  return (
    <Button title="Save project" onClick={props.onClick}>
      <SaveIcon className="w-4 h-4" />
      <span>Save</span>
    </Button>
  );
}
