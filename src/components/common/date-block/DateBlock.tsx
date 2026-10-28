import { cn } from "@/lib/utils"

type DateBlockProps = {
  /** Short month, e.g. "Nov". */
  month: string
  day: number
  /** Today or tomorrow: navy with a gold month. */
  soon?: boolean
  className?: string
}

/** Month and day as a small tile, so a schedule scans by date. */
function DateBlock({ month, day, soon = false, className }: DateBlockProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-[52px] shrink-0 flex-col items-center justify-center rounded-[14px]",
        soon ? "bg-primary text-primary-foreground" : "bg-tone-slate-muted text-tone-slate-ink",
        className
      )}
    >
      <span className={cn("text-[10px] leading-none font-semibold uppercase", soon ? "text-accent" : "text-muted-foreground")}>
        {month}
      </span>
      <span className="mt-1 text-lg leading-none font-medium tabular-nums">{day}</span>
    </span>
  )
}

export { DateBlock }
