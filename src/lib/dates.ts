// Dates on the executive's own calendar. A "wall-clock" Date holds their
// local date and time in its UTC fields, so it can be stepped, compared
// and formatted (with timeZone: "UTC") the same on the server and in the
// browser, whatever either one's own zone is.

export const DAY_MS = 24 * 60 * 60 * 1000

/** `instant` as the executive's local date and time, held in a Date's UTC fields. */
export function wallClock(instant: Date, timeZone: string): Date {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  )
  return new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, instant.getUTCMilliseconds())
  )
}

export const startOfDay = (day: Date) => new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()))
export const endOfDay = (day: Date) => new Date(startOfDay(day).getTime() + DAY_MS - 1)

/** "Oct 29". */
export const shortDate = (day: Date) => day.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" })

export type DateRange = { start: Date; end: Date; label: string }

/** "Sep 30 – Oct 29, 2026", or across years "Dec 1, 2025 – Jan 4, 2026". */
export function formatRangeLabel(start: Date, end: Date) {
  if (startOfDay(start).getTime() === startOfDay(end).getTime()) return `${shortDate(start)}, ${start.getUTCFullYear()}`
  return start.getUTCFullYear() === end.getUTCFullYear()
    ? `${shortDate(start)} – ${shortDate(end)}, ${end.getUTCFullYear()}`
    : `${shortDate(start)}, ${start.getUTCFullYear()} – ${shortDate(end)}, ${end.getUTCFullYear()}`
}

/** The last `n` days, today included. */
export function lastNDaysRange(n: number, today: Date): DateRange {
  const start = new Date(startOfDay(today).getTime() - (n - 1) * DAY_MS)
  const end = endOfDay(today)
  return { start, end, label: formatRangeLabel(start, end) }
}

export function thisQuarterRange(today: Date): DateRange {
  const quarter = Math.floor(today.getUTCMonth() / 3)
  return {
    start: new Date(Date.UTC(today.getUTCFullYear(), quarter * 3, 1)),
    end: endOfDay(today),
    label: `Q${quarter + 1} ${today.getUTCFullYear()}`,
  }
}

export function lastQuarterRange(today: Date): DateRange {
  const quarter = Math.floor(today.getUTCMonth() / 3)
  const start = new Date(Date.UTC(today.getUTCFullYear(), (quarter - 1) * 3, 1))
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 3, 1) - 1)
  return { start, end, label: `Q${Math.floor(start.getUTCMonth() / 3) + 1} ${start.getUTCFullYear()}` }
}

export function yearToDateRange(today: Date): DateRange {
  const start = new Date(Date.UTC(today.getUTCFullYear(), 0, 1))
  const end = endOfDay(today)
  return { start, end, label: formatRangeLabel(start, end) }
}

/** Everything up to today. Its start is a floor before any recording; the label names the preset. */
export function allTimeRange(today: Date): DateRange {
  return { start: new Date(Date.UTC(2020, 0, 1)), end: endOfDay(today), label: "All time" }
}

export const isWithinRange = (date: Date, range: DateRange) => date >= range.start && date <= range.end
