import type { Metadata } from "next"

import { OnboardingShell, ScheduleScreen } from "@/features/onboarding"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"
import { getCoachAvailability } from "@/features/onboarding/schedule/coachAvailability"

export const metadata: Metadata = {
  title: "Schedule",
}

export default async function SchedulePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [{ planId, termDays }, availability] = await Promise.all([
    searchParams.then(parseProgramParams),
    getCoachAvailability(),
  ])

  return (
    <OnboardingShell
      backHref={withProgram("/onboarding/welcome", planId, termDays)}
      progress={{ step: 1, total: 5 }}
    >
      <ScheduleScreen planId={planId} termDays={termDays} availability={availability} />
    </OnboardingShell>
  )
}
