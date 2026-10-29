import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card } from "@/components/common/card"
import { Trend } from "@/components/common/trend"
import type { Recording, RecordingType } from "@/lib/recordings"
import { cn } from "@/lib/utils"

const SHOWN = 4

// Each kind of meeting keeps its own colour wherever it's listed.
const TYPE_TONE: Record<RecordingType, string> = {
  "1:1": "text-muted-foreground",
  Team: "text-success",
  Executive: "text-primary",
  Board: "text-warning",
  Presentation: "text-primary",
  Pitch: "text-oxblood",
  Weekly: "text-success",
}

/** The latest recordings with their scores and changes, and the total count. */
function RecentRecordings({ recordings, className }: { recordings: Recording[]; className?: string }) {
  const count = recordings.length
  const shown = recordings.slice(0, SHOWN)

  return (
    <Card
      className={cn("text-sm", className)}
      title="Recent recordings"
      description={`${count} recording${count === 1 ? "" : "s"}`}
      action={
        count > 0 && (
          <Link href="/sessions" className="text-primary flex items-center gap-1 text-sm font-medium hover:underline">
            View all
            <ArrowRight aria-hidden className="size-3.5" strokeWidth={1.75} />
          </Link>
        )
      }
    >
      {count === 0 ? (
        <p className="text-muted-foreground text-sm">No recordings yet. Record one to get your Executive Readiness score.</p>
      ) : (
        <ul>
          {shown.map((recording, i) => {
            const older = recordings[i + 1]
            return (
              <li key={recording.id}>
                <Link
                  href={`/sessions/${recording.id}`}
                  className={cn(
                    "hover:bg-secondary/50 focus-visible:ring-ring/50 -mx-2.5 flex items-center justify-between gap-4 rounded-inset px-2.5 py-3 transition-colors outline-none focus-visible:ring-3",
                    // The divider rides on the row itself, so it follows the row's rounded ends.
                    i < shown.length - 1 && "border-border border-b"
                  )}
                >
                  <div className="min-w-0">
                    <p className={cn("text-sm font-medium", TYPE_TONE[recording.type])}>{recording.type}</p>
                    <p className="text-foreground truncate text-sm font-medium">{recording.title}</p>
                    <p className="text-muted-foreground text-sm">{recording.dateLabel}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Trend value={older ? recording.score - older.score : null} />
                    <span className="text-primary w-8 text-right text-lg">{recording.score}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

export { RecentRecordings }
