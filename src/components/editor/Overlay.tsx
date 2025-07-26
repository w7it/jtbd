import { AppMenu } from "../app-menu/AppMenu.tsx";

export function Overlay() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 max-w-sm z-10">
        <AppMenu />
      </div>
    </div>
  );
}
