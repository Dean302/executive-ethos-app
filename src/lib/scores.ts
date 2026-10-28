import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"

// Executive Readiness: the overall score out of 100, and the five levels
// of the founder's scoring rubric it falls into (1–2, 3–4, 5–6, 7–8 and
// 9–10 per criterion, here on the 100 scale). The descriptions are plain-
// language placeholders for the founder to refine.

export const LEVELS = [
  { name: "Blind spot", min: 0, max: 30, description: "Habits you can't see yet are getting in the way of the message." },
  { name: "Emerging", min: 30, max: 50, description: "The fundamentals show up, but not consistently." },
  {
    name: "Developing",
    min: 50,
    max: 70,
    description: "Solid in familiar settings. Slips when the stakes or pressure rise.",
  },
  {
    name: "Proficient",
    min: 70,
    max: 90,
    description: `Clear and credible most of the time. Executive Ready (${EXECUTIVE_READY_SCORE}) is reached inside this level.`,
  },
  {
    name: "Executive mastery",
    shortName: "Mastery",
    min: 90,
    max: 100,
    description: "Commands the room in any setting, including the highest-stakes ones.",
  },
] as const

export type Level = (typeof LEVELS)[number]

/** The level a score falls in. */
export function levelFor(score: number): Level {
  return LEVELS.find((level) => score < level.max) ?? LEVELS[LEVELS.length - 1]
}

export type Target = { label: string; at: number }

/**
 * What to aim for next: Executive Ready until it's reached, then the next
 * level up. Null at the top.
 */
export function targetFor(score: number): Target | null {
  if (score < EXECUTIVE_READY_SCORE) return { label: "Executive Ready", at: EXECUTIVE_READY_SCORE }
  const next = LEVELS.find((level) => level.min > score)
  return next ? { label: next.name, at: next.min } : null
}

export type ScoredRecording = {
  /** Executive Readiness for this recording, 0–100. */
  score: number
  /** When, for display: "2 days ago". */
  dateLabel: string
}

export type Readiness = {
  /** Where they stand now: the latest recording's score. */
  score: number
  latest: ScoredRecording
  /** The first scored recording, their baseline. */
  start: ScoredRecording
  recordings: number
  /** Latest against the one before it; null with a single recording. */
  lastChange: number | null
  /** Since the baseline. */
  totalGrowth: number
  /** Average change per recording since the baseline, to one decimal; null with a single recording. */
  perRecording: number | null
}

/** The readiness story from an executive's scored recordings, newest first. Null before the first. */
export function summariseReadiness(recordings: ScoredRecording[]): Readiness | null {
  const [latest, previous] = recordings
  const start = recordings[recordings.length - 1]
  if (!latest || !start) return null
  const steps = recordings.length - 1
  return {
    score: latest.score,
    latest,
    start,
    recordings: recordings.length,
    lastChange: previous ? latest.score - previous.score : null,
    totalGrowth: latest.score - start.score,
    perRecording: steps > 0 ? Math.round(((latest.score - start.score) / steps) * 10) / 10 : null,
  }
}

/** "+7", "−3", "0": a change with its sign. */
export function formatChange(value: number) {
  if (value > 0) return `+${value}`
  if (value < 0) return `−${Math.abs(value)}`
  return "0"
}
