import { Spinner } from "./spinner.tsx";

export function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center p-6 md:p-10">
      <Spinner />
    </div>
  );
}
