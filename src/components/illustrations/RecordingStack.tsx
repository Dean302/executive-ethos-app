const BARS = [10, 18, 26, 14, 30, 20, 34, 16, 24, 12, 8]

/** Recording cards fanned round the ring, the front one with a waveform and a score chip: recordings, scoring, practice. */
function RecordingStack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={76} r={58} fill="none" strokeWidth={1.2} className="stroke-muted-on-dark" />
      <rect x={34} y={34} width={84} height={96} rx={12} transform="rotate(-9 70 80)" className="fill-card stroke-art-edge" />
      <rect x={104} y={34} width={84} height={96} rx={12} transform="rotate(7 150 80)" className="fill-card stroke-art-edge" />
      <g style={{ filter: "drop-shadow(0 6px 10px color-mix(in srgb, var(--foreground) 12%, transparent))" }}>
        <rect x={64} y={26} width={92} height={104} rx={13} className="fill-card stroke-art-edge" />
      </g>
      {BARS.map((height, i) => (
        <rect
          key={i}
          x={76 + i * 6.6}
          y={70 - height / 2}
          width={3.2}
          height={height}
          rx={1.6}
          className={i < 6 ? "fill-foreground" : "fill-muted-on-dark"}
        />
      ))}
      <rect x={76} y={98} width={38} height={18} rx={9} className="fill-foreground" />
      <text x={95} y={111} textAnchor="middle" fontSize={10} fontWeight={600} fontFamily="inherit" className="fill-accent">
        78
      </text>
      <rect x={120} y={103} width={24} height={5} rx={2.5} className="fill-art-edge" />
    </svg>
  )
}

export { RecordingStack }
