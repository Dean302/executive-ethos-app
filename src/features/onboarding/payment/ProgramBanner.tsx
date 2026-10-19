import { Pencil } from "lucide-react"

import { Button } from "@/components/common/button"
import { BrandMark } from "@/components/common/svg"
import {
  PLANS,
  TERMS,
  formatUsd,
  monthlyRate,
  savingsVsShortestTerm,
  termTotal,
  type PlanId,
  type TermDays,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"

type ProgramBannerProps = {
  planId: PlanId
  termDays: TermDays
  onChange: () => void
}

/** The chosen program and what it costs, on the navy-to-slate banner. */
function ProgramBanner({ planId, termDays, onChange }: ProgramBannerProps) {
  const plan = PLANS[planId]
  const savings = savingsVsShortestTerm(planId, termDays)

  const stats = [
    {
      label: "Monthly",
      value: formatUsd(monthlyRate(planId, termDays)),
      note: `${termDays}-day term`,
    },
    {
      label: "Term total",
      value: formatUsd(termTotal(planId, termDays)),
      note: `${TERMS[termDays].months} payments`,
    },
    {
      label: "You save",
      value: savings > 0 ? formatUsd(savings) : "—",
      note: "vs. 90-day rate",
      highlight: savings > 0,
    },
  ]

  return (
    <section
      aria-label="Your program"
      className="bg-gradient-navy-slate text-primary-foreground relative mt-6 overflow-hidden rounded-panel px-6 py-5"
    >
      <BrandMark className="text-accent pointer-events-none absolute -right-10 -bottom-12 size-44 opacity-[0.07]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-identifier text-primary-foreground/60 text-sm">Your program</p>
          <p className="font-heading mt-1 text-xl">{plan.id}</p>
          <p className="text-primary-foreground/70 text-sm">{plan.tagline}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onChange}
          aria-haspopup="dialog"
          className="shrink-0 gap-1.5 rounded-full"
        >
          <Pencil aria-hidden className="size-3.5" strokeWidth={1.75} />
          Change
          <span className="sr-only">program</span>
        </Button>
      </div>

      <dl className="border-primary-foreground/15 relative mt-5 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="font-identifier text-primary-foreground/55 text-sm">{stat.label}</dt>
            <dd
              className={cn(
                "font-heading mt-1 text-lg tabular-nums",
                stat.highlight ? "text-accent" : "text-primary-foreground"
              )}
            >
              {stat.value}
            </dd>
            <dd className="text-primary-foreground/55 text-sm">{stat.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export { ProgramBanner }
