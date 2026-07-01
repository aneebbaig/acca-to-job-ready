import "server-only";
import type { ProviderId } from "@/lib/ai/types";
import { runLLM, parseJSONLoose } from "@/lib/ai/run";
import type { TaskType } from "@/curriculum/types";
import {
  codeCheckOf,
  familyOf,
  gradeSchema,
  type AnswerKey,
  type GeneratedTask,
  type Grade,
  type Submission,
} from "./schema";
import { gradeNumericRows } from "./validate";

const INTERVIEW_TYPES: TaskType[] = ["technical_viva", "hr_behavioural"];

function mcqGrade(key: AnswerKey, submission: Submission): Grade {
  const correct = new Set(key.correctOptionIds ?? []);
  const chosen = new Set(submission.selectedOptionIds ?? []);
  const exactly =
    correct.size === chosen.size && [...correct].every((c) => chosen.has(c));
  return {
    score: exactly ? 1 : 0,
    points: [
      {
        label: "Answer",
        status: exactly ? "correct" : "wrong",
        comment: exactly
          ? "Correct."
          : "Not quite — see the worked solution below.",
      },
    ],
    tip: exactly
      ? "Solid. Try a harder variant."
      : "Re-read the cheatsheet for this concept, then retry.",
  };
}

const GRADER_SYSTEM = `You grade a learner's answer for an ACCA training app. Return ONLY a JSON object, no prose.
Be honest and specific. If you are not sure about something, say so in "uncertainty" rather than bluffing. Never invent standard numbers, tax rates, or fees.

Shape:
{
  "score": number 0..1,
  "points": [ {"label": "string", "status": "correct|partial|wrong|missing", "comment": "string"} ],
  "tip": "one concrete 'next time, do this' tip",
  "interviewerNote": "string (ONLY for interview-style tasks: how an interviewer would rate this)",
  "uncertainty": "string (optional: anything you're unsure about)"
}`;

async function aiGrade(
  provider: ProviderId,
  apiKey: string,
  model: string,
  taskType: TaskType,
  task: GeneratedTask,
  key: AnswerKey,
  submission: Submission,
  codeNote: string | null,
): Promise<Grade> {
  const isInterview = INTERVIEW_TYPES.includes(taskType);
  const user = `Task type: ${taskType}
Scenario: ${task.scenario}
Instructions: ${task.instructions}

Worked solution (the truth): ${key.workedSolution}
${key.rubricPoints ? `Rubric points the answer should cover:\n${key.rubricPoints.map((p) => `- ${p.point}`).join("\n")}` : ""}

Learner's submission: ${JSON.stringify(submission)}
${codeNote ? `\nNote: an automated check already verified the arithmetic — ${codeNote}. Do NOT re-score the numbers; explain the result and give feedback.` : ""}
${isInterview ? "\nThis is an interview-style task: include an interviewerNote on how an interviewer would rate this." : ""}

Grade it now as JSON.`;

  const { text } = await runLLM(provider, {
    apiKey,
    model,
    system: GRADER_SYSTEM,
    user,
    json: true,
    maxTokens: 1500,
  });
  const parsed = parseJSONLoose(text);
  const result = gradeSchema.safeParse(parsed);
  if (!result.success) {
    // Fall back to a minimal honest result rather than crash.
    return {
      score: 0.5,
      points: [
        {
          label: "Feedback",
          status: "partial",
          comment: "The grader's response couldn't be read fully. Compare your answer with the worked solution below.",
        },
      ],
      tip: "Re-read the worked solution and try again.",
      uncertainty: "Automated grading was incomplete for this attempt.",
    };
  }
  return result.data;
}

export async function gradeSubmission(
  provider: ProviderId,
  apiKey: string,
  model: string,
  taskType: TaskType,
  task: GeneratedTask,
  key: AnswerKey,
  submission: Submission,
): Promise<Grade> {
  const fam = familyOf(taskType);

  // MCQ: pure code, no AI call needed.
  if (fam === "mcq") return mcqGrade(key, submission);

  const check = codeCheckOf(taskType);
  if (check) {
    // Numbers are code-authoritative; AI only explains (§8.1).
    const code = gradeNumericRows(taskType, key, submission);
    const aiPart = await aiGrade(
      provider,
      apiKey,
      model,
      taskType,
      task,
      key,
      submission,
      code ? `score ${(code.score * 100).toFixed(0)}%` : null,
    );
    return {
      score: code ? code.score : aiPart.score,
      points: [...(code?.points ?? []), ...aiPart.points],
      tip: aiPart.tip,
      interviewerNote: aiPart.interviewerNote,
      uncertainty: aiPart.uncertainty,
    };
  }

  // Text / rubric tasks: AI-graded.
  return aiGrade(provider, apiKey, model, taskType, task, key, submission, null);
}
