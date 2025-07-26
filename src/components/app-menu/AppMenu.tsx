import { ButtonGroup } from "../ui/button-group.tsx";
import { ProjectSwitcher } from "./ProjectSwitcher.tsx";
import { UserMenu } from "./UserMenu.tsx";

export function AppMenu() {
  return (
    <div className="rounded-md shadow-lg pointer-events-auto">
      <ButtonGroup>
        <ProjectSwitcher />
        <UserMenu />
      </ButtonGroup>
    </div>
  );
}
