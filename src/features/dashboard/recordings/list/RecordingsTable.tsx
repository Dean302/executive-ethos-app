"use client"

import * as React from "react"
import Link from "next/link"
import {
  Briefcase,
  Flag,
  Landmark,
  ListChecks,
  Presentation,
  Rocket,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Card } from "@/components/common/card"
import { Select } from "@/components/common/select"
import { Trend } from "@/components/common/trend"
import { RecordingStack } from "@/components/illustrations"
import { changeFrom, MEETING_TYPES, RECORDING_TYPES, type Recording, type RecordingType } from "@/lib/recordings"
import { cn } from "@/lib/utils"

const TYPE_ICON: Record<RecordingType, LucideIcon> = {
  "1:1": User,
  Team: Users,
  Executive: Briefcase,
  Board: Landmark,
  Presentation: Presentation,
  Pitch: Rocket,
  Weekly: ListChecks,
}

/** Recording, meeting type, date, length, change, score; one column on phones. */
const ROW_GRID = "sm:grid-cols-[minmax(0,1fr)_210px_100px_64px_56px_40px] sm:gap-4"

type TypeFilter = "All" | RecordingType

/** A row's change: an up or down marker in fixed-width digits, or a plain "0". */
function RowChange({ value }: { value: number }) {
  return <Trend value={value} flatLabel="0" className={value === 0 ? undefined : "flex tabular-nums"} />
}

/**
 * Every recording, newest first, with meeting type and flagged-for-coach
 * filters that combine. Each row opens its recording.
 */
function RecordingsTable({ recordings }: { recordings: Recording[] }) {
  const [type, setType] = React.useState<TypeFilter>("All")
  const [flaggedOnly, setFlaggedOnly] = React.useState(false)
  const typeId = React.useId()
  const flagId = React.useId()

  const rows = recordings
    .map((recording, i) => ({ recording, change: changeFrom(recordings, i) }))
    .filter(({ recording }) => type === "All" || recording.type === type)
    .filter(({ recording }) => !flaggedOnly || recording.flaggedForCoach)
  const filtered = type !== "All" || flaggedOnly
  const total = recordings.length
  const typeCounts = recordings.reduce<Partial<Record<RecordingType, number>>>(
    (counts, { type }) => ({ ...counts, [type]: (counts[type] ?? 0) + 1 }),
    {}
  )
  const flaggedCount = recordings.filter((recording) => recording.flaggedForCoach).length

  const clear = () => {
    setType("All")
    setFlaggedOnly(false)
  }

  return (
    <Card className="mt-8 p-0">
      <div className="flex flex-col gap-4 px-5 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-foreground font-sans text-lg font-medium">All recordings</h2>
          <p className="text-muted-foreground text-sm">
            {filtered ? `Showing ${rows.length} of ${total}` : `${total} recording${total === 1 ? "" : "s"}`}
            {filtered && (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={clear}
                  className="text-primary focus-visible:ring-ring/50 cursor-pointer rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3"
                >
                  Clear filters
                </button>
              </>
            )}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <label className="sr-only" htmlFor={typeId}>
            Meeting type
          </label>
          <Select
            id={typeId}
            value={type}
            onChange={(event) => setType(event.target.value as TypeFilter)}
            wrapperClassName="w-full sm:w-auto"
            className={cn(type !== "All" && "border-primary")}
          >
            <option value="All">All meeting types</option>
            {RECORDING_TYPES.map((id) => (
              <option key={id} value={id}>
                {`${MEETING_TYPES[id].label} (${typeCounts[id] ?? 0})`}
              </option>
            ))}
          </Select>
          <label className="sr-only" htmlFor={flagId}>
            Flagged for coach
          </label>
          <Select
            id={flagId}
            value={flaggedOnly ? "flagged" : "all"}
            onChange={(event) => setFlaggedOnly(event.target.value === "flagged")}
            wrapperClassName="w-full sm:w-auto"
            className={cn(flaggedOnly && "border-primary")}
          >
            <option value="all">All recordings</option>
            <option value="flagged">{`Flagged for coach (${flaggedCount})`}</option>
          </Select>
        </div>
      </div>

      <div
        aria-hidden
        className={cn(
          ROW_GRID,
          "border-border bg-tint text-muted-foreground hidden border-y px-6 py-2.5 text-sm font-medium sm:grid"
        )}
      >
        <span>Recording</span>
        <span>Meeting type</span>
        <span>Date</span>
        <span>Length</span>
        <span className="text-right" title="Change vs the previous recording">
          Change
        </span>
        <span className="text-right">Score</span>
      </div>

      <ul className="divide-border border-border divide-y border-t sm:border-t-0">
        {total === 0 && (
          <li className="flex flex-col items-center px-5 py-12 text-center">
            <RecordingStack className="w-44" />
            <p className="text-foreground mt-3 font-medium">No recordings yet</p>
            <p className="text-muted-foreground mt-1 max-w-xs text-sm">
              Record any meeting and you&apos;ll see your Executive Readiness score in minutes.
            </p>
          </li>
        )}
        {total > 0 && rows.length === 0 && (
          <li className="text-muted-foreground px-5 py-10 text-center text-sm">
            {flaggedOnly && type === "All"
              ? "No flagged recordings yet. Flag one from its scorecard page to bring it up with your coach."
              : "No recordings match these filters."}
          </li>
        )}
        {rows.map(({ recording, change }) => {
          const TypeIcon = TYPE_ICON[recording.type]
          const typeLabel = MEETING_TYPES[recording.type].label
          return (
            <li key={recording.id}>
              <Link
                href={`/sessions/${recording.id}`}
                className={cn(
                  ROW_GRID,
                  "hover:bg-secondary/40 focus-visible:ring-ring/50 flex items-center justify-between gap-4 px-5 py-4 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-inset sm:grid sm:px-6"
                )}
              >
                <div className="min-w-0">
                  <p className="text-foreground flex items-center gap-2 text-[15px] font-medium">
                    <span className="truncate">{recording.title}</span>
                    {recording.flaggedForCoach && (
                      <Flag
                        aria-label="Flagged for coach"
                        className="fill-oxblood text-oxblood size-3.5 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm sm:hidden">
                    {typeLabel} · {recording.dateLabel}
                  </p>
                </div>
                <span className="text-foreground/80 hidden items-center gap-2 text-sm sm:flex">
                  <TypeIcon aria-hidden className="text-muted-foreground size-4 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{typeLabel}</span>
                </span>
                <span className="text-muted-foreground hidden text-sm sm:block">{recording.dateLabel}</span>
                <span className="text-muted-foreground hidden text-sm tabular-nums sm:block">{recording.duration}</span>
                <span className="hidden justify-end sm:flex">
                  <RowChange value={change ?? 0} />
                </span>
                <span className="flex shrink-0 items-center justify-end gap-3">
                  <span className="sm:hidden">
                    <RowChange value={change ?? 0} />
                  </span>
                  <span className="text-foreground text-lg font-medium tabular-nums">{recording.score}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export { RecordingsTable }
