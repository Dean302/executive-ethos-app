import { connection } from "next/server"

import { getCoachingCards, type CoachingCard } from "@/lib/coaching"
import { getUpcomingSessions, type UpcomingSession } from "@/lib/coachingSessions"
import { CRITERIA, type CriterionKey } from "@/lib/criteria"
import { getOnboardingGoals } from "@/lib/goals"
import { getPeerInvites, summarisePeerReviews, type PeerReviewSummary } from "@/lib/peerReviews"
import { summariseReadiness, type CriterionScores, type Readiness, type ScoredRecording } from "@/lib/scores"
import type { Viewer } from "@/lib/viewer"

// What the executive's dashboard shows, gathered in one place so the page
// makes a single call.

export type CriterionTarget = { key: CriterionKey; label: string; goal: number }

export const RECORDING_TYPES = ["1:1", "Team", "Executive", "Board", "Presentation", "Pitch", "Weekly"] as const
export type RecordingType = (typeof RECORDING_TYPES)[number]

export type DashboardRecording = ScoredRecording & {
  id: string
  title: string
  type: RecordingType
}

export type Dashboard = {
  /** Null until their first recording is scored. */
  readiness: Readiness | null
  /** Scored recordings, newest first. */
  recordings: DashboardRecording[]
  /** The quarter's locked goal for each criterion, in rubric order. */
  targets: CriterionTarget[]
  peerReviews: PeerReviewSummary
  /** Live sessions with their coach, soonest first. */
  upcoming: UpcomingSession[]
  /** What the coach brings between sessions. */
  coaching: CoachingCard[]
}

// A sample history, newest first, standing in until recordings are stored
// and scored. Scores per criterion run clarity, vocal, business, audience,
// presence, time.
type SampleRow = [id: string, title: string, type: RecordingType, score: number, dateLabel: string, ageDays: number, scores: number[]]

const SAMPLE_HISTORY: SampleRow[] = [
  ["s4", "Q3 Board Presentation", "Board", 78, "2 days ago", 2, [8.0, 7.2, 8.6, 8.3, 8.5, 6.2]],
  ["s3", "Monday Leadership Meeting", "Weekly", 71, "5 days ago", 5, [7.4, 6.8, 7.9, 7.3, 7.3, 5.9]],
  ["s2", "Investor Pitch Rehearsal", "Pitch", 69, "1 week ago", 7, [7.2, 6.6, 7.9, 6.8, 7.0, 5.9]],
  ["s1", "All-Hands Q&A", "Team", 73, "2 weeks ago", 14, [7.4, 6.9, 8.0, 7.8, 7.4, 6.3]],
  ["s5", "Product Launch Rehearsal", "Presentation", 65, "3 weeks ago", 21, [6.9, 6.1, 7.4, 6.5, 6.7, 5.4]],
  ["s6", "Series B Pitch Prep", "Pitch", 61, "5 weeks ago", 35, [6.4, 5.2, 7.2, 5.9, 6.6, 5.3]],
  ["s7", "Weekly Leadership Meeting", "Weekly", 64, "6 weeks ago", 42, [6.6, 6.0, 7.3, 6.5, 6.6, 5.4]],
  ["s8", "All-Hands Q&A", "Team", 61, "8 weeks ago", 56, [6.2, 5.8, 6.9, 6.3, 6.3, 5.1]],
  ["s9", "First Board Update", "Board", 58, "10 weeks ago", 70, [6.0, 5.4, 6.8, 5.6, 6.1, 4.9]],
]

const SAMPLE_RECORDINGS: DashboardRecording[] = SAMPLE_HISTORY.map(
  ([id, title, type, score, dateLabel, ageDays, scores]) => ({
    id,
    title,
    type,
    score,
    dateLabel,
    ageDays,
    criteria: Object.fromEntries(CRITERIA.map(({ key }, i) => [key, scores[i]])) as CriterionScores,
  })
)

/**
 * The signed-in executive's dashboard. Until recordings are stored and
 * scored, every executive sees the sample history; then this reads
 * theirs. Targets are the goals they locked during onboarding.
 */
export async function getDashboard(viewer: Viewer): Promise<Dashboard> {
  // Per request: reminder timing and invite expiry depend on today.
  await connection()
  const now = new Date()
  const goals = await getOnboardingGoals()
  const targets = CRITERIA.map(({ key, label }) => ({
    key,
    label,
    goal: goals.find((goal) => goal.key === key)?.goal ?? 10,
  }))
  return {
    readiness: summariseReadiness(SAMPLE_RECORDINGS),
    recordings: SAMPLE_RECORDINGS,
    targets,
    peerReviews: summarisePeerReviews(await getPeerInvites(now), now),
    upcoming: await getUpcomingSessions(viewer.planId, viewer.timeZone, now),
    coaching: await getCoachingCards(viewer.planId, viewer.timeZone, now),
  }
}
