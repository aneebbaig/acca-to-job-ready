import Link from "next/link";
import { Compass, ListChecks, LogOut, Settings, Users } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { isAdminRole } from "@/lib/auth-guards";

export function AppHeader({
  name,
  role,
}: {
  name?: string | null;
  role: string;
}) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Compass className="size-5" aria-hidden />
          <span>Job-Ready</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          <Button render={<Link href="/roadmap" />} variant="ghost" size="sm">
            Roadmap
          </Button>
          <Button render={<Link href="/review" />} variant="ghost" size="sm">
            <ListChecks className="size-4" aria-hidden />
            Review
          </Button>
          <Button render={<Link href="/settings/ai" />} variant="ghost" size="sm">
            <Settings className="size-4" aria-hidden />
            Settings
          </Button>
          {isAdminRole(role) && (
            <Button
              render={<Link href="/settings/users" />}
              variant="ghost"
              size="sm"
            >
              <Users className="size-4" aria-hidden />
              Users
            </Button>
          )}
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              title={name ? `Signed in as ${name}` : undefined}
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
