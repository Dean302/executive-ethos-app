import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import { GoalsScreen } from "@/features/onboarding/goals/GoalsScreen"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"
import { getOnboardingGoals } from "@/lib/goals"

export const metadata: Metadata = {
  title: "Your Goals",
}

export default async function GoalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)
  const goals = await getOnboardingGoals()

  return (
    <OnboardingShell backHref={withProgram("/onboarding/session-recording", planId, termDays)}>
      <GoalsScreen goals={goals} nextHref="/dashboard" />
    </OnboardingShell>
  )
}
