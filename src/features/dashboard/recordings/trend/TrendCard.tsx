"use client"

import * as React from "react"

import { ScoreTrend } from "@/components/charts/ScoreTrend"
import { Button } from "@/components/common/button"
import { Card } from "@/components/common/card"
import { LoadingVeil } from "@/components/common/loading-veil"
import { Select } from "@/components/common/select"
import { useSettling } from "@/hooks"
import { formatRangeLabel, isWithinRange } from "@/lib/dates"
import type { Recording } from "@/lib/recordings"
import { cn } from "@/lib/utils"

import { TREND_RANGES, type TrendRangeKey } from "./ranges"
import { TrendStats } from "./TrendStats"

type TrendCardProps = {
  /** Newest first. */
  recordings: Recording[]
  /** Today on the executive's clock, wall-clock milliseconds. */
  today: number
}

/** Executive Readiness over a chosen range, with its headline numbers. The range applies to this card only. */
function TrendCard({ recordings, today }: TrendCardProps) {
  const [rangeKey, setRangeKey] = React.useState<TrendRangeKey>("allTime")
  const settling = useSettling(rangeKey)
  const selectId = React.useId()

  const preset = TREND_RANGES.find(({ key }) => key === rangeKey)!
  const range = preset.range(new Date(today))
  const inRange = recordings.filter((recording) => isWithinRange(new Date(recording.recordedAt), range))
  const [newest] = inRange
  const oldest = inRange[inRange.length - 1]
  const change = inRange.length >= 2 ? newest.score - oldest.score : null
  // All time starts at the first recording, not the range's floor.
  const domain: [number, number] =
    rangeKey === "allTime" && recordings.length
      ? [recordings[recordings.length - 1].recordedAt, range.end.getTime()]
      : [range.start.getTime(), range.end.getTime()]

  // Written as separate pieces, as in the design, so the line kerns the same.
  const description =
    inRange.length === 0 ? (
      `No recordings in ${preset.label.toLowerCase()}`
    ) : (
      <>
        {inRange.length} recording{inRange.length === 1 ? "" : "s"} · {range.label}
        {change !== null && (
          <>
            {" · "}
            {oldest.score} → {newest.score}{" "}
            <span
              className={cn(
                "font-medium",
                change > 0 ? "text-success" : change < 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {change > 0 ? "+" : ""}
              {change} pts
            </span>
          </>
        )}
      </>
    )

  return (
    <Card
      className="mt-8 text-sm"
      title="Score trend"
      description={description}
      action={
        <>
          <label htmlFor={selectId} className="sr-only">
            Date range
          </label>
          <Select id={selectId} value={rangeKey} onChange={(event) => setRangeKey(event.target.value as TrendRangeKey)}>
            {TREND_RANGES.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </>
      }
    >
      {recordings.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">Your trend starts with your first recording.</p>
      ) : inRange.length === 0 ? (
        <div className="border-border flex flex-col items-center gap-3 rounded-inset border border-dashed py-14 text-center">
          <p className="text-muted-foreground text-sm">
            {`No recordings between ${formatRangeLabel(range.start, range.end)}.`}
          </p>
          <Button size="sm" variant="outline" onClick={() => setRangeKey("allTime")}>
            Show all time
          </Button>
        </div>
      ) : (
        <LoadingVeil active={settling} label="Updating chart">
          <TrendStats scores={inRange.map((recording) => recording.score)} />
          <ScoreTrend
            points={inRange.map(({ recordedAt, score, title }) => ({ at: recordedAt, score, title }))}
            domain={domain}
          />
        </LoadingVeil>
      )}
    </Card>
  )
}

export { TrendCard }
