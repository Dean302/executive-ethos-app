import { CRITERIA, type CriterionKey } from "@/lib/criteria"
import { getOnboardingGoals } from "@/lib/goals"
import { summariseReadiness, type CriterionScores, type Readiness, type ScoredRecording } from "@/lib/scores"

// What the executive's dashboard shows, gathered in one place so the page
// makes a single call.

export type CriterionTarget = { key: CriterionKey; label: string; goal: number }

export type Dashboard = {
  /** Null until their first recording is scored. */
  readiness: Readiness | null
  /** Scored recordings, newest first. */
  recordings: ScoredRecording[]
  /** The quarter's locked goal for each criterion, in rubric order. */
  targets: CriterionTarget[]
}

// A sample history, newest first, standing in until recordings are stored
// and scored. Scores per criterion run clarity, vocal, business, audience,
// presence, time.
const SAMPLE_HISTORY: [score: number, dateLabel: string, ageDays: number, scores: number[]][] = [
  [78, "2 days ago", 2, [8.0, 7.2, 8.6, 8.3, 8.5, 6.2]],
  [71, "5 days ago", 5, [7.4, 6.8, 7.9, 7.3, 7.3, 5.9]],
  [69, "1 week ago", 7, [7.2, 6.6, 7.9, 6.8, 7.0, 5.9]],
  [73, "2 weeks ago", 14, [7.4, 6.9, 8.0, 7.8, 7.4, 6.3]],
  [65, "3 weeks ago", 21, [6.9, 6.1, 7.4, 6.5, 6.7, 5.4]],
  [61, "5 weeks ago", 35, [6.4, 5.2, 7.2, 5.9, 6.6, 5.3]],
  [64, "6 weeks ago", 42, [6.6, 6.0, 7.3, 6.5, 6.6, 5.4]],
  [61, "8 weeks ago", 56, [6.2, 5.8, 6.9, 6.3, 6.3, 5.1]],
  [58, "10 weeks ago", 70, [6.0, 5.4, 6.8, 5.6, 6.1, 4.9]],
]

const SAMPLE_RECORDINGS: ScoredRecording[] = SAMPLE_HISTORY.map(([score, dateLabel, ageDays, scores]) => ({
  score,
  dateLabel,
  ageDays,
  criteria: Object.fromEntries(CRITERIA.map(({ key }, i) => [key, scores[i]])) as CriterionScores,
}))

/**
 * The signed-in executive's dashboard. Until recordings are stored and
 * scored, every executive sees the sample history; then this reads
 * theirs. Targets are the goals they locked during onboarding.
 */
export async function getDashboard(): Promise<Dashboard> {
  const goals = await getOnboardingGoals()
  const targets = CRITERIA.map(({ key, label }) => ({
    key,
    label,
    goal: goals.find((goal) => goal.key === key)?.goal ?? 10,
  }))
  return { readiness: summariseReadiness(SAMPLE_RECORDINGS), recordings: SAMPLE_RECORDINGS, targets }
}
