import type { Metadata } from "next"
import { z } from "zod"

import { OnboardingShell, PaymentScreen } from "@/features/onboarding"
import { DEFAULT_PLAN, DEFAULT_TERM } from "@/lib/pricing"
import { planIdSchema, termDaysSchema } from "@/schemas/programSchema"

export const metadata: Metadata = {
  title: "Payment",
}

// The invite link carries the tier and term the lead picked on the
// discovery call. Anything missing or unrecognised falls back to the
// shortest commitment on the entry tier.
const prefillSchema = z.object({
  plan: planIdSchema.catch(DEFAULT_PLAN),
  term: z.coerce.number().pipe(termDaysSchema).catch(DEFAULT_TERM),
})

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { plan, term } = prefillSchema.parse(await searchParams)

  return (
    <OnboardingShell backHref="/signin">
      <PaymentScreen initialPlanId={plan} initialTermDays={term} />
    </OnboardingShell>
  )
}
