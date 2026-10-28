import { Person } from "./Person"

/** Three leaders, the middle one in the primary colour with a done tick: peer reviews. */
function PeerRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <circle cx={110} cy={75} r={58} fill="none" strokeWidth={1.2} strokeDasharray="3 5" className="stroke-muted-on-dark" />
      <Person cx={76} cy={80} r={20} className="fill-tone-slate-muted" figureClassName="fill-tone-slate" ringClassName="stroke-card" />
      <Person cx={144} cy={80} r={20} className="fill-tone-slate-muted" figureClassName="fill-tone-slate" ringClassName="stroke-card" />
      <Person cx={110} cy={72} r={25} className="fill-primary" figureClassName="fill-primary-foreground" ringClassName="stroke-card" />
      <circle cx={131} cy={52} r={9} strokeWidth={2.5} className="fill-success stroke-card" />
      <path
        d="M127 52 l2.6 2.6 l5 -5"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-card"
      />
    </svg>
  )
}

export { PeerRing }
