// Standing coaching slots: the same weekday and time for the life of a
// program. Weekdays use Date#getDay numbering (1 = Monday … 5 = Friday).

export const WEEKDAYS = [
  { value: 1, short: "Mon", long: "Monday" },
  { value: 2, short: "Tue", long: "Tuesday" },
  { value: 3, short: "Wed", long: "Wednesday" },
  { value: 4, short: "Thu", long: "Thursday" },
  { value: 5, short: "Fri", long: "Friday" },
] as const

export type Weekday = (typeof WEEKDAYS)[number]["value"]

/** Bookable start times, as minutes after midnight. */
export const SESSION_START_TIMES = [540, 600, 660, 780, 840, 900, 960] as const
export type SessionStartTime = (typeof SESSION_START_TIMES)[number]

export const SESSION_MINUTES = 45

export type Slot = { day: Weekday; start: SessionStartTime }

/** 600 → "10:00 AM". */
export function formatTimeOfDay(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hours12}:${String(minutes % 60).padStart(2, "0")} ${period}`
}

/** "10:00 AM–10:45 AM". */
export function formatSessionTime(start: number) {
  return `${formatTimeOfDay(start)}–${formatTimeOfDay(start + SESSION_MINUTES)}`
}

/**
 * The first occurrence of a standing slot: the next time its weekday and
 * start time come round, on or after `from`. A slot later today counts;
 * one that has already started today rolls to next week.
 */
export function firstOccurrence(slot: Slot, from: Date) {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  date.setMinutes(slot.start)
  const daysAhead = (slot.day - date.getDay() + 7) % 7
  date.setDate(date.getDate() + daysAhead)
  if (date < from) date.setDate(date.getDate() + 7)
  return date
}

/** "Tuesday, October 20". */
export function formatSessionDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}
