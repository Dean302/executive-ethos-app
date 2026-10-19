import type { Metadata } from "next"

import { OnboardingShell } from "@/features/onboarding"
import { PeerInvitesForm } from "@/features/onboarding/peer-invites/PeerInvitesForm"
import {
  parseProgramParams,
  withProgram,
  type SearchParams,
} from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Peer Review",
}

export default async function PeerInvitesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell
      backHref={withProgram("/onboarding/self-assessment/results", planId, termDays)}
      progress={{ step: 3, total: 5 }}
    >
      <PeerInvitesForm nextHref={withProgram("/onboarding/voice-signature", planId, termDays)} />
    </OnboardingShell>
  )
}
