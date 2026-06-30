import Link from "next/link";
import { requireUser } from "@/lib/auth-guards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          One clear next step at a time. Let&apos;s find where you are.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Start your roadmap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Choose a path and open your first topic. You can change track later.
          </p>
          <Button render={<Link href="/roadmap" />}>Open the roadmap</Button>
        </CardContent>
      </Card>
    </div>
  );
}
