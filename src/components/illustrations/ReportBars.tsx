const BARS = [26, 34, 31, 42, 48, 56]

/** A small report: bars rising to a goal line. Progress reports. */
function ReportBars({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={75} r={58} fill="none" strokeWidth={1.2} className="stroke-muted-on-dark" />
      <g style={{ filter: "drop-shadow(0 6px 10px color-mix(in srgb, var(--foreground) 12%, transparent))" }}>
        <rect x={58} y={30} width={104} height={90} rx={13} className="fill-card stroke-art-edge" />
      </g>
      <rect x={72} y={42} width={40} height={5} rx={2.5} className="fill-art-edge" />
      <line x1={70} y1={58} x2={150} y2={58} strokeOpacity={0.5} strokeDasharray="3 3" className="stroke-muted-foreground" />
      {BARS.map((height, i) => (
        <rect
          key={i}
          x={74 + i * 12.5}
          y={108 - height}
          width={8}
          height={height}
          rx={3}
          className={i === BARS.length - 1 ? "fill-foreground" : "fill-muted-on-dark"}
        />
      ))}
    </svg>
  )
}

export { ReportBars }
