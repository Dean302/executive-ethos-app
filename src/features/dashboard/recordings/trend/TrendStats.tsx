import { EXECUTIVE_READY_SCORE } from "@/lib/criteria"

/**
 * The numbers above the trend, newest score first: the latest in the navy
 * score chip, then best, average, and the distance to Executive Ready (or
 * how many reached it, once the latest has).
 */
function TrendStats({ scores }: { scores: number[] }) {
  const [latest] = scores
  const best = Math.max(...scores)
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  const ready = scores.filter((score) => score >= EXECUTIVE_READY_SCORE).length
  const gap = EXECUTIVE_READY_SCORE - latest
  const stats = [
    { label: "Best", value: best },
    { label: "Average", value: average },
    gap > 0
      ? { label: "To Executive Ready", value: `${gap} pts` }
      : { label: "Executive Ready", value: `${ready} of ${scores.length}` },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 items-center gap-x-6 gap-y-4 sm:flex sm:gap-x-8">
      <div className="flex items-center gap-3">
        <p className="bg-primary text-accent flex h-12 min-w-16 items-center justify-center rounded-full px-4 font-heading text-2xl tabular-nums">
          {latest}
        </p>
        <p className="text-muted-foreground text-sm leading-tight">
          Latest
          <br />
          score
        </p>
      </div>
      {stats.map(({ label, value }) => (
        <div key={label} className="sm:border-border sm:border-l sm:pl-6">
          <p className="text-foreground font-heading text-2xl tabular-nums">{value}</p>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      ))}
    </div>
  )
}

export { TrendStats }
