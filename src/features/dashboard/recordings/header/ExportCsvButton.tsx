"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/common/button"
import { downloadCsv } from "@/lib/csv"
import { changeFrom, type Recording } from "@/lib/recordings"

/** Downloads every recording as a CSV: date, title, type, score, change, flagged. Icon-only on phones. */
function ExportCsvButton({ recordings }: { recordings: Recording[] }) {
  const exportCsv = () =>
    downloadCsv(
      "recordings.csv",
      ["Date", "Recording", "Type", "Score", "Change", "Flagged for coach"],
      recordings.map((recording, i) => [
        recording.dateLabel,
        recording.title,
        recording.type,
        recording.score,
        changeFrom(recordings, i) ?? 0,
        recording.flaggedForCoach ? "Yes" : "No",
      ])
    )

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={recordings.length === 0}
      onClick={exportCsv}
      title="Export to CSV"
      className="gap-1.5 max-sm:size-9 max-sm:px-0"
    >
      <Download aria-hidden className="size-3.5" strokeWidth={1.75} />
      <span className="max-sm:sr-only">Export to CSV</span>
    </Button>
  )
}

export { ExportCsvButton }
