import { redirect } from "next/navigation";
import { needsFirstRunSetup } from "@/lib/users";
import { SetupForm } from "./setup-form";

export const metadata = { title: "Create administrator account" };
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  // Permanently disabled after the first account exists.
  if (!(await needsFirstRunSetup())) redirect("/login");

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8">
        <p className="text-muted-foreground text-sm font-medium">First-time setup</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Create the administrator account
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This is the first and only time you&apos;ll see this screen. The account
          you create here manages everyone else.
        </p>
      </div>
      <SetupForm />
    </main>
  );
}
