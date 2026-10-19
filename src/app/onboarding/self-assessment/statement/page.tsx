import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"
import { StatementScreen } from "@/features/onboarding/self-assessment/statement/StatementScreen"

export const metadata: Metadata = {
  title: "Your Mission Statement",
}

export default async function StatementPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell>
      <StatementScreen
        formHref={withProgram("/onboarding/self-assessment/form", planId, termDays)}
        nextHref={withProgram("/onboarding/self-assessment/results", planId, termDays)}
      />
    </OnboardingShell>
  )
}
