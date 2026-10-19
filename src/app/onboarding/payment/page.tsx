import type { Metadata } from "next"

import { OnboardingShell, PaymentScreen } from "@/features/onboarding"
import { parseProgramParams, type SearchParams } from "@/features/onboarding/programParams"

export const metadata: Metadata = {
  title: "Payment",
}

export default async function PaymentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Prefilled with the tier and term the lead picked on the discovery call.
  const { planId, termDays } = parseProgramParams(await searchParams)

  return (
    <OnboardingShell backHref="/signin">
      <PaymentScreen initialPlanId={planId} initialTermDays={termDays} />
    </OnboardingShell>
  )
}
