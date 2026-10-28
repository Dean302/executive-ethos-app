import { summariseReadiness, type Readiness, type ScoredRecording } from "@/lib/scores"

// What the executive's dashboard shows, gathered in one place so the page
// makes a single call.

export type Dashboard = {
  /** Null until their first recording is scored. */
  readiness: Readiness | null
}

// A sample history, newest first, standing in until recordings are
// stored and scored.
const SAMPLE_RECORDINGS: ScoredRecording[] = [
  { score: 78, dateLabel: "2 days ago" },
  { score: 71, dateLabel: "5 days ago" },
  { score: 69, dateLabel: "1 week ago" },
  { score: 73, dateLabel: "2 weeks ago" },
  { score: 65, dateLabel: "3 weeks ago" },
  { score: 61, dateLabel: "5 weeks ago" },
  { score: 64, dateLabel: "6 weeks ago" },
  { score: 61, dateLabel: "8 weeks ago" },
  { score: 58, dateLabel: "10 weeks ago" },
]

/**
 * The signed-in executive's dashboard. Until recordings are stored and
 * scored, every executive sees the sample history; then this reads
 * theirs.
 */
export async function getDashboard(): Promise<Dashboard> {
  return { readiness: summariseReadiness(SAMPLE_RECORDINGS) }
}
