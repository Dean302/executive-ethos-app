// The six criteria every recording is scored on, from the founder's
// scoring rubric. Scores run 0–10 per criterion.

export const CRITERIA = [
  { key: "clarity", label: "Clarity & Structure" },
  { key: "vocal", label: "Vocal Energy & Pacing" },
  { key: "business", label: "Business Connection" },
  { key: "audience", label: "Audience Engagement & Inclusivity" },
  { key: "presence", label: "Executive Presence & Command" },
  { key: "time", label: "Time Management & Flow" },
] as const

export type CriterionKey = (typeof CRITERIA)[number]["key"]

/**
 * The overall target, out of 100: fixed and the same for everyone, not
 * the sum of the per-criterion goals. Above it means nothing further.
 */
export const EXECUTIVE_READY_SCORE = 85
