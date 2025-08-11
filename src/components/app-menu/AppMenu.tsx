import { ProjectSaveButton } from "./ProjectSaveButton.tsx";
import { ProjectSwitcher } from "./ProjectSwitcher.tsx";
import { UserMenu } from "./UserMenu.tsx";

type AppMenuProps = {
  readonly hasChanges: boolean;
  readonly onSave: () => void;
};

export function AppMenu(props: AppMenuProps) {
  return (
    <div className="pointer-events-auto cursor-default bg-background border rounded-lg shadow-lg p-1 flex gap-1">
      <UserMenu />
      <ProjectSwitcher />
      {props.hasChanges && <ProjectSaveButton onClick={props.onSave} />}
    </div>
  );
}
