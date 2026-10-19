import { GOLDEN_CIRCLE_RINGS, type GoldenCircleRing } from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { GoldenCircleDiagram } from "../GoldenCircleDiagram"
import { RING_STYLES } from "../goldenCircleStyles"

type GoldenCircleProgressProps = {
  answered: Record<GoldenCircleRing, number>
  perRing: number
  total: number
  currentRing: GoldenCircleRing
}

/** The Golden Circle section's progress: the rings, then each ring's count. */
function GoldenCircleProgress({ answered, perRing, total, currentRing }: GoldenCircleProgressProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <GoldenCircleDiagram answered={answered} perRing={perRing} total={total} />
      <ul className="flex w-full max-w-sm flex-col gap-1.5">
        {GOLDEN_CIRCLE_RINGS.map((ring) => {
          const { tagline, badge } = RING_STYLES[ring]
          const isCurrent = ring === currentRing
          return (
            <li
              key={ring}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("flex items-center gap-3 rounded-inset px-3 py-2 transition-colors", isCurrent && "bg-secondary")}
            >
              <span
                aria-hidden
                className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold", badge)}
              >
                {ring[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-identifier text-foreground text-sm font-semibold">{ring}</p>
                <p className="text-muted-foreground text-sm">{tagline}</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                {answered[ring]}/{perRing}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { GoldenCircleProgress }
