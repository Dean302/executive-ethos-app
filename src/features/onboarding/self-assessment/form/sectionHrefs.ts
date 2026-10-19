import type { PlanId, TermDays } from "@/lib/pricing"
import { ASSESSMENT_SECTIONS } from "@/lib/selfAssessment"

import { withProgram } from "../../programParams"

/** Each form section's page, keyed by section id. */
export function formSectionHrefs(planId: PlanId, termDays: TermDays) {
  return Object.fromEntries(
    ASSESSMENT_SECTIONS.map((section) => [
      section.id,
      withProgram(`/onboarding/self-assessment/form/${section.id}`, planId, termDays),
    ])
  )
}
