import { DAY_MS } from "@/lib/dates"

// Flags: a recording the executive wants to talk through with their coach,
// with an optional note saying why. The coach sees it when preparing the
// next session, and once it's been covered marks it discussed, with what
// came of it. Flagging again reopens it.

/** The note's limit, a short paragraph. */
export const FLAG_NOTE_MAX_LENGTH = 1000

export type CoachFlag = {
  flagged: boolean
  note: string
  /** Wall-clock milliseconds (see lib/dates). */
  flaggedAt?: number
  /** Set once the coach has covered it. */
  resolvedAt?: number
  /** What the coach and executive agreed. */
  outcome?: string
}

export const NO_FLAG: CoachFlag = { flagged: false, note: "" }

/** Flagged and still waiting to be discussed. */
export const isOpenFlag = (flag: CoachFlag | undefined) => !!flag?.flagged && !flag.resolvedAt

/**
 * The signed-in executive's flags by recording. Until flags are stored,
 * every executive has the sample: two open (one with a note) and two the
 * coach already covered.
 */
export async function getCoachFlags(now: number): Promise<Record<string, CoachFlag>> {
  const daysAgo = (days: number) => now - days * DAY_MS
  return {
    s4: { flagged: true, note: "", flaggedAt: daysAgo(2) },
    s2: {
      flagged: true,
      note: "Lost the room when the valuation question came up. How do I handle that live?",
      flaggedAt: daysAgo(6),
    },
    s6: {
      flagged: true,
      note: "Felt rushed through the market-size section.",
      flaggedAt: daysAgo(34),
      resolvedAt: daysAgo(27),
      outcome: "Covered pacing: pause after every key number. Rehearse the section out loud before the next pitch.",
    },
    s8: {
      flagged: true,
      note: "Ran out of time for questions again.",
      flaggedAt: daysAgo(55),
      resolvedAt: daysAgo(48),
      outcome: "Agreed a two-minute cap per answer and a closing summary slot.",
    },
  }
}
