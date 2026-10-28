import { ArrowDown, ArrowUp } from "lucide-react"

import { ScoreRing } from "@/components/charts/ScoreRing"
import { RecordCta } from "@/components/recorder"
import { BrandMark } from "@/components/common/svg"
import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"
import { formatChange, levelFor, targetFor, type Readiness } from "@/lib/scores"
import { cn } from "@/lib/utils"

import { LevelsInfo } from "./LevelsInfo"
import { ReadinessBar } from "./ReadinessBar"

function toGoLine(readiness: Readiness | null) {
  if (!readiness) return "Your score appears after your first recording."
  const { score } = readiness
  if (score < EXECUTIVE_READY_SCORE) return `${EXECUTIVE_READY_SCORE - score} points to Executive Ready`
  const target = targetFor(score)
  return target ? `Executive Ready, ${target.at - score} points to ${target.label}` : "Executive Ready, at the top level"
}

type StatProps = {
  label: string
  value: string
  detail: string
  /** Growth reads green and decline red, in their on-navy shades. */
  change?: number | null
}

function Stat({ label, value, detail, change }: StatProps) {
  return (
    <div>
      <dt className="text-muted-on-dark text-sm">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-2xl font-medium",
          !change ? "text-primary-foreground" : change > 0 ? "text-success-on-dark" : "text-destructive-on-dark"
        )}
      >
        {value}
      </dd>
      <dd className="text-muted-on-dark mt-0.5 text-sm">{detail}</dd>
    </div>
  )
}

/**
 * Executive Readiness, the most important number, as the dashboard's
 * lead: the score and its level, how far to Executive Ready, the action
 * that moves it, and the growth story since the baseline.
 */
function ReadinessBanner({ readiness }: { readiness: Readiness | null }) {
  const level = readiness ? levelFor(readiness.score) : null

  return (
    <section
      aria-labelledby="readiness-heading"
      className="bg-gradient-navy-slate text-primary-foreground relative overflow-hidden rounded-container p-6 sm:p-8"
    >
      {/* The filled mark as a faint watermark bleeding off the corner. */}
      <BrandMark className="text-primary-foreground pointer-events-none absolute -right-16 -bottom-14 size-[300px] opacity-5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <ScoreRing score={readiness?.score ?? null} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="readiness-heading" className="text-muted-on-dark font-sans text-sm">
              Executive Readiness
            </h2>
            {readiness?.lastChange ? (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-sm font-medium",
                  readiness.lastChange > 0
                    ? "bg-success-on-dark/15 text-success-on-dark"
                    : "bg-destructive-on-dark/15 text-destructive-on-dark"
                )}
              >
                {readiness.lastChange > 0 ? (
                  <ArrowUp aria-label="Up" className="size-3.5" />
                ) : (
                  <ArrowDown aria-label="Down" className="size-3.5" />
                )}
                {`${Math.abs(readiness.lastChange)} vs last recording`}
              </span>
            ) : null}
          </div>
          <p className="text-primary-foreground mt-1 flex items-center gap-2 text-2xl font-medium">
            {level ? level.name : "No score yet"}
            {readiness && <LevelsInfo score={readiness.score} />}
          </p>
          <p className="text-primary-foreground/80 mt-1 text-base">{toGoLine(readiness)}</p>
          {readiness && <ReadinessBar score={readiness.score} target={targetFor(readiness.score)} />}
        </div>

        <RecordCta variant="onDark" className="shrink-0 self-start lg:self-center" />
      </div>

      {readiness && readiness.recordings < 2 && (
        // One recording: the starting score is the score, so it's shown as
        // the baseline rather than "+0" and a blank average.
        <dl className="border-primary-foreground/10 relative mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-end sm:gap-10">
          <Stat
            label="Starting score"
            value={String(readiness.start.score)}
            detail={`${levelFor(readiness.start.score).name} · ${readiness.start.dateLabel}`}
          />
          <p className="text-muted-on-dark max-w-md text-sm">
            This is your baseline, from the onboarding recording. Growth and averages show up from the second
            recording.
          </p>
        </dl>
      )}

      {readiness && readiness.recordings >= 2 && (
        <dl className="border-primary-foreground/10 relative mt-6 grid grid-cols-2 gap-5 border-t pt-5 lg:grid-cols-4">
          <Stat
            label="Starting score"
            value={String(readiness.start.score)}
            detail={`${levelFor(readiness.start.score).name} · ${readiness.start.dateLabel}`}
          />
          <Stat
            label="Latest score"
            value={String(readiness.score)}
            detail={`${levelFor(readiness.score).name} · ${readiness.latest.dateLabel}`}
          />
          <Stat
            label="Total growth"
            value={formatChange(readiness.totalGrowth)}
            detail="pts since the first recording"
            change={readiness.totalGrowth}
          />
          <Stat
            label="Per recording"
            value={readiness.perRecording === null ? "—" : formatChange(readiness.perRecording)}
            detail={`avg across ${readiness.recordings} recordings`}
            change={readiness.perRecording}
          />
        </dl>
      )}
    </section>
  )
}

export { ReadinessBanner }
