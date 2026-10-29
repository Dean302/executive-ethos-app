import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { Badge } from "@/components/common/badge"
import type { CriterionTarget } from "@/lib/goals"
import type { Recording } from "@/lib/recordings"
import type { Scorecard } from "@/lib/scorecards"

import { CriterionDetails } from "./CriterionDetails"
import { FlagToggle } from "./FlagToggle"
import { RecordingThumbnail } from "./RecordingThumbnail"
import { ScoresCard } from "./ScoresCard"
import { ScoreStats } from "./ScoreStats"

type RecordingDetailScreenProps = {
  recording: Recording
  /** The recording before this one; null for the first. */
  previous: Recording | null
  targets: CriterionTarget[]
  /** What the analysis found; null until it's been analysed. */
  scorecard: Scorecard | null
  /** A named way back when it was opened from outside Recordings. */
  back: { href: string; label: string } | null
  /** Now on the executive's clock, wall-clock milliseconds. */
  now: number
}

/** One recording: what it was, how it scored against the goal and the one before, and the flag to raise it with the coach. */
function RecordingDetailScreen({ recording, previous, targets, scorecard, back, now }: RecordingDetailScreenProps) {
  const recordedOn = new Date(recording.recordedAt).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {/* Phones: the header's breadcrumb lives here instead. */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm lg:hidden">
          <Link href="/sessions" className="text-muted-foreground hover:text-foreground shrink-0 hover:underline">
            Recordings
          </Link>
          <ChevronRight aria-hidden className="text-muted-foreground/60 size-3.5 shrink-0" strokeWidth={2} />
          <span aria-current="page" className="text-foreground truncate font-medium">
            {recording.title}
          </span>
        </nav>
        {back && (
          <Link
            href={back.href}
            className="text-primary inline-flex shrink-0 items-center gap-1.5 text-sm font-medium hover:underline"
          >
            <ArrowLeft aria-hidden className="size-3.5" strokeWidth={2} />
            {back.label}
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center gap-5">
        <RecordingThumbnail duration={recording.duration} recordedAt={recording.recordedAt} seed={recording.id} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{recording.type}</Badge>
          </div>
          <h1 className="mt-2.5 font-sans text-2xl font-semibold text-balance">{recording.title}</h1>
          <p className="text-foreground/60 mt-1 text-sm">{recordedOn}</p>
        </div>
        <div className="shrink-0 self-start">
          <FlagToggle recordingId={recording.id} initialFlag={recording.flag} now={now} />
        </div>
      </div>

      <ScoreStats score={recording.score} previousScore={previous?.score ?? null} />
      <ScoresCard scores={recording.criteria} previous={previous?.criteria ?? null} targets={targets} />
      {scorecard && (
        <CriterionDetails
          scores={recording.criteria}
          previous={previous?.criteria ?? null}
          targets={targets}
          findings={scorecard.findings}
        />
      )}
    </div>
  )
}

export { RecordingDetailScreen }
