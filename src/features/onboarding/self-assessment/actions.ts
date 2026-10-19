"use server"

import { selfAssessmentSchema } from "@/schemas/selfAssessmentSchema"

export type SubmitAssessmentResult = { ok: true } | { error: string }

/**
 * Submits the finished self-assessment. Every answer is checked here
 * again, whichever way it was taken (form or chat).
 */
export async function submitSelfAssessment(input: unknown): Promise<SubmitAssessmentResult> {
  const parsed = selfAssessmentSchema.safeParse(input)
  if (!parsed.success) {
    return { error: "Some answers are missing. Go back and finish every question, then try again." }
  }

  // No account store is connected yet, so nothing is saved. When one is,
  // store parsed.data against the lead as their baseline: it's compared
  // with peer reviews and recording scores later.
  return { ok: true }
}
