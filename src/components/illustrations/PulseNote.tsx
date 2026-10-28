/** A note card with two short lines and the ring behind: the weekly Pulse, a coach's note. */
function PulseNote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={75} r={58} fill="none" strokeWidth={1.2} className="stroke-muted-on-dark" />
      <rect x={58} y={40} width={92} height={76} rx={12} transform="rotate(-6 104 78)" className="fill-card stroke-art-edge" />
      <g style={{ filter: "drop-shadow(0 6px 10px color-mix(in srgb, var(--foreground) 12%, transparent))" }}>
        <rect x={70} y={32} width={96} height={84} rx={13} className="fill-card stroke-art-edge" />
      </g>
      <circle cx={86} cy={52} r={4} opacity={0.8} className="fill-success" />
      <rect x={96} y={49} width={54} height={6} rx={3} className="fill-art-edge" />
      <circle cx={86} cy={70} r={4} opacity={0.7} className="fill-destructive" />
      <rect x={96} y={67} width={44} height={6} rx={3} className="fill-art-edge" />
      <rect x={80} y={84} width={76} height={20} rx={10} className="fill-foreground" />
      <rect x={90} y={92} width={44} height={4} rx={2} className="fill-accent" />
    </svg>
  )
}

export { PulseNote }
