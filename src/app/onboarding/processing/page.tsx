import type { Metadata } from "next"

import { ProcessingScreen } from "@/components/processing"
import { OnboardingShell } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Analyzing your recording",
}

export default async function OnboardingProcessingPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell>
      <ProcessingScreen
        subject="onboarding recording"
        nextHref={withProgram("/onboarding/goals", planId, termDays)}
      />
    </OnboardingShell>
  )
}
