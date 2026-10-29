import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

type TrendProps = {
  /** The change; null for a first entry with nothing before it. */
  value: number | null
  /** Shown for no change. */
  flatLabel?: string
  className?: string
}

/** A change since last time: green up, red down, "±0" flat, "First" with nothing to compare. */
function Trend({ value, flatLabel = "±0", className }: TrendProps) {
  if (value === null) return <span className={cn("text-muted-foreground text-sm", className)}>First</span>
  if (value === 0) return <span className={cn("text-muted-foreground text-sm", className)}>{flatLabel}</span>
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-sm font-medium",
        value > 0 ? "text-success" : "text-destructive",
        className
      )}
    >
      {value > 0 ? <ArrowUp aria-label="Up" className="size-3.5" /> : <ArrowDown aria-label="Down" className="size-3.5" />}
      {Math.abs(value)}
    </span>
  )
}

export { Trend }
