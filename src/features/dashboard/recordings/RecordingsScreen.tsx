import type { Recording } from "@/lib/recordings"

import { RecordingsHeader } from "./header/RecordingsHeader"

/**
 * Every recording the executive has made or uploaded: the score trend
 * over time, then the full list. Each section lives in a subfolder beside
 * this file.
 */
function RecordingsScreen({ recordings }: { recordings: Recording[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <RecordingsHeader recordings={recordings} />
    </div>
  )
}

export { RecordingsScreen }
