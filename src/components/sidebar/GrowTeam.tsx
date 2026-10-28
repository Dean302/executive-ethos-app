import * as React from "react"

/** A person as an avatar: head and shoulders clipped to the circle. */
function Person({ cx, cy, r, className, figureClassName }: { cx: number; cy: number; r: number; className: string; figureClassName: string }) {
  const id = React.useId()
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} className={className} />
      <g clipPath={`url(#${id})`} className={figureClassName}>
        <circle cx={cx} cy={cy - r * 0.18} r={r * 0.34} />
        <ellipse cx={cx} cy={cy + r * 0.82} rx={r * 0.62} ry={r * 0.5} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth={2.5} className="stroke-primary-foreground/35" />
    </g>
  )
}

/** Three leaders and a dashed seat for one more: growing the team, on the sidebar's upgrade note. */
function GrowTeam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} aria-hidden>
      <g opacity={0.75}>
        <Person cx={20} cy={22} r={15} className="fill-tone-sage-muted" figureClassName="fill-tone-sage-ink" />
      </g>
      <circle cx={47} cy={34} r={17} strokeWidth={2.5} className="fill-tone-slate-muted stroke-primary-foreground/35" />
      <text x={47} y={38.5} textAnchor="middle" fontSize={12} fontWeight={600} fontFamily="inherit" className="fill-tone-slate-ink">
        EM
      </text>
      <Person cx={78} cy={25} r={20} className="fill-tone-blush-muted" figureClassName="fill-tone-blush-ink" />
      <circle cx={118} cy={30} r={16} strokeWidth={1.6} strokeDasharray="4 4" className="fill-accent/12 stroke-accent" />
      <path d="M118 23.5 v13 M111.5 30 h13" strokeWidth={2.2} strokeLinecap="round" className="stroke-accent" />
    </svg>
  )
}

export { GrowTeam }
