import type { PlanId } from "@/lib/pricing"

// Who's signed in, for the app shell: their name and role in the account
// menu, their plan for what the navigation offers, and how far through
// the Business Assessment they are, which unlocks Leadership OS.

export type Viewer = {
  name: string
  role: string
  planId: PlanId
  /** Business Assessment progress, 0–100. Leadership OS unlocks at 100. */
  businessAssessmentPercent: number
}

/** "Jordan Ellis" → "JE". */
export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

/**
 * The signed-in executive. No account store is connected yet, so every
 * visitor is the same sample executive; then this reads the session.
 */
export async function getViewer(): Promise<Viewer> {
  return {
    name: "Jordan Ellis",
    role: "CEO, Meridian Health",
    planId: "Alignment",
    businessAssessmentPercent: 0,
  }
}
