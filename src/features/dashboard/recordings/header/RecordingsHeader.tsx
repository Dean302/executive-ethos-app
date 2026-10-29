import { RecordCta } from "@/components/recorder"
import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"
import type { Recording } from "@/lib/recordings"

import { ExportCsvButton } from "./ExportCsvButton"

/**
 * The page's title and its two actions, export and record. The actions
 * stay pinned top right at every width; the title wraps, and below sm the
 * buttons collapse to icons.
 */
function RecordingsHeader({ recordings }: { recordings: Recording[] }) {
  const count = recordings.length

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">Recordings</p>
        <h1 className="mt-1.5 text-3xl text-balance">Every recording, trended over time</h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-[15px]">
          {`${count} recording${count === 1 ? "" : "s"} since you started. The dashed line is Executive Ready (${EXECUTIVE_READY_SCORE}).`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ExportCsvButton recordings={recordings} />
        <RecordCta collapseOnMobile />
      </div>
    </div>
  )
}

export { RecordingsHeader }
