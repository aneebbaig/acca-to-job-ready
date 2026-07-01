import "server-only";
import { z } from "zod";
import type { ProviderId } from "@/lib/ai/types";
import { AIError } from "@/lib/ai/types";
import { runLLM, parseJSONLoose } from "@/lib/ai/run";

// A downloadable messy dataset for real-Excel practice with a self-check (§9
// fast-follow). The learner downloads the CSV, does the task in Excel/Sheets,
// then checks their answer against selfCheck.
const datasetSchema = z.object({
  filename: z.string().min(1).max(80),
  csv: z.string().min(20),
  task: z.string().min(1),
  selfCheck: z.string().min(1),
});
export type PracticeDataset = z.infer<typeof datasetSchema>;

const SYSTEM = `You create downloadable spreadsheet practice for an ACCA training app. Return ONLY a JSON object, no prose.

Shape:
{
  "filename": "short-name.csv",
  "csv": "raw CSV text: one header row then 15-30 data rows",
  "task": "what the learner should do in Excel/Sheets",
  "selfCheck": "the exact answer they should get, so they can verify (a number or short value)"
}

Rules:
- Make the data realistic and self-consistent; use PKR for money.
- Add mild, realistic messiness (inconsistent casing, stray spaces, a couple of text-formatted numbers) so cleaning matters, but keep it solvable.
- The selfCheck must be arithmetically correct for the data you generated. Double-check it.
- Do not invent real company data, real people, tax rates, or URLs.`;

export async function generateDataset(
  provider: ProviderId,
  apiKey: string,
  model: string,
  topicTitle: string,
  concepts: string[],
): Promise<PracticeDataset> {
  const user = `Topic: ${topicTitle}
Concepts to exercise: ${concepts.join("; ")}
Produce a dataset and a task that make the learner actually use Excel (a pivot, a lookup, conditional totals, or cleaning), with a self-check answer.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const { text } = await runLLM(provider, {
      apiKey,
      model,
      system: SYSTEM,
      user,
      json: true,
      maxTokens: 2500,
    });
    try {
      const parsed = datasetSchema.parse(parseJSONLoose(text));
      // Normalise the filename to a safe .csv name.
      const safe = parsed.filename
        .replace(/[^a-z0-9._-]/gi, "-")
        .replace(/-+/g, "-");
      return { ...parsed, filename: safe.endsWith(".csv") ? safe : `${safe}.csv` };
    } catch {
      /* retry once */
    }
  }
  throw new AIError("Couldn't build a practice dataset. Try again.");
}
