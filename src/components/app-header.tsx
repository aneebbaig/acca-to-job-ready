import Link from "next/link";
import { Compass, ListChecks, LogOut, Map, Settings, Users } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { isAdminRole } from "@/lib/auth-guards";

// Icon-only on phones (big tap targets, no overflow), labels from `sm` up (§10).
export function AppHeader({
  name,
  role,
}: {
  name?: string | null;
  role: string;
}) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Compass className="text-brass size-5" aria-hidden />
          <span className="font-heading text-lg font-semibold tracking-tight">
            Job-Ready
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5">
          <Button render={<Link href="/roadmap" />} variant="ghost" size="sm" title="Roadmap">
            <Map className="size-4" aria-hidden />
            <span className="hidden sm:inline">Roadmap</span>
          </Button>
          <Button render={<Link href="/review" />} variant="ghost" size="sm" title="Mistake review">
            <ListChecks className="size-4" aria-hidden />
            <span className="hidden sm:inline">Review</span>
          </Button>
          <Button render={<Link href="/settings/ai" />} variant="ghost" size="sm" title="Settings">
            <Settings className="size-4" aria-hidden />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          {isAdminRole(role) && (
            <Button
              render={<Link href="/settings/users" />}
              variant="ghost"
              size="sm"
              title="Users"
            >
              <Users className="size-4" aria-hidden />
              <span className="hidden sm:inline">Users</span>
            </Button>
          )}
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              title={name ? `Sign out (${name})` : "Sign out"}
            >
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
