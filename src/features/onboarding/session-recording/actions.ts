"use server"

import { sessionSampleSchema } from "@/schemas/sessionSampleSchema"

export type SubmitSampleResult = { ok: true } | { error: string }

/**
 * Queues the lead's onboarding sample for analysis: the one objective
 * input available straight away, while the self-assessment is
 * self-reported and peer reviews take time to come back. It's a sample,
 * not a scored session.
 */
export async function submitSessionSample(input: unknown): Promise<SubmitSampleResult> {
  const parsed = sessionSampleSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "We couldn't use that file. Choose another." }
  }

  // No file store or analysis service is connected yet, so nothing is
  // uploaded or queued. When they are: the client uploads the file
  // straight to storage with a signed URL (recordings run to hundreds of
  // megabytes, too large to pass through a Server Action), and this
  // action checks the stored object against these details and queues
  // transcription and analysis.
  return { ok: true }
}
