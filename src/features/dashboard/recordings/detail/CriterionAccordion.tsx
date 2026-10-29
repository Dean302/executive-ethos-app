"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ChevronDown, Target } from "lucide-react"

import { Badge } from "@/components/common/badge"
import type { CriterionKey } from "@/lib/criteria"
import type { GoalPriority } from "@/lib/goals"
import { nextStepTarget, TRY_NEXT, type CheckTone, type CriterionFinding } from "@/lib/scorecards"
import { cn } from "@/lib/utils"

const PRIORITY_VARIANT = {
  critical: "destructive",
  high: "warning",
  medium: "secondary",
  "on-track": "success",
} as const satisfies Record<GoalPriority, string>

const PRIORITY_LABEL: Record<GoalPriority, string> = {
  critical: "Critical",
  high: "High priority",
  medium: "Medium",
  "on-track": "On track",
}

// How each check went, in the same soft status tints used elsewhere.
const CHECK_TONE: Record<CheckTone, string> = {
  good: "bg-success/10 text-success",
  warn: "bg-warning/15 text-warning",
  bad: "bg-destructive/10 text-destructive",
}

export type CriterionRow = CriterionFinding & {
  key: CriterionKey
  label: string
  /** 0–10. */
  current: number
  /** The recording before, 0–10; null for the first. */
  previous: number | null
  /** 0–10. */
  goal: number
}

/**
 * Each criterion as a row to open: its score, change and progress to the
 * goal, then what was checked, the key issue, and a realistic target with
 * one thing to try next time. Critical ones start open; rows slide open
 * and closed.
 */
function CriterionAccordion({ criteria }: { criteria: CriterionRow[] }) {
  const baseId = React.useId()
  const [open, setOpen] = React.useState<CriterionKey[]>(() =>
    criteria.filter(({ priority }) => priority === "critical").map(({ key }) => key)
  )
  const toggle = (key: CriterionKey) =>
    setOpen((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]))

  return (
    <div className="flex flex-col gap-3">
      {criteria.map((criterion) => {
        const isOpen = open.includes(criterion.key)
        const panelId = `${baseId}-${criterion.key}`
        const change = criterion.previous === null ? 0 : Math.round((criterion.current - criterion.previous) * 10) / 10
        const percent = Math.round((criterion.current / 10) * 100)
        const target = nextStepTarget(criterion.current, criterion.goal)

        return (
          <div key={criterion.key} className="border-border bg-card overflow-hidden rounded-panel border">
            <button
              type="button"
              onClick={() => toggle(criterion.key)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="focus-visible:ring-ring/50 flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-inset"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading text-base">{criterion.label}</span>
                  <Badge variant={PRIORITY_VARIANT[criterion.priority]}>{PRIORITY_LABEL[criterion.priority]}</Badge>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="text-primary font-heading text-lg">
                    {criterion.current.toFixed(1)}
                    <span className="text-muted-foreground">/10</span>
                  </span>
                  {change !== 0 && (
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-sm font-medium",
                        change > 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {change > 0 ? (
                        <ArrowUp aria-label="Up" className="size-3.5" />
                      ) : (
                        <ArrowDown aria-label="Down" className="size-3.5" />
                      )}
                      {Math.abs(change).toFixed(1)} vs last
                    </span>
                  )}
                  <div
                    aria-hidden
                    className="bg-secondary hidden h-1.5 max-w-40 flex-1 overflow-hidden rounded-full sm:block"
                  >
                    <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-muted-foreground text-sm">Goal {criterion.goal.toFixed(1)}</span>
                </div>
              </div>
              <ChevronDown
                aria-hidden
                className={cn(
                  "text-muted-foreground size-4 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isOpen && "rotate-180"
                )}
                strokeWidth={1.75}
              />
            </button>

            {/* Slides open and closed: the row grows from 0fr to 1fr while the
                details fade in. Kept in the page while closed so it can animate
                both ways, but inert, so focus and screen readers skip it. */}
            <div
              id={panelId}
              inert={!isOpen || undefined}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div
                className={cn(
                  "min-h-0 overflow-hidden transition-opacity duration-300 motion-reduce:transition-none",
                  isOpen ? "opacity-100" : "opacity-0"
                )}
              >
                  <div className="border-border border-t px-5 py-5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">What we checked</p>
                    <dl className="divide-border mt-2 divide-y">
                      {criterion.checks.map(([label, status, tone]) => (
                        <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                          <dt className="text-foreground">{label}</dt>
                          <dd className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", CHECK_TONE[tone])}>
                            {status}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {criterion.keyIssue && (
                      <div className="border-oxblood bg-tone-blush-muted/60 mt-4 rounded-inset border-l-2 px-4 py-3">
                        <p className="text-oxblood text-xs font-semibold tracking-[0.06em] uppercase">Key issue</p>
                        <p className="text-foreground/90 mt-1 text-sm leading-relaxed">{criterion.keyIssue}</p>
                      </div>
                    )}
                    <div className="bg-tone-slate-muted/60 mt-4 flex gap-3 rounded-inset px-4 py-3">
                      <Target aria-hidden className="text-muted-foreground mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                      <div className="text-sm">
                        <p className="text-foreground font-medium">
                          {target === null
                            ? `At goal. Keep it at ${criterion.goal.toFixed(1)} or above.`
                            : `Next time, aim for ${target.toFixed(1)}`}
                          {target !== null && (
                            <span className="text-muted-foreground font-normal"> on the way to {criterion.goal.toFixed(1)}</span>
                          )}
                        </p>
                        {target !== null && (
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{TRY_NEXT[criterion.key]}</p>
                        )}
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { CriterionAccordion }
