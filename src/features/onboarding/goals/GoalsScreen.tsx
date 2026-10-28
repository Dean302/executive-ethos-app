"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Lock } from "lucide-react"

import { Badge } from "@/components/common/badge"
import { Button } from "@/components/common/button"
import { Checkbox } from "@/components/common/checkbox"
import { goalGap, PRIORITY_LABEL, type CriterionGoal, type GoalPriority } from "@/lib/goals"

import { lockGoals } from "./actions"

const PRIORITY_VARIANT = {
  critical: "destructive",
  high: "warning",
  medium: "secondary",
  "on-track": "success",
} as const satisfies Record<GoalPriority, string>

type GoalsScreenProps = {
  /** Ranked, highest priority first. */
  goals: CriterionGoal[]
  nextHref: string
}

/**
 * Review and lock the quarter's goals. They're generated from the
 * baseline, not edited here, and lock once confirmed, so each is written
 * as a plain sentence, the steepest climb gets its own moment, and
 * confirming takes a deliberate acknowledgement.
 */
function GoalsScreen({ goals, nextHref }: GoalsScreenProps) {
  const router = useRouter()
  const [acknowledged, setAcknowledged] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [steepest] = goals

  const lock = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await lockGoals({ acknowledged })
        if ("error" in result) setError(result.error)
        else router.push(nextHref)
      } catch {
        setError("We couldn't lock your goals. Check your connection and try again.")
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">Your Goals</p>
      <h1 className="mt-1.5 text-3xl text-balance">This is what you&apos;re signing up for, not just a score</h1>
      <p className="text-muted-foreground mt-2 text-[15px]">
        These come straight from the gap between today&apos;s baseline and Executive Ready. Confirm them and they
        hold for the full quarter: your coach, your scorecard, every recording from here measures against exactly
        these numbers. No quiet edits later.
      </p>

      {steepest && (
        <div className="border-oxblood/30 bg-oxblood/5 mt-8 rounded-panel border px-5 py-4 text-left">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.06em] uppercase">
            Your steepest climb
          </p>
          <p className="text-foreground mt-1.5 text-[15px] leading-relaxed">
            <span className="font-heading">{steepest.label}</span> needs the most work. Improve it from{" "}
            <span className="text-primary font-semibold">{steepest.current.toFixed(1)}</span> to{" "}
            <span className="text-primary font-semibold">{steepest.goal.toFixed(1)}</span>
            {` this quarter, a full ${goalGap(steepest).toFixed(1)}-point move.`}
          </p>
        </div>
      )}

      <ul className="mt-6 flex flex-col gap-2.5 text-left">
        {goals.map((goal) => (
          <li
            key={goal.key}
            className="border-border bg-card flex items-center justify-between gap-3 rounded-panel border px-4 py-3.5"
          >
            <p className="text-foreground/90 text-sm">
              Improve <span className="font-medium">{goal.label}</span> from{" "}
              <span className="text-muted-foreground font-medium">{goal.current.toFixed(1)}</span> to{" "}
              <span className="text-primary font-medium">{goal.goal.toFixed(1)}</span>.
            </p>
            <Badge variant={PRIORITY_VARIANT[goal.priority]}>{PRIORITY_LABEL[goal.priority]}</Badge>
          </li>
        ))}
      </ul>

      <label className="border-border bg-card hover:border-primary/30 mt-6 flex w-full cursor-pointer items-start gap-3 rounded-panel border px-4 py-3.5 text-left transition-colors">
        <Checkbox
          className="mt-0.5 size-5 rounded-md"
          checked={acknowledged}
          onCheckedChange={(checked) => setAcknowledged(checked)}
          disabled={isPending}
        />
        <span className="text-foreground/90 text-sm">
          I understand these targets lock for the quarter once I confirm: no edits, no do-overs.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-destructive mt-4 flex items-start justify-center gap-1.5 text-sm">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}

      <Button size="lg" className="mt-6 gap-2" disabled={!acknowledged || isPending} onClick={lock}>
        <Lock aria-hidden strokeWidth={1.75} />
        {isPending ? "Locking…" : "Lock in my goals"}
      </Button>
      <p className="text-muted-foreground mt-3 text-sm">
        Visible to your coach. Tracked with every recording, all quarter.
      </p>
    </div>
  )
}

export { GoalsScreen }
