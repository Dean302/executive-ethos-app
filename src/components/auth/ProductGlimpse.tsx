import * as React from "react"

import { cn } from "@/lib/utils"

type Tone = "sage" | "slate" | "blush"

// Static classes per tone so Tailwind can see every utility.
const TONE_CLASSES: Record<Tone, { chip: string; track: string; bar: string }> = {
  sage: { chip: "bg-tone-sage-muted text-glimpse-chip-sage", track: "bg-glimpse-track-sage", bar: "bg-tone-sage" },
  slate: { chip: "bg-tone-slate-muted text-slate", track: "bg-glimpse-track-slate", bar: "bg-tone-slate" },
  blush: { chip: "bg-tone-blush-muted text-glimpse-chip-blush", track: "bg-glimpse-track-blush", bar: "bg-tone-blush" },
}

// Sample data — the glimpse is an illustration, not a live readout.
const READINESS = { score: 78, label: "Proficient", change: 7, toReady: 7 }

const CRITERIA: { label: string; value: number; target: number; status: string; tone: Tone }[] = [
  { label: "Clarity & Structure", value: 8.0, target: 8.5, status: "Close", tone: "sage" },
  { label: "Vocal Energy & Pacing", value: 7.2, target: 8.0, status: "Improving", tone: "slate" },
  { label: "Time Management & Flow", value: 6.2, target: 8.0, status: "Focus", tone: "blush" },
]

const TREND = [58, 61, 64, 61, 65, 69, 71, 78]

const PULSE_NOTE =
  "Pause before you answer the hard question. Two seconds reads as confidence."

/** Circular 0–100 score with the value at its centre. Decorative. */
function ScoreRing({ score }: { score: number }) {
  const gradientId = React.useId()
  const radius = 26
  const circumference = 2 * Math.PI * radius
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="size-16 shrink-0">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--glimpse-ring-start)" />
          <stop offset="100%" stopColor="var(--tone-slate-ink)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--glimpse-track-slate)" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(circumference * score) / 100} ${circumference}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" fontSize="16" fontWeight="500" fill="currentColor">
        {score}
      </text>
    </svg>
  )
}

/** Small filled trend line, last point marked. Decorative. */
function Sparkline({ points }: { points: number[] }) {
  const gradientId = React.useId()
  const min = 55
  const range = 25
  const xy = points.map((v, i) => [
    4 + (i * 88) / (points.length - 1),
    35 - ((v - min) / range) * 25,
  ])
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const [lastX, lastY] = xy[xy.length - 1]

  return (
    <svg viewBox="0 0 96 40" aria-hidden className="h-10 w-24">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--tone-slate-strong)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--tone-slate-strong)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`4,40 ${line} ${lastX},40`} fill={`url(#${gradientId})`} />
      <polyline
        points={line}
        fill="none"
        stroke="var(--tone-slate-strong)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="3.2" fill="var(--tone-slate-ink)" stroke="var(--brand-white)" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * The product in miniature — a readiness card and a coach's Pulse note —
 * for marketing surfaces such as the sign-in brand panel. Decorative, so
 * it's hidden from assistive technology.
 */
function ProductGlimpse({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative mx-auto mt-4 mb-20 w-full max-w-md", className)}>
      <div className="bg-card text-card-foreground shadow-float relative rounded-[22px] p-5">
        <div className="flex items-center gap-4">
          <ScoreRing score={READINESS.score} />
          <div>
            <p className="text-muted-foreground text-[11px]">Executive Readiness</p>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-[17px] font-medium">{READINESS.label}</p>
              <span className="bg-tone-sage-muted text-glimpse-gain rounded-full px-2 py-0.5 text-[10.5px] font-medium">
                +{READINESS.change}
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {READINESS.toReady} points to Executive Ready
            </p>
          </div>
          <div className="ml-auto self-start text-right">
            <Sparkline points={TREND} />
            <p className="text-muted-foreground mt-0.5 text-[10px]">
              Last {TREND.length} recordings
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {CRITERIA.map((row) => {
            const tone = TONE_CLASSES[row.tone]
            return (
              <div key={row.label}>
                <div className="flex items-center justify-between gap-2 text-[11.5px]">
                  <span className="flex items-center gap-1.5">
                    {row.label}
                    <span className={cn("rounded-full px-1.5 py-px text-[9.5px] font-medium", tone.chip)}>
                      {row.status}
                    </span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {row.value.toFixed(1)} / {row.target.toFixed(1)}
                  </span>
                </div>
                <div className={cn("relative mt-1 h-1.5 rounded-full", tone.track)}>
                  <div
                    className={cn("h-full rounded-full", tone.bar)}
                    style={{ width: `${row.value * 10}%` }}
                  />
                  <div
                    className="bg-foreground/50 absolute -top-0.5 h-2.5 w-0.5 rounded-full"
                    style={{ left: `${row.target * 10}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-navy-deep/70 shadow-float-note absolute right-[-10%] -bottom-20 z-10 w-[60%] rounded-[18px] p-4 ring-1 ring-white/20 backdrop-blur-2xl backdrop-saturate-150">
        <p className="text-gold-light text-[10.5px] font-semibold tracking-[0.08em] uppercase">
          Pulse note from your coach
        </p>
        <p className="mt-1.5 text-[13.5px] leading-snug font-medium text-white">
          {PULSE_NOTE}
        </p>
      </div>
    </div>
  )
}

export { ProductGlimpse }
