import {
  allTimeRange,
  lastNDaysRange,
  lastQuarterRange,
  thisQuarterRange,
  yearToDateRange,
  type DateRange,
} from "@/lib/dates"

/** The score trend's range presets. The list below the chart always shows every recording. */
export const TREND_RANGES = [
  { key: "last30", label: "Last 30 days", range: (today: Date) => lastNDaysRange(30, today) },
  { key: "last90", label: "Last 90 days", range: (today: Date) => lastNDaysRange(90, today) },
  { key: "thisQuarter", label: "This quarter", range: thisQuarterRange },
  { key: "lastQuarter", label: "Last quarter", range: lastQuarterRange },
  { key: "yearToDate", label: "Year to date", range: yearToDateRange },
  { key: "allTime", label: "All time", range: allTimeRange },
] as const satisfies { key: string; label: string; range: (today: Date) => DateRange }[]

export type TrendRangeKey = (typeof TREND_RANGES)[number]["key"]
