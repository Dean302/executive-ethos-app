"use server"

import { executiveProfileSchema } from "@/schemas/executiveProfileSchema"

export type SaveProfileResult = { ok: true } | { error: string }

/** Saves the executive profile captured before the self-assessment. */
export async function saveExecutiveProfile(input: unknown): Promise<SaveProfileResult> {
  const parsed = executiveProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your answers and try again." }
  }

  // No account store is connected yet, so the profile isn't saved. When
  // one is, store parsed.data against the lead — the role and focus shape
  // the questions that follow, and "why" is for their coach.
  return { ok: true }
}
