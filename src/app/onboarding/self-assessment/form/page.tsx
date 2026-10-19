import type { Metadata } from "next"

import { parseProgramParams, type SearchParams } from "@/features/onboarding/programParams"
import { FormResume } from "@/features/onboarding/self-assessment/form/FormResume"
import { formSectionHrefs } from "@/features/onboarding/self-assessment/form/sectionHrefs"

export const metadata: Metadata = {
  title: "Self-Assessment",
}

export default async function SelfAssessmentFormPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)
  return <FormResume sectionHrefs={formSectionHrefs(planId, termDays)} />
}
