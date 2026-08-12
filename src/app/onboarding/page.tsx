import type { Metadata } from "next"

import { Welcome } from "@/features/onboarding"

export const metadata: Metadata = {
  title: "360° Baseline Assessment — The Executive Ethos",
}

export default function OnboardingPage() {
  return <Welcome />
}
