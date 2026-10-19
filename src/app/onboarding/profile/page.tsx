import type { Metadata } from "next"

import { OnboardingShell, ProfileIntake } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Executive Profile",
}

export default async function ProfilePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  // No account data yet, so the profile has no name. When accounts
  // exist, pass the signed-in lead's name and initials as `person`.
  return (
    <OnboardingShell>
      <ProfileIntake
        backHref={withProgram("/onboarding/schedule", planId, termDays)}
        nextHref={withProgram("/onboarding/self-assessment", planId, termDays)}
      />
    
    </OnboardingShell>
  )
}
