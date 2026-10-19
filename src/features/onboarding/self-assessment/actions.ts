"use server"

import { redirect } from "next/navigation"

import { executiveProfileSchema } from "@/schemas/executiveProfileSchema"

// The design continues to the self-assessment proper (choosing chat or
// form), which isn't built yet; until it is, the lead lands on the
// dashboard.
const NEXT_STEP = "/dashboard"

export type SaveProfileResult = { error: string }

/** Saves the executive profile captured before the self-assessment. */
export async function saveExecutiveProfile(input: unknown): Promise<SaveProfileResult> {
  const parsed = executiveProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your answers and try again." }
  }

  // No account store is connected yet, so the profile isn't saved. When
  // one is, store parsed.data against the lead — the role and focus shape
  // the questions that follow, and "why" is for their coach.
  redirect(NEXT_STEP)
}
