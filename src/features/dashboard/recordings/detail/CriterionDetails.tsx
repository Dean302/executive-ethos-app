import type { CriterionTarget } from "@/lib/goals"
import type { CriterionScores } from "@/lib/scores"
import type { Scorecard } from "@/lib/scorecards"

import { CriterionAccordion } from "./CriterionAccordion"

type CriterionDetailsProps = {
  scores: CriterionScores
  /** The recording before this one; null for the first. */
  previous: CriterionScores | null
  targets: CriterionTarget[]
  findings: Scorecard["findings"]
}

/** The findings behind each score, one criterion at a time. */
function CriterionDetails({ scores, previous, targets, findings }: CriterionDetailsProps) {
  return (
    <section aria-labelledby="criterion-details-heading" className="mt-12">
      <h2 id="criterion-details-heading" className="font-sans text-lg font-medium">
        Criterion details
      </h2>
      <p className="text-foreground/60 mt-1 text-sm">Tap a criterion for the detail behind the score.</p>
      <div className="mt-4">
        <CriterionAccordion
          criteria={targets.map(({ key, label, goal }) => ({
            key,
            label,
            goal,
            current: scores[key],
            previous: previous?.[key] ?? null,
            ...findings[key],
          }))}
        />
      </div>
    </section>
  )
}

export { CriterionDetails }
