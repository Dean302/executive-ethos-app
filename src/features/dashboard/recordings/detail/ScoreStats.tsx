import { ArrowDown, ArrowUp, Check } from "lucide-react"

import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"
import { targetFor } from "@/lib/scores"
import { cn } from "@/lib/utils"

const TILE = "border-border bg-card flex min-h-[130px] flex-col justify-center rounded-panel border p-6"
const LABEL = "text-foreground/60 font-sans text-base leading-5 font-normal"
const VALUE = "text-foreground mt-2.5 font-sans text-2xl leading-[30px] font-normal"
const NOTE = "text-foreground/60 mt-1 text-sm"
const points = (n: number) => (n === 1 ? "point" : "points")

type ScoreStatsProps = {
  score: number
  /** The recording before this one; null for the first. */
  previousScore: number | null
}

/** This recording's score, the Executive Ready goal, and the distance between them. */
function ScoreStats({ score, previousScore }: ScoreStatsProps) {
  const change = previousScore === null ? null : score - previousScore
  const reached = score >= EXECUTIVE_READY_SCORE
  const gap = Math.max(EXECUTIVE_READY_SCORE - score, 0)
  const above = score - EXECUTIVE_READY_SCORE
  const next = targetFor(score)

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className={TILE}>
        <p className={LABEL}>Current Score</p>
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-foreground font-sans text-2xl leading-[30px] font-normal">
            {score}
            <span className="text-foreground/35"> / 100</span>
          </span>
          {change === null ? (
            <span className="text-foreground/60 text-sm">Your baseline</span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                change >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {change >= 0 ? (
                <ArrowUp aria-label="Up" className="size-3.5" />
              ) : (
                <ArrowDown aria-label="Down" className="size-3.5" />
              )}
              {Math.abs(change)} vs previous recording ({previousScore})
            </span>
          )}
        </div>
      </div>

      <div className={TILE}>
        <p className={LABEL}>Goal Score</p>
        <p className={VALUE}>
          {EXECUTIVE_READY_SCORE}
          <span className="text-foreground/35"> / 100</span>
        </p>
        {reached ? (
          <p className="text-success mt-1 flex items-center gap-1 text-sm font-medium">
            <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
            Executive Ready · reached
          </p>
        ) : (
          <p className={NOTE}>Executive Ready</p>
        )}
      </div>

      <div className={TILE}>
        <p className={LABEL}>{!reached ? "Improvement Needed" : above === 0 ? "Goal Reached" : "Above Goal"}</p>
        {!reached ? (
          <p className={VALUE}>
            {gap}
            <span className="text-foreground/35"> {points(gap)}</span>
          </p>
        ) : above === 0 ? (
          <p className={cn(VALUE, "text-success")}>On target</p>
        ) : (
          <p className={cn(VALUE, "text-success")}>
            +{above}
            <span className="text-success/60"> {points(above)}</span>
          </p>
        )}
        <p className={NOTE}>
          {!reached
            ? "To reach your goal"
            : next
              ? `Next level: ${next.label} at ${next.at}, ${next.at - score} ${points(next.at - score)} away`
              : "Top level: Executive mastery"}
        </p>
      </div>
    </div>
  )
}

export { ScoreStats }
