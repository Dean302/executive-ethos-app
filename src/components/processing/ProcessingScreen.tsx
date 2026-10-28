"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

import { BrandMark } from "@/components/common/svg"
import { cn, roundTo } from "@/lib/utils"

const DEFAULT_STAGES = [
  "Uploading your recording",
  "Transcribing your words",
  "Analyzing delivery patterns",
  "Scoring against your six criteria",
  "Preparing your scorecard",
]

const STAGE_MS = 2600
/** A beat on the finished state before moving on. */
const DONE_PAUSE_MS = 700

const SIZE = 140
const CENTER = SIZE / 2
const RADIUS = CENTER - 10

function hexagon(scale: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
    return `${roundTo(CENTER + RADIUS * scale * Math.cos(angle))},${roundTo(CENTER + RADIUS * scale * Math.sin(angle))}`
  }).join(" ")
}

const RINGS = [0.35, 0.65].map(hexagon)
const OUTLINE = hexagon(1)

/** The six-criteria hexagon with a gold sweep and the breathing mark; a check once done. */
function RadarSweep({ complete }: { complete: boolean }) {
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full">
        {RINGS.map((points) => (
          <polygon key={points} points={points} fill="none" strokeWidth={1} className="stroke-border" />
        ))}
        <polygon
          points={OUTLINE}
          strokeWidth={2}
          className="stroke-primary fill-primary transition-[fill-opacity] duration-500 ease-out"
          style={{ fillOpacity: complete ? 0.14 : 0 }}
        />
      </svg>
      {complete ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-success/15 text-success flex size-9 items-center justify-center rounded-full">
            <Check aria-hidden className="size-[18px]" strokeWidth={2} />
          </span>
        </div>
      ) : (
        <>
          <div aria-hidden className="radar-sweep absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* On a cream disc so the sweep never swallows the mark as it passes. */}
            <span className="bg-background rounded-full p-1.5">
              <BrandMark className="logo-loader-glyph text-accent size-10" />
            </span>
          </div>
        </>
      )}
    </div>
  )
}

type ProcessingScreenProps = {
  /** What's being analysed, in the eyebrow: "Analyzing your {subject}". */
  subject: string
  /** Where to go once the analysis is done. */
  nextHref: string
  /** The way out while it runs. */
  exitHref?: string
  exitLabel?: string
  stages?: string[]
}

/**
 * The wait while a recording is transcribed and analysed: the stages
 * tick through, then it moves on by itself. Anticipation, not loading.
 */
function ProcessingScreen({
  subject,
  nextHref,
  exitHref = "/dashboard",
  exitLabel = "Back to dashboard",
  stages = DEFAULT_STAGES,
}: ProcessingScreenProps) {
  const router = useRouter()
  const [stage, setStage] = React.useState(0)
  const done = stage >= stages.length

  // No analysis service is connected yet, so the stages are timed: a
  // compressed version of the real one-to-three-minute wait. When it is,
  // advance them from the job's reported status instead.
  React.useEffect(() => {
    if (done) {
      const timer = setTimeout(() => router.replace(nextHref), DONE_PAUSE_MS)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setStage((current) => current + 1), STAGE_MS)
    return () => clearTimeout(timer)
  }, [done, nextHref, router, stage])

  return (
    <div className="flex flex-col items-center text-center">
      <RadarSweep complete={done} />

      <p className="text-muted-foreground mt-8 text-xs font-semibold tracking-[0.06em] uppercase">
        {`Analyzing your ${subject}`}
      </p>
      <h1 aria-live="polite" className="mt-1.5 text-3xl text-balance">
        {done ? "Your scorecard is ready" : "Give us a moment"}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-[15px]">
        This usually takes one to three minutes. Feel free to head back to your dashboard. We&apos;ll have it waiting
        when you return.
      </p>

      <ol className="mt-10 flex w-full max-w-xs flex-col gap-3 text-left">
        {stages.map((label, i) => {
          const complete = i < stage
          const active = i === stage
          return (
            <li key={label} aria-current={active ? "step" : undefined} className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  complete
                    ? "border-success bg-success text-success-foreground"
                    : active
                      ? "border-primary text-primary"
                      : "border-border text-transparent"
                )}
              >
                {complete ? (
                  <Check className="size-3" strokeWidth={2.5} />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className={cn("text-sm", complete || active ? "text-foreground" : "text-muted-foreground")}>
                {label}
                {complete && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          )
        })}
      </ol>

      <Link
        href={exitHref}
        className="text-muted-foreground hover:text-foreground mt-10 rounded-sm text-sm underline-offset-4 hover:underline"
      >
        {exitLabel}
      </Link>
    </div>
  )
}

export { ProcessingScreen }
