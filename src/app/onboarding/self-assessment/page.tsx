import type { Metadata } from "next"

import { ModePicker, OnboardingShell } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Self-Assessment",
}

export default async function SelfAssessmentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell>
      <ModePicker
        hrefs={{
          chat: withProgram("/onboarding/self-assessment/chat", planId, termDays),
          form: withProgram("/onboarding/self-assessment/form", planId, termDays),
        }}
        backHref={withProgram("/onboarding/profile", planId, termDays)}
      />
    </OnboardingShell>
  )
}
