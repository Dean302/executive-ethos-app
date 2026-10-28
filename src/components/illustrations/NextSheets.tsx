/** Two pages fanned, the top one with a progress ring: the next step or section. */
function NextSheets({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <rect x={22} y={14} width={60} height={70} rx={9} transform="rotate(-8 52 49)" className="fill-card stroke-art-edge" />
      <g style={{ filter: "drop-shadow(0 4px 8px color-mix(in srgb, var(--foreground) 12%, transparent))" }}>
        <rect x={40} y={10} width={60} height={70} rx={9} className="fill-card stroke-art-edge" />
      </g>
      <circle cx={70} cy={38} r={13} fill="none" strokeWidth={3} className="stroke-art-edge" />
      <circle
        cx={70}
        cy={38}
        r={13}
        fill="none"
        strokeWidth={3}
        strokeDasharray="50 82"
        strokeLinecap="round"
        transform="rotate(-90 70 38)"
        className="stroke-foreground"
      />
      <rect x={52} y={60} width={36} height={4} rx={2} className="fill-art-edge" />
      <rect x={52} y={68} width={24} height={4} rx={2} className="fill-art-edge" />
    </svg>
  )
}

export { NextSheets }
