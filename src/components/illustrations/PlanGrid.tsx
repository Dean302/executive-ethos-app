const TILES = [
  [62, 30],
  [114, 30],
  [62, 78],
  [114, 78],
]

/** Leadership OS: a plan of four tiles round a progress ring, in light lines for a navy tile. */
function PlanGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={75} r={58} fill="none" strokeWidth={1.2} className="stroke-primary-foreground/16" />
      {TILES.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={44}
          height={40}
          rx={10}
          className="fill-primary-foreground/10 stroke-primary-foreground/22"
        />
      ))}
      <circle cx={84} cy={50} r={9} fill="none" strokeWidth={3} className="stroke-primary-foreground/25" />
      <circle
        cx={84}
        cy={50}
        r={9}
        fill="none"
        strokeWidth={3}
        strokeDasharray="38 57"
        strokeLinecap="round"
        transform="rotate(-90 84 50)"
        className="stroke-accent"
      />
      <rect x={124} y={44} width={24} height={4} rx={2} className="fill-primary-foreground/50" />
      <rect x={124} y={52} width={16} height={4} rx={2} className="fill-primary-foreground/30" />
      <rect x={72} y={92} width={24} height={4} rx={2} className="fill-primary-foreground/50" />
      <rect x={72} y={100} width={18} height={4} rx={2} className="fill-primary-foreground/30" />
      <path
        d="M126 98 l6 6 l12 -12"
        fill="none"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-accent"
      />
    </svg>
  )
}

export { PlanGrid }
