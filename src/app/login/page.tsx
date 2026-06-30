import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { needsFirstRunSetup } from "@/lib/users";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // No accounts yet → send to first-run setup.
  if (await needsFirstRunSetup()) redirect("/setup");
  // Already signed in → go home.
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to pick up where you left off.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
