import { cn, roundTo } from "@/lib/utils"

const SIZE = 132
const RADIUS = 54
const STROKE = 9
const CIRCUMFERENCE = roundTo(2 * Math.PI * RADIUS)

type ScoreRingProps = {
  /** Out of 100; null shows a dash. */
  score: number | null
  /** `dark` on navy surfaces, `light` on cream and white. */
  tone?: "dark" | "light"
  className?: string
}

/** A score out of 100 as a gold ring filling clockwise from the top, with the number inside. */
function ScoreRing({ score, tone = "dark", className }: ScoreRingProps) {
  const fraction = score === null ? 0 : Math.min(Math.max(score, 0), 100) / 100
  const dark = tone === "dark"

  return (
    <div
      role="img"
      aria-label={score === null ? "No score yet" : `${score} out of 100`}
      className={cn("relative size-[132px] shrink-0", className)}
    >
      <svg aria-hidden viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className={dark ? "stroke-primary-foreground/15" : "stroke-border"}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${roundTo(CIRCUMFERENCE * fraction)} ${CIRCUMFERENCE}`}
          className="stroke-accent"
        />
      </svg>
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-medium", dark ? "text-primary-foreground" : "text-foreground")}>
          {score ?? "—"}
        </span>
        <span className={cn("text-sm", dark ? "text-muted-on-dark" : "text-muted-foreground")}>/ 100</span>
      </div>
    </div>
  )
}

export { ScoreRing }
