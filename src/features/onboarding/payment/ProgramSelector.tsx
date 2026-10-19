import * as React from "react"
import { Check } from "lucide-react"

import {
  PLAN_IDS,
  PLANS,
  TERM_DAYS,
  TERMS,
  formatUsd,
  lowestMonthlyRate,
  type PlanId,
  type TermDays,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"

/** Renders the **bold** lead phrases in a commitment as <strong>. */
function withBoldPhrases(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-foreground font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  )
}

type ProgramSelectorProps = {
  planId: PlanId
  termDays: TermDays
  onPlanChange: (planId: PlanId) => void
  onTermChange: (termDays: TermDays) => void
}

/** Plan and term pickers, with everything the selected plan includes. */
function ProgramSelector({ planId, termDays, onPlanChange, onTermChange }: ProgramSelectorProps) {
  const plan = PLANS[planId]
  const termHeadingId = React.useId()

  return (
    <div>
      <div role="group" aria-label="Plan" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PLAN_IDS.map((id) => {
          const option = PLANS[id]
          const selected = id === planId
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onPlanChange(id)}
              className={cn(
                "focus-visible:ring-ring/50 cursor-pointer rounded-panel border p-4 text-left transition-colors outline-none focus-visible:ring-3",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span className="flex items-center justify-between">
                <span className="font-heading text-base">{option.id}</span>
                {selected && <Check aria-hidden className="size-4" strokeWidth={2} />}
              </span>
              <span
                className={cn(
                  "mt-1 block text-sm",
                  selected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {option.tagline}
              </span>
              <span
                className={cn(
                  "mt-3 block text-sm font-medium",
                  selected ? "text-accent" : "text-foreground"
                )}
              >
                From {formatUsd(lowestMonthlyRate(id))}/mo
              </span>
            </button>
          )
        })}
      </div>

      <p id={termHeadingId} className="mt-6 text-sm font-medium">
        Term
      </p>
      <p className="text-muted-foreground mt-0.5 text-sm">Longer terms carry a lower monthly rate.</p>
      <div role="group" aria-labelledby={termHeadingId} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TERM_DAYS.map((days) => {
          const term = TERMS[days]
          const selected = days === termDays
          return (
            <button
              key={days}
              type="button"
              aria-pressed={selected}
              onClick={() => onTermChange(days)}
              className={cn(
                "focus-visible:ring-ring/50 cursor-pointer rounded-panel border p-3.5 text-left transition-colors outline-none focus-visible:ring-3",
                selected ? "border-primary bg-secondary/60" : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span className="font-heading block text-sm">{term.label}</span>
              <span
                className={cn(
                  "block text-sm font-medium",
                  term.discount > 0 ? "text-success" : "text-muted-foreground"
                )}
              >
                {term.sublabel}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-xl">{plan.id}</h3>
          <p className="text-muted-foreground text-sm">
            {`${plan.cadence} · roughly ${plan.hoursPerMonth} hours of direct time each month`}
          </p>
        </div>

        <dl className="divide-border mt-4 flex flex-col divide-y border-t">
          {plan.commitments.map((commitment) => (
            <div
              key={commitment.text}
              className="grid grid-cols-[100px_1fr] gap-4 py-3.5 sm:grid-cols-[120px_1fr]"
            >
              <dt className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
                {commitment.frequency}
              </dt>
              <dd className="text-muted-foreground text-[13.5px] leading-relaxed">
                {withBoldPhrases(commitment.text)}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-muted-foreground mt-4 text-sm">{plan.additionalSeatNote}</p>
      </div>
    </div>
  )
}

export { ProgramSelector }
