import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"
import { ResultsScreen } from "@/features/onboarding/self-assessment/results/ResultsScreen"

export const metadata: Metadata = {
  title: "Your Baseline",
}

export default async function ResultsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell>
      <ResultsScreen
        formHref={withProgram("/onboarding/self-assessment/form", planId, termDays)}
        nextHref={withProgram("/onboarding/peer-invites", planId, termDays)}
      />
    </OnboardingShell>
  )
}
