import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder for the assessment engine (wired in a later build step). Kept
// honest and never a dead-end (§10): it always says what's next.
export function TopicPractice({
  hasSkillSpec,
}: {
  slug: string;
  hasSkillSpec: boolean;
}) {
  if (!hasSkillSpec) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-5 text-sm">
          Guided practice for this topic is on the way. For now, work through the
          cheatsheet and add your own resources below.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 py-5">
        <p className="text-sm">
          Practice here is graded by AI using your own API key, so it stays free
          and private. Add a key once to unlock it.
        </p>
        <Button render={<Link href="/settings/ai" />} size="sm">
          Set up practice
        </Button>
      </CardContent>
    </Card>
  );
}
