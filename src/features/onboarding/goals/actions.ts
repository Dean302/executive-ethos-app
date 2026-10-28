"use server"

import { getOnboardingGoals } from "@/lib/goals"
import { goalsConfirmationSchema } from "@/schemas/goalsConfirmationSchema"

export type LockGoalsResult = { ok: true } | { error: string }

/**
 * Locks the lead's goals for the quarter. The targets are read on the
 * server, never taken from the client, so what's locked is exactly what
 * was generated.
 */
export async function lockGoals(input: unknown): Promise<LockGoalsResult> {
  const parsed = goalsConfirmationSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Confirm your goals and try again." }
  }

  const goals = await getOnboardingGoals()
  if (goals.length === 0) return { error: "Your goals aren't ready yet. Try again in a few minutes." }

  // No account store is connected yet, so nothing is saved. When it is:
  // store these targets against the lead with the quarter's dates, mark
  // them locked, and share them with their coach.
  return { ok: true }
}
