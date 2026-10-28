import { IllustratedCard } from "@/components/common/illustrated-card"
import { NextSheets, PlanGrid, RecordingStack } from "@/components/illustrations"
import {
  BUSINESS_ASSESSMENT,
  hasBusinessTools,
  LEADERSHIP_OS,
  LEADERSHIP_OS_UNLOCK_PERCENT,
} from "@/components/navigation/navItems"
import type { PlanId } from "@/lib/pricing"

type NextStepsProps = {
  planId: PlanId
  /** Business Assessment progress, 0–100. */
  businessAssessmentPercent: number
}

/** The Business Assessment card: start, continue, then Leadership OS once it's done. */
function BusinessAssessmentCard({ percent }: { percent: number }) {
  if (percent >= LEADERSHIP_OS_UNLOCK_PERCENT) {
    // Leadership OS isn't built yet, so there's no quarter to report on:
    // it always opens on planning. Its weekly to-dos and commitments
    // on track take this line over once it is.
    return (
      <IllustratedCard
        href={LEADERSHIP_OS.href}
        tone="navy"
        art={<PlanGrid className="w-40" />}
        title="Leadership OS"
        description="Plan the quarter: checkup, vision, people, then commitments."
        cta="Open Leadership OS"
      />
    )
  }
  const started = percent > 0
  return (
    <IllustratedCard
      href={BUSINESS_ASSESSMENT.href}
      art={<NextSheets className="w-32" />}
      title={started ? "Continue Business Assessment" : "Start Business Assessment"}
      description={
        started
          ? "Pick up where you left off. Leadership OS unlocks when it's done."
          : "Nine dimensions, ~150 questions, before Leadership OS unlocks."
      }
      cta={started ? "Continue" : "Start"}
    />
  )
}

/**
 * What to do next, as illustrated cards that are each one link: a
 * practice story, and the Business Assessment on the plans that have it.
 */
function NextSteps({ planId, businessAssessmentPercent }: NextStepsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <IllustratedCard
        href="/practice"
        art={<RecordingStack className="w-40" />}
        title="Record a practice story"
        description="A 2-minute story, not just a report, your coach's ask after your first session."
        cta="Record a story"
      />
      {hasBusinessTools(planId) && <BusinessAssessmentCard percent={businessAssessmentPercent} />}
    </div>
  )
}

export { NextSteps }
