import type { Recording } from "@/lib/recordings"

import { RecordingsHeader } from "./header/RecordingsHeader"
import { TrendCard } from "./trend/TrendCard"

type RecordingsScreenProps = {
  /** Newest first. */
  recordings: Recording[]
  /** Today on the executive's clock, wall-clock milliseconds. */
  today: number
}

/**
 * Every recording the executive has made or uploaded: the score trend
 * over time, then the full list. Each section lives in a subfolder beside
 * this file.
 */
function RecordingsScreen({ recordings, today }: RecordingsScreenProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <RecordingsHeader recordings={recordings} />
      <TrendCard recordings={recordings} today={today} />
    </div>
  )
}

export { RecordingsScreen }
