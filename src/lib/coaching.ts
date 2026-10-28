import { todayIn } from "@/lib/coachingSessions"
import type { PlanId } from "@/lib/pricing"

// What the coach brings between live sessions: the weekly Pulse note, the
// quarterly workshop (Alignment) or intensive (Cohesion), high-stakes prep
// on request, and a progress report each quarter.

const DAY = 24 * 60 * 60 * 1000

/** "2026-Q4". */
export type QuarterKey = `${number}-Q${number}`

export function quarterOf(day: Date): QuarterKey {
  return `${day.getUTCFullYear()}-Q${Math.floor(day.getUTCMonth() / 3) + 1}`
}

/** "2026-Q4" → "Q4 2026". */
export function quarterLabel(key: QuarterKey) {
  const [year, quarter] = key.split("-Q")
  return `Q${quarter} ${year}`
}

export function shiftQuarter(key: QuarterKey, by: number): QuarterKey {
  const [year, quarter] = key.split("-Q").map(Number)
  const index = year * 4 + (quarter - 1) + by
  return `${Math.floor(index / 4)}-Q${(index % 4) + 1}`
}

/** Alignment's half-day workshop and Cohesion's in-person intensive; none on Foundation. */
export function workshopKind(planId: PlanId) {
  if (planId === "Cohesion") return { name: "intensive", title: "Half-day intensive" }
  if (planId === "Alignment") return { name: "workshop", title: "Half-day workshop" }
  return null
}

/** High-stakes prep sessions a quarter: a number, unlimited (null), or none (0). */
export function prepAllowance(planId: PlanId): number | null {
  if (planId === "Alignment") return 2
  if (planId === "Cohesion") return null
  return 0
}

export type CoachingCardKind = "pulse" | "workshop" | "prep" | "report"

export type CoachingCard = {
  kind: CoachingCardKind
  href: string
  eyebrow: string
  title: string
  body: string
  /** Needs the executive to act, e.g. pick a workshop date. */
  action?: boolean
}

type CoachingState = {
  planId: PlanId
  today: Date
  latestPulse: { weekOf: Date; oneThing: string } | null
  /** This quarter's workshop: a booked date, or the dates on offer. */
  workshop: { booked: Date | null; format: "virtual" | "in-person"; offered: number } | null
  prepUsed: number
  /** A prep request still waiting for the coach, by its event. */
  pendingPrep: string | null
}

const dayLabel = (day: Date, options: Intl.DateTimeFormatOptions) =>
  day.toLocaleDateString("en-US", { timeZone: "UTC", ...options })

/** The coaching cards for the dashboard, in order. */
export function coachingCards({ planId, today, latestPulse, workshop, prepUsed, pendingPrep }: CoachingState): CoachingCard[] {
  const quarter = quarterOf(today)
  const label = quarterLabel(quarter)
  const previous = shiftQuarter(quarter, -1)
  const cards: CoachingCard[] = []

  if (latestPulse) {
    cards.push({
      kind: "pulse",
      href: "/coaching#pulse",
      eyebrow: `Pulse note · week of ${dayLabel(latestPulse.weekOf, { month: "short", day: "numeric" })}`,
      title: latestPulse.oneThing,
      body: "Your focus for this week.",
    })
  }

  const kind = workshopKind(planId)
  if (kind) {
    const eyebrow = `${label} ${kind.name}`
    cards.push(
      workshop?.booked
        ? {
            kind: "workshop",
            href: "/coaching#workshop",
            eyebrow,
            title: `Booked for ${dayLabel(workshop.booked, { weekday: "short", month: "short", day: "numeric" })}`,
            body: workshop.format === "in-person" ? "In person, half a day." : "Virtual, half a day.",
          }
        : workshop && workshop.offered > 0
          ? {
              kind: "workshop",
              href: "/coaching#workshop",
              eyebrow,
              title: "Pick your date",
              body: `Your coach offered ${workshop.offered} dates. Choose the one that works for your team.`,
              action: true,
            }
          : {
              kind: "workshop",
              href: "/coaching#workshop",
              eyebrow,
              title: "Dates coming soon",
              body: "Your coach offers dates early in the quarter.",
            }
    )
  }

  const allowance = prepAllowance(planId)
  if (allowance !== 0) {
    cards.push({
      kind: "prep",
      href: "/coaching#prep",
      eyebrow: "High-stakes prep",
      title: pendingPrep ? `Requested: ${pendingPrep}` : "Big moment coming up?",
      body: pendingPrep
        ? "Waiting for your coach to confirm a time."
        : allowance === null
          ? "Request a prep session with your coach. Unlimited for your team."
          : `${Math.max(allowance - prepUsed, 0)} of ${allowance} left this quarter.`,
    })
  }

  cards.push({
    kind: "report",
    href: `/coaching/report?q=${previous}`,
    eyebrow: "Progress report",
    title: `${quarterLabel(previous)} report is ready`,
    body: "Your score trends across every criterion.",
  })

  return cards
}

/**
 * The signed-in executive's coaching cards. Until coaching is stored,
 * every executive has the sample: last week's Pulse note, three workshop
 * dates offered and none picked, and both prep sessions used.
 */
export async function getCoachingCards(planId: PlanId, timeZone: string, now: Date): Promise<CoachingCard[]> {
  const today = todayIn(timeZone, now)
  const thisMonday = new Date(today.getTime() - ((today.getUTCDay() + 6) % 7) * DAY)
  return coachingCards({
    planId,
    today,
    latestPulse: {
      weekOf: new Date(thisMonday.getTime() - 7 * DAY),
      oneThing: "When the question is hard, let a full beat of silence land before you answer.",
    },
    workshop: { booked: null, format: "virtual", offered: 3 },
    prepUsed: 2,
    pendingPrep: null,
  })
}
