const DAYS = Array.from({ length: 12 }, (_, i) => i)
/** The marked day. */
const MARKED = 6

/** A calendar page with one day marked: workshops, scheduling. */
function CalendarSheet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={75} r={58} fill="none" strokeWidth={1.2} className="stroke-muted-on-dark" />
      <g style={{ filter: "drop-shadow(0 6px 10px color-mix(in srgb, var(--foreground) 12%, transparent))" }}>
        <rect x={62} y={30} width={96} height={92} rx={13} className="fill-card stroke-art-edge" />
      </g>
      <rect x={62} y={30} width={96} height={22} rx={13} className="fill-foreground" />
      <rect x={62} y={42} width={96} height={10} className="fill-foreground" />
      <rect x={80} y={38} width={30} height={5} rx={2.5} className="fill-accent" />
      {DAYS.map((day) => {
        const x = 74 + (day % 4) * 20
        const y = 62 + Math.floor(day / 4) * 18
        return day === MARKED ? (
          <rect key={day} x={x - 2} y={y - 2} width={16} height={13} rx={4} className="fill-foreground" />
        ) : (
          <rect key={day} x={x} y={y} width={12} height={9} rx={3} className="fill-art-edge" />
        )
      })}
    </svg>
  )
}

export { CalendarSheet }
