// Coaching programs and their pricing, from Dean's "Pricing Programs"
// proposal. Commitment wording is his, verbatim. `text` may contain
// **bold** lead phrases; render it with a parser, never as HTML.

export const PLAN_IDS = ["Foundation", "Alignment", "Cohesion"] as const
export type PlanId = (typeof PLAN_IDS)[number]

export const TERM_DAYS = [90, 180, 365] as const
export type TermDays = (typeof TERM_DAYS)[number]

export const DEFAULT_PLAN: PlanId = "Foundation"
export const DEFAULT_TERM: TermDays = 90

export type Commitment = {
  /** Dean's frequency label, e.g. "WEEKLY", "ON DEMAND", "INCLUDED". */
  frequency: string
  text: string
}

export type Plan = {
  id: PlanId
  tagline: string
  /** Short form of who and how often, e.g. "One leader · monthly". */
  cadence: string
  leaderCount: number
  hoursPerMonth: number
  /** Monthly rate on the 90-day term, before any discount. */
  baseMonthly: number
  commitments: Commitment[]
  additionalSeatNote: string
}

export type Term = {
  days: TermDays
  /** Billed months — 365 days bills as 12, not 12.17. */
  months: number
  label: string
  sublabel: string
  discount: number
}

export const PLANS: Record<PlanId, Plan> = {
  Foundation: {
    id: "Foundation",
    tagline: "One leader, monthly, connect to build a consistent habit",
    cadence: "One leader · monthly",
    leaderCount: 1,
    hoursPerMonth: 3,
    baseMonthly: 2500,
    commitments: [
      {
        frequency: "MONTHLY",
        text: "**60-minute coaching session**: one focus area, one commitment, carried into the next month",
      },
      {
        frequency: "WEEKLY",
        text: "**Executive Pulse™ notes**: 30 minutes of analysis on that week's recorded communications, summarizing what moved, what didn't, and the one thing to work on next",
      },
      {
        frequency: "ALWAYS ON",
        text: "**Unlimited AI analysis**: record any communication, scored across all six criteria within minutes",
      },
      {
        frequency: "QUARTERLY",
        text: "**Progress report**: score trends across every criterion, sent ahead of your renewal decision",
      },
    ],
    additionalSeatNote:
      "Foundation covers a single leader and does not include Leadership OS access. Both come with Alignment, and you can upgrade at any point in the term.",
  },
  Alignment: {
    id: "Alignment",
    tagline: "Two leaders, biweekly, connect to work the same message",
    cadence: "Two leaders · biweekly",
    leaderCount: 2,
    hoursPerMonth: 10,
    baseMonthly: 5000,
    commitments: [
      {
        frequency: "BIWEEKLY",
        text: "**60-minute coaching session for each leader**: worked separately, so neither is performing for the other",
      },
      {
        frequency: "MONTHLY",
        text: "**60-minute paired session**: the two of you on the same message, finding where your delivery diverges",
      },
      {
        frequency: "WEEKLY",
        text: "**Executive Pulse™ notes for both leaders**: 30 minutes of analysis each on that week's recorded communications",
      },
      {
        frequency: "ON DEMAND",
        text: "**High-stakes preparation**: up to two per quarter for board meetings, all-hands, investor sessions",
      },
      {
        frequency: "QUARTERLY",
        text: "**Half-day workshop**: virtual by default, in person within 50 miles at no additional cost",
      },
      {
        frequency: "INCLUDED",
        text: "**Leadership OS for two**: full platform access, individual scoring, shared dashboard",
      },
    ],
    additionalSeatNote:
      "Alignment covers two leaders. Additional seats are $1,250 per leader each month, which includes platform access and weekly notes but not an individual session.",
  },
  Cohesion: {
    id: "Cohesion",
    tagline: "Four leaders, weekly, connect to become one cohesive voice",
    cadence: "Four leaders · weekly",
    leaderCount: 4,
    hoursPerMonth: 17,
    baseMonthly: 10000,
    commitments: [
      {
        frequency: "WEEKLY",
        text: "**60-minute leadership team session**: all four in the same room, working the same message while the others listen. This is where the voice converges",
      },
      {
        frequency: "MONTHLY",
        text: "**60-minute one-to-one with each leader**: where each of you works your individual gap, privately",
      },
      {
        frequency: "WEEKLY",
        text: "**Executive Pulse™ notes for all four leaders**: 30 minutes of analysis each on that week's recorded communications",
      },
      {
        frequency: "QUARTERLY",
        text: "**Half-day intensive**: four per year, in person, built around your quarterly priorities",
      },
      {
        frequency: "ON DEMAND",
        text: "**High-stakes preparation**: unlimited across the team",
      },
      {
        frequency: "INCLUDED",
        text: "**Leadership OS for four** plus quarterly **Talent Calibration™**: where each leader stands and what closes their gap",
      },
    ],
    additionalSeatNote:
      "Cohesion covers four leaders. Additional seats are $1,250 per leader each month, which includes platform access and weekly notes but not an individual session.",
  },
}

export const TERMS: Record<TermDays, Term> = {
  90: { days: 90, months: 3, label: "90 days", sublabel: "Minimum", discount: 0 },
  180: { days: 180, months: 6, label: "180 days", sublabel: "Save 10%", discount: 0.1 },
  365: { days: 365, months: 12, label: "365 days", sublabel: "Save 20%", discount: 0.2 },
}

const MAX_DISCOUNT = Math.max(...TERM_DAYS.map((days) => TERMS[days].discount))

export function monthlyRate(planId: PlanId, termDays: TermDays) {
  return Math.round(PLANS[planId].baseMonthly * (1 - TERMS[termDays].discount))
}

/** The lowest monthly rate a plan reaches, on its longest term. */
export function lowestMonthlyRate(planId: PlanId) {
  return Math.round(PLANS[planId].baseMonthly * (1 - MAX_DISCOUNT))
}

export function termTotal(planId: PlanId, termDays: TermDays) {
  return monthlyRate(planId, termDays) * TERMS[termDays].months
}

export function savingsVsShortestTerm(planId: PlanId, termDays: TermDays) {
  return (PLANS[planId].baseMonthly - monthlyRate(planId, termDays)) * TERMS[termDays].months
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

/** Whole-dollar USD, e.g. "$2,500". */
export function formatUsd(amount: number) {
  return usd.format(amount)
}
