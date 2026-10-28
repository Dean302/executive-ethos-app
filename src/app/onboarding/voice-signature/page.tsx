import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import { VoiceSignatureScreen } from "@/features/onboarding/voice-signature/VoiceSignatureScreen"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Voice Signature",
}

export default async function VoiceSignaturePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell
      backHref={withProgram("/onboarding/peer-invites", planId, termDays)}
      progress={{ step: 4, total: 5 }}
    >
      <VoiceSignatureScreen nextHref={withProgram("/onboarding/session-recording", planId, termDays)} />
    </OnboardingShell>
  )
}
