import { ProjectSwitcher } from "./ProjectSwitcher.tsx";
import { UserMenu } from "./UserMenu.tsx";

export function AppMenu() {
  return (
    <div className="pointer-events-auto bg-background border rounded-lg shadow-lg p-1 flex gap-1">
      <ProjectSwitcher />
      <UserMenu />
    </div>
  );
}
