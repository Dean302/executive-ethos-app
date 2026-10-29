import { PLANS, type PlanId } from "@/lib/pricing"
import { formatTimeOfDay, type Slot } from "@/lib/schedule"

// The executive's upcoming live sessions with their coach: the standing
// sessions their plan includes, on the weekday and time they chose, plus
// any high-stakes prep the coach has confirmed.
//
// Everything is wall-clock time in the executive's own time zone ("Tuesday
// 10:00"), so it reads the same wherever the page is rendered. Calendar
// days are held as UTC midnights and only ever compared or stepped by
// whole days.

/** Live sessions run an hour. */
export const LIVE_SESSION_MINUTES = 60

/** How far ahead the dashboard looks. */
const HORIZON_DAYS = 120
const DAY = 24 * 60 * 60 * 1000

export type UpcomingSession = {
  id: string
  title: string
  /** "Today", "Tomorrow" or "Tue, Nov 3". */
  dayLabel: string
  /** "10:00 AM–11:00 AM". */
  timeLabel: string
  /** For the date block: "Nov", 3. */
  month: string
  day: number
  /** Today or tomorrow, which gets the attention colour. */
  soon: boolean
}

type CalendarDay = Date

/** Today's date where the executive is. */
export function todayIn(timeZone: string, now: Date): CalendarDay {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(now)
    .reduce<Record<string, number>>((acc, part) => ({ ...acc, [part.type]: Number(part.value) }), {})
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day))
}

const addDays = (day: CalendarDay, days: number) => new Date(day.getTime() + days * DAY)

type Occurrence = { id: string; title: string; day: CalendarDay; start: number }

/** Every occurrence of a standing slot from the program's start, every `intervalDays`, within [from, to]. */
function occurrences(key: string, title: string, slot: Slot, intervalDays: number, start: CalendarDay, from: CalendarDay, to: CalendarDay) {
  let day = start
  while (day.getUTCDay() !== slot.day) day = addDays(day, 1)
  const out: Occurrence[] = []
  for (; day <= to; day = addDays(day, intervalDays)) {
    if (day >= from) out.push({ id: `${key}-${day.toISOString().slice(0, 10)}`, title, day, start: slot.start })
  }
  return out
}

export type ConfirmedPrep = { id: string; event: string; day: CalendarDay; start: number }

type UpcomingInput = {
  planId: PlanId
  /** The chosen weekday and time for each of the plan's standing sessions. */
  slots: Partial<Record<"primary" | "secondary", Slot>>
  programStart: CalendarDay
  prep: ConfirmedPrep[]
  today: CalendarDay
}

/** Upcoming live sessions, soonest first. */
export function upcomingSessions({ planId, slots, programStart, prep, today }: UpcomingInput): UpcomingSession[] {
  const to = addDays(today, HORIZON_DAYS)
  const standing = PLANS[planId].sessions.flatMap(({ key, label, intervalDays }) => {
    const slot = slots[key]
    return slot ? occurrences(key, label, slot, intervalDays, programStart, today, to) : []
  })
  const prepSessions = prep
    .filter(({ day }) => day >= today && day <= to)
    .map(({ id, event, day, start }) => ({ id, title: `High-stakes prep: ${event}`, day, start }))

  return [...standing, ...prepSessions]
    .sort((a, b) => a.day.getTime() - b.day.getTime() || a.start - b.start)
    .map(({ id, title, day, start }) => {
      const ahead = Math.round((day.getTime() - today.getTime()) / DAY)
      return {
        id,
        title,
        dayLabel:
          ahead === 0
            ? "Today"
            : ahead === 1
              ? "Tomorrow"
              : day.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }),
        timeLabel: `${formatTimeOfDay(start)}–${formatTimeOfDay(start + LIVE_SESSION_MINUTES)}`,
        month: day.toLocaleDateString("en-US", { timeZone: "UTC", month: "short" }),
        day: day.getUTCDate(),
        soon: ahead <= 1,
      }
    })
}

/**
 * The signed-in executive's upcoming sessions. Until schedules and
 * bookings are stored, every executive has the sample program: four
 * months in, 1:1s on Tuesdays at 10:00, the paired session on Thursdays at
 * 14:00, and a board-meeting prep confirmed for next week.
 */
export async function getUpcomingSessions(planId: PlanId, timeZone: string, now: Date): Promise<UpcomingSession[]> {
  const today = todayIn(timeZone, now)
  let prepDay = addDays(today, 6)
  while (prepDay.getUTCDay() === 0 || prepDay.getUTCDay() === 6) prepDay = addDays(prepDay, 1)
  return upcomingSessions({
    planId,
    today,
    programStart: addDays(today, -(3 * 30 + 12)),
    slots: { primary: { day: 2, start: 600 }, secondary: { day: 4, start: 840 } },
    prep: [{ id: "prep-board", event: "Board meeting: 2027 budget and the new sites", day: prepDay, start: 960 }],
  })
}
