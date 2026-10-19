import { RATING_SCALE, RATING_VALUES } from "@/lib/selfAssessment"
import { cn } from "@/lib/utils"

import { RATING_TONES } from "../ratingTones"

type RatingScaleProps = {
  value: number | undefined
  onChange: (value: number) => void
  /** Id of the element naming what's being rated. */
  labelledBy: string
}

/** The 1–5 scale as full-width options, each with what the number means. */
function RatingScale({ value, onChange, labelledBy }: RatingScaleProps) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-col gap-2">
      {RATING_VALUES.map((n) => {
        const selected = value === n
        const { label, description } = RATING_SCALE[n - 1]
        return (
          <button
            key={n}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(n)}
            className={cn(
              "focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-4 rounded-panel border px-4 py-3.5 text-left transition-colors outline-none focus-visible:ring-3",
              selected ? "border-primary bg-primary/5 ring-primary ring-1" : "border-border bg-card hover:border-primary/40"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-md border-[1.5px] text-sm font-semibold transition-all duration-150",
                selected ? RATING_TONES[n] : "border-border bg-card text-muted-foreground"
              )}
            >
              {n}
            </span>
            <span>
              <span className="text-foreground block text-[14.5px] font-medium">
                <span className="sr-only">{n}: </span>
                {label}
              </span>
              <span className="text-muted-foreground mt-0.5 block text-[12.5px] leading-snug">{description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export { RatingScale }
