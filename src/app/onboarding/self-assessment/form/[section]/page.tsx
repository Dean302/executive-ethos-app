import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"
import { FormSection } from "@/features/onboarding/self-assessment/form/FormSection"
import { formSectionHrefs } from "@/features/onboarding/self-assessment/form/sectionHrefs"
import { getSection } from "@/lib/selfAssessment"

type PageProps = {
  params: Promise<{ section: string }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const section = getSection((await params).section)
  return { title: section ? `${section.title} · Self-Assessment` : "Self-Assessment" }
}

export default async function SelfAssessmentSectionPage({ params, searchParams }: PageProps) {
  const [{ section: sectionId }, query] = await Promise.all([params, searchParams])
  const section = getSection(sectionId)
  if (!section) notFound()

  const { planId, termDays } = parseProgramParams(query)

  return (
    <FormSection
      sectionId={section.id}
      sectionHrefs={formSectionHrefs(planId, termDays)}
      pickerHref={withProgram("/onboarding/self-assessment", planId, termDays)}
      finishHref={withProgram("/onboarding/self-assessment/statement", planId, termDays)}
    />
  )
}
