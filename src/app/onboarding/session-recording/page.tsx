import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import { SessionRecordingScreen } from "@/features/onboarding/session-recording/SessionRecordingScreen"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Session Recording",
}

export default async function SessionRecordingPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell
      backHref={withProgram("/onboarding/voice-signature", planId, termDays)}
      progress={{ step: 5, total: 5 }}
    >
      <SessionRecordingScreen nextHref={withProgram("/onboarding/goals", planId, termDays)} />
    </OnboardingShell>
  )
}
