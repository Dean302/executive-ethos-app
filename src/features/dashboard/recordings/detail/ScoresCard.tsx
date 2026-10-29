import { RadarBreakdown } from "@/components/charts/RadarBreakdown"
import { Card } from "@/components/common/card"
import type { CriterionTarget } from "@/lib/goals"
import type { CriterionScores } from "@/lib/scores"

type ScoresCardProps = {
  scores: CriterionScores
  /** The recording before this one; null for the first. */
  previous: CriterionScores | null
  targets: CriterionTarget[]
}

/** Each criterion in this recording, against the goal and the recording before. */
function ScoresCard({ scores, previous, targets }: ScoresCardProps) {
  return (
    <Card
      className="mt-6 text-sm"
      title="Scores in this recording"
      description={
        previous
          ? "Each criterion, against your goal and the recording before this one."
          : "Your first scored recording, the baseline the rest compare against."
      }
    >
      <RadarBreakdown
        caption="CURRENT SCORE"
        compareLabel="vs previous recording"
        items={targets.map(({ key, label, goal }) => ({
          key,
          label,
          goal,
          current: scores[key],
          previous: previous?.[key] ?? null,
        }))}
      />
    </Card>
  )
}

export { ScoresCard }
