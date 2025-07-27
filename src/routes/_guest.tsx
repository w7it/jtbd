import { PageSpinner } from "@/components/ui/page-spinner.tsx";
import { authClient } from "@/lib/authClient.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.user) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const { data, isPending } = authClient.useSession();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (data?.user) {
      navigate({ to: "/" });
    }
  }, [data?.user]);

  if (isPending || data?.user) {
    return <PageSpinner />;
  }

  return <Outlet />;
}
