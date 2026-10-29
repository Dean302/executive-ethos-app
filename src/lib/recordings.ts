import { connection } from "next/server"

import { CRITERIA } from "@/lib/criteria"
import { DAY_MS, wallClock } from "@/lib/dates"
import type { CriterionScores, ScoredRecording } from "@/lib/scores"

// The executive's recordings: every meeting or practice they recorded or
// uploaded, scored on the six criteria.

export const RECORDING_TYPES = ["1:1", "Team", "Executive", "Board", "Presentation", "Pitch", "Weekly"] as const
export type RecordingType = (typeof RECORDING_TYPES)[number]

export type Recording = ScoredRecording & {
  id: string
  title: string
  type: RecordingType
  /** When it was recorded, as the executive's wall-clock time in milliseconds (see lib/dates). */
  recordedAt: number
  /** "38 min". */
  duration: string
  /** Flagged to discuss with the coach, and not yet discussed. */
  flaggedForCoach: boolean
}

/** Score change against the recording before; null for the first. */
export function changeFrom(recordings: Recording[], index: number) {
  const older = recordings[index + 1]
  return older ? recordings[index].score - older.score : null
}

// A sample history, newest first, standing in until recordings are stored
// and scored. Scores per criterion run clarity, vocal, business, audience,
// presence, time.
type SampleRow = [
  id: string,
  title: string,
  type: RecordingType,
  score: number,
  dateLabel: string,
  ageDays: number,
  duration: string,
  flagged: boolean,
  scores: number[],
]

const SAMPLE_HISTORY: SampleRow[] = [
  ["s4", "Q3 Board Presentation", "Board", 78, "2 days ago", 2, "38 min", true, [8.0, 7.2, 8.6, 8.3, 8.5, 6.2]],
  ["s3", "Monday Leadership Meeting", "Weekly", 71, "5 days ago", 5, "26 min", false, [7.4, 6.8, 7.9, 7.3, 7.3, 5.9]],
  ["s2", "Investor Pitch Rehearsal", "Pitch", 69, "1 week ago", 7, "12 min", true, [7.2, 6.6, 7.9, 6.8, 7.0, 5.9]],
  ["s1", "All-Hands Q&A", "Team", 73, "2 weeks ago", 14, "45 min", false, [7.4, 6.9, 8.0, 7.8, 7.4, 6.3]],
  ["s5", "Product Launch Rehearsal", "Presentation", 65, "3 weeks ago", 21, "16 min", false, [6.9, 6.1, 7.4, 6.5, 6.7, 5.4]],
  ["s6", "Series B Pitch Prep", "Pitch", 61, "5 weeks ago", 35, "14 min", false, [6.4, 5.2, 7.2, 5.9, 6.6, 5.3]],
  ["s7", "Weekly Leadership Meeting", "Weekly", 64, "6 weeks ago", 42, "29 min", false, [6.6, 6.0, 7.3, 6.5, 6.6, 5.4]],
  ["s8", "All-Hands Q&A", "Team", 61, "8 weeks ago", 56, "41 min", false, [6.2, 5.8, 6.9, 6.3, 6.3, 5.1]],
  ["s9", "First Board Update", "Board", 58, "10 weeks ago", 70, "33 min", false, [6.0, 5.4, 6.8, 5.6, 6.1, 4.9]],
]

/**
 * The signed-in executive's scored recordings, newest first, with their
 * times on the executive's own clock. Until recordings are stored and
 * scored, every executive sees the sample history; then this reads
 * theirs.
 */
export async function getRecordings(timeZone: string): Promise<Recording[]> {
  // Per request: the sample's dates count back from today.
  await connection()
  const now = wallClock(new Date(), timeZone).getTime()
  return SAMPLE_HISTORY.map(([id, title, type, score, dateLabel, ageDays, duration, flagged, scores]) => ({
    id,
    title,
    type,
    score,
    dateLabel,
    ageDays,
    recordedAt: now - ageDays * DAY_MS,
    duration,
    flaggedForCoach: flagged,
    criteria: Object.fromEntries(CRITERIA.map(({ key }, i) => [key, scores[i]])) as CriterionScores,
  }))
}
