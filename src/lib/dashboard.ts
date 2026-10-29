import { connection } from "next/server"

import { getCoachingCards, type CoachingCard } from "@/lib/coaching"
import { getUpcomingSessions, type UpcomingSession } from "@/lib/coachingSessions"
import { CRITERIA, type CriterionKey } from "@/lib/criteria"
import { getOnboardingGoals } from "@/lib/goals"
import { getPeerInvites, summarisePeerReviews, type PeerReviewSummary } from "@/lib/peerReviews"
import { getRecordings, type Recording } from "@/lib/recordings"
import { summariseReadiness, type Readiness } from "@/lib/scores"
import type { Viewer } from "@/lib/viewer"

// What the executive's dashboard shows, gathered in one place so the page
// makes a single call.

export type CriterionTarget = { key: CriterionKey; label: string; goal: number }

export type Dashboard = {
  /** Null until their first recording is scored. */
  readiness: Readiness | null
  /** Scored recordings, newest first. */
  recordings: Recording[]
  /** The quarter's locked goal for each criterion, in rubric order. */
  targets: CriterionTarget[]
  peerReviews: PeerReviewSummary
  /** Live sessions with their coach, soonest first. */
  upcoming: UpcomingSession[]
  /** What the coach brings between sessions. */
  coaching: CoachingCard[]
}

/**
 * The signed-in executive's dashboard. Targets are the goals they locked
 * during onboarding.
 */
export async function getDashboard(viewer: Viewer): Promise<Dashboard> {
  // Per request: reminder timing and invite expiry depend on today.
  await connection()
  const now = new Date()
  const [goals, recordings] = await Promise.all([getOnboardingGoals(), getRecordings(viewer.timeZone)])
  const targets = CRITERIA.map(({ key, label }) => ({
    key,
    label,
    goal: goals.find((goal) => goal.key === key)?.goal ?? 10,
  }))
  return {
    readiness: summariseReadiness(recordings),
    recordings,
    targets,
    peerReviews: summarisePeerReviews(await getPeerInvites(now), now),
    upcoming: await getUpcomingSessions(viewer.planId, viewer.timeZone, now),
    coaching: await getCoachingCards(viewer.planId, viewer.timeZone, now),
  }
}
