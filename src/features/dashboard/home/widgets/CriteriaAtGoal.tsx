import Link from "next/link"
import { ArrowRight, Target } from "lucide-react"

import { Card } from "@/components/common/card"
import type { GoalStanding } from "@/lib/goals"

/** How many criteria are at goal, as something to act on: the two furthest away. */
function CriteriaAtGoal({ standing }: { standing: GoalStanding }) {
  return (
    <Card className="text-sm" title="Criteria at goal" icon={Target}>
      <p className="text-foreground font-sans text-2xl">
        {standing.atGoal}
        <span className="text-foreground/35">{` of ${standing.total}`}</span>
      </p>
      {standing.almost > 0 && (
        <p className="text-muted-foreground mt-0.5 text-sm">{`${standing.almost} more within half a point`}</p>
      )}
      {standing.furthest.length === 0 ? (
        <p className="text-muted-foreground mt-3 text-sm">
          All six criteria are at goal. Your coach may raise the targets at the next coaching session.
        </p>
      ) : (
        <>
          <p className="text-muted-foreground mt-3 text-sm">Furthest from goal:</p>
          <ul className="mt-1.5 flex flex-col gap-2">
            {standing.furthest.map((criterion) => (
              <li key={criterion.key} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{criterion.label}</span>
                <span className="text-muted-foreground shrink-0">{`${criterion.pointsToGo} pts to go`}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link href="/goals" className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
        See all goals
        <ArrowRight aria-hidden className="size-3.5" strokeWidth={1.75} />
      </Link>
    </Card>
  )
}

export { CriteriaAtGoal }
