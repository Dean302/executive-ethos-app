import type { Metadata } from "next"

import { OnboardingShell, WelcomeScreen } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Welcome",
}

export default async function WelcomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  // No account data yet, so the greeting has no name. When accounts
  // exist, pass the signed-in lead's first name to WelcomeScreen.
  return (
    <OnboardingShell wide>
      <WelcomeScreen nextHref={withProgram("/onboarding/schedule", planId, termDays)} />
    </OnboardingShell>
  )
}
