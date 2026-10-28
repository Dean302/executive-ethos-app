import { averageScores, type CriterionScores, type ScoredRecording } from "@/lib/scores"

// The growth card answers "how have I been performing" for a chosen window:
// - Latest recording (default): its six criteria, against the one before.
// - Last 7 / 30 / 90 days: the average of every recording in the window,
//   against the same-length window before it.
// - All time: the average of every recording, against the first.
// An empty window falls back to the latest recording and says so.

export const PERIODS = [
  { key: "latest", label: "Latest recording" },
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
  { key: "90", label: "Last 90 days" },
  { key: "all", label: "All time" },
] as const

export type Period = (typeof PERIODS)[number]["key"]

export type PeriodView = {
  scores: CriterionScores
  /** What the changes are measured against; null when there's nothing before. */
  compare: CriterionScores | null
  compareLabel: string
  /** Under the radar's centre number. */
  caption: string
  /** Under the card title. */
  description: string
  /** Why the view fell back to the latest recording, if it did. */
  fallbackNote: string | null
}

/** The view for a period, from scored recordings (newest first). Null with no recordings. */
export function viewFor(period: Period, recordings: ScoredRecording[]): PeriodView | null {
  const [latest, previous] = recordings
  if (!latest) return null

  const latestView: PeriodView = {
    scores: latest.criteria,
    compare: previous?.criteria ?? null,
    compareLabel: "vs previous recording",
    caption: "LATEST",
    description: `Latest recording · ${latest.dateLabel}`,
    fallbackNote: null,
  }

  if (period === "latest") return latestView

  if (period === "all") {
    const first = recordings[recordings.length - 1]
    return {
      scores: averageScores(recordings.map((recording) => recording.criteria)),
      compare: recordings.length > 1 ? first.criteria : null,
      compareLabel: "since the first recording",
      caption: "ALL-TIME AVG",
      description: `Average of all ${recordings.length} recordings`,
      fallbackNote: null,
    }
  }

  const days = Number(period)
  // A recording exactly `days` old belongs to the window before.
  const inWindow = recordings.filter((recording) => recording.ageDays < days)
  const before = recordings.filter((recording) => recording.ageDays >= days && recording.ageDays < days * 2)
  if (inWindow.length === 0) {
    return { ...latestView, fallbackNote: `No recordings in the last ${days} days, so this shows the latest recording.` }
  }
  return {
    scores: averageScores(inWindow.map((recording) => recording.criteria)),
    compare: before.length > 0 ? averageScores(before.map((recording) => recording.criteria)) : null,
    compareLabel: `vs previous ${days} days`,
    caption: `${days}-DAY AVG`,
    description: `Average of ${inWindow.length} recording${inWindow.length === 1 ? "" : "s"} · Last ${days} days`,
    fallbackNote: null,
  }
}
