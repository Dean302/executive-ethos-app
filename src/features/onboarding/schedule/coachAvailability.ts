import "server-only"

import type { SessionStartTime, Weekday } from "@/lib/schedule"

/** Start times the coach has open, by weekday. */
export type CoachAvailability = Record<Weekday, SessionStartTime[]>

// Sample week from the design — open slots vary by day, and Friday ends
// early. Stands in for the coach's real calendar.
const SAMPLE_AVAILABILITY: CoachAvailability = {
  1: [540, 600, 660, 840, 900],
  2: [540, 600, 780, 840, 960],
  3: [600, 660, 780, 900, 960],
  4: [540, 660, 780, 840, 900],
  5: [540, 600, 660, 780],
}

/**
 * The coach's open standing slots. No calendar is connected yet, so this
 * returns the design's sample week; read the coach's real availability
 * here once one is.
 */
export async function getCoachAvailability(): Promise<CoachAvailability> {
  return SAMPLE_AVAILABILITY
}
