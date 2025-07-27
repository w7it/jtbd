import { Link } from "@tanstack/react-router";
import { User2 } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { authClient } from "@/lib/authClient.ts";

export function UserMenu() {
  const session = authClient.useSession();

  if (session.isPending) {
    return null;
  }

  if (session.data?.user) {
    return (
      <Button size="icon" variant="ghost">
        <User2 />
      </Button>
    );
  }

  return (
    <Button size="icon" variant="ghost" asChild>
      <Link to="/sign-in">
        <User2 />
      </Link>
    </Button>
  );
}
