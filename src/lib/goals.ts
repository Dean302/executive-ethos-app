import { CRITERIA, type CriterionKey } from "@/lib/criteria"

// Goals are generated, not set: each criterion's target is a modest step
// up from the executive's baseline (one to two points), so the quarter
// is a stretch they can make. They're reviewed and confirmed once during
// onboarding, then locked for the quarter.

export const GOAL_PRIORITIES = ["critical", "high", "medium", "on-track"] as const
export type GoalPriority = (typeof GOAL_PRIORITIES)[number]

export const PRIORITY_LABEL: Record<GoalPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  "on-track": "On track",
}

export type CriterionGoal = {
  key: CriterionKey
  label: string
  /** Baseline score, 0–10. */
  current: number
  /** Target for the quarter, 0–10. */
  goal: number
  priority: GoalPriority
}

/** How far a goal climbs, to one decimal. */
export function goalGap({ current, goal }: Pick<CriterionGoal, "current" | "goal">) {
  return Math.round((goal - current) * 10) / 10
}

/** Highest priority first; within a priority, the largest climb first. */
export function rankGoals(goals: CriterionGoal[]) {
  return [...goals].sort(
    (a, b) => GOAL_PRIORITIES.indexOf(a.priority) - GOAL_PRIORITIES.indexOf(b.priority) || goalGap(b) - goalGap(a)
  )
}

// A sample baseline, standing in until the analysis service scores the
// onboarding sample.
const SAMPLE_BASELINE: Record<CriterionKey, Pick<CriterionGoal, "current" | "goal" | "priority">> = {
  clarity: { current: 7.2, goal: 8.5, priority: "medium" },
  vocal: { current: 6.8, goal: 8.0, priority: "high" },
  business: { current: 7.5, goal: 9.0, priority: "medium" },
  audience: { current: 8.1, goal: 8.5, priority: "on-track" },
  presence: { current: 7.9, goal: 9.0, priority: "medium" },
  time: { current: 6.5, goal: 8.0, priority: "high" },
}

/**
 * The lead's quarterly goals, ranked. Until an account store and the
 * analysis service are connected, every lead gets the sample baseline;
 * then this reads their scored onboarding sample and the targets
 * generated from it.
 */
export async function getOnboardingGoals(): Promise<CriterionGoal[]> {
  return rankGoals(CRITERIA.map(({ key, label }) => ({ key, label, ...SAMPLE_BASELINE[key] })))
}

/** Within this much of a goal (0–10 scale) counts as "almost there". */
const ALMOST_WITHIN = 0.5

export type GoalStanding = {
  total: number
  /** Criteria whose latest score is at or above the goal. */
  atGoal: number
  /** Not at goal, but within half a point of it. */
  almost: number
  /** The two furthest from their goal, with the points still to go (100 scale, at least 1). */
  furthest: { key: CriterionKey; label: string; pointsToGo: number }[]
}

/**
 * Where the latest scores stand against the quarter's goals. One rule for
 * "at goal" everywhere: the latest score is at or above the target.
 */
export function goalStanding(
  scores: Record<CriterionKey, number>,
  targets: { key: CriterionKey; label: string; goal: number }[]
): GoalStanding {
  const short = targets.filter(({ key, goal }) => scores[key] < goal)
  return {
    total: targets.length,
    atGoal: targets.length - short.length,
    almost: short.filter(({ key, goal }) => scores[key] >= goal - ALMOST_WITHIN).length,
    furthest: [...short]
      .sort((a, b) => b.goal - scores[b.key] - (a.goal - scores[a.key]))
      .slice(0, 2)
      .map(({ key, label, goal }) => ({ key, label, pointsToGo: Math.max(1, Math.round((goal - scores[key]) * 10)) })),
  }
}

/** One criterion's locked goal for the quarter, 0–10. */
export type CriterionTarget = { key: CriterionKey; label: string; goal: number }

/** The quarter's locked goal for each criterion, in rubric order. */
export async function getCriterionTargets(): Promise<CriterionTarget[]> {
  const goals = await getOnboardingGoals()
  return CRITERIA.map(({ key, label }) => ({ key, label, goal: goals.find((goal) => goal.key === key)?.goal ?? 10 }))
}
